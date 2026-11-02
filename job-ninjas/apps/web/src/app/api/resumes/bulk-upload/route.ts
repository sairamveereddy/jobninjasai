import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

function extractEmail(text: string): string | null {
  const match = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  return match ? match[0].toLowerCase() : null;
}

function extractPhone(text: string): string | null {
  const match = text.match(/(?:\+?1[-.\s]?)?\(?[2-9]\d{2}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  return match ? match[0] : null;
}

function extractNameFromTextOrFilename(text: string, filename: string): { firstName: string; lastName: string } {
  // First attempt: clean up filename
  const cleanFilename = filename
    .replace(/\.[^/.]+$/, "") // remove extension
    .replace(/(?:resume|cv|curriculum\s*vitae|updated|final|draft)/gi, "")
    .replace(/[_\-+]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const fileParts = cleanFilename.split(" ").filter(Boolean);
  if (fileParts.length >= 2 && fileParts[0].length >= 2 && fileParts[1].length >= 2) {
    return {
      firstName: fileParts[0].charAt(0).toUpperCase() + fileParts[0].slice(1),
      lastName: fileParts.slice(1).map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(" ")
    };
  }

  // Second attempt: first non-empty lines in resume text
  const lines = text
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => line.length > 0 && line.length < 50 && !line.includes('@') && !line.includes('http'));

  if (lines.length > 0) {
    const firstLineWords = lines[0].split(/\s+/).filter(Boolean);
    if (firstLineWords.length >= 2 && firstLineWords.length <= 4) {
      return {
        firstName: firstLineWords[0],
        lastName: firstLineWords.slice(1).join(" ")
      };
    }
  }

  return {
    firstName: fileParts[0] ? fileParts[0] : "Candidate",
    lastName: fileParts[1] ? fileParts.slice(1).join(" ") : `(${filename.slice(0, 10)})`
  };
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const roleId = formData.get('roleId') as string;
    const files = formData.getAll('files') as File[];

    if (!roleId) {
      return NextResponse.json({ success: false, error: 'Missing roleId' }, { status: 400 });
    }

    if (!files || files.length === 0) {
      return NextResponse.json({ success: false, error: 'No files uploaded' }, { status: 400 });
    }

    const processedCandidates: any[] = [];
    const errors: string[] = [];

    for (const file of files) {
      try {
        const buffer = Buffer.from(await file.arrayBuffer());
        let extractedText = '';

        try {
          const pdfPkg: any = require('pdf-parse');
          if (typeof pdfPkg === 'function') {
            const pdfData = await pdfPkg(buffer);
            extractedText = pdfData?.text || '';
          } else if (pdfPkg?.PDFParse) {
            const parser = new pdfPkg.PDFParse({ data: buffer });
            const pdfData = await parser.getText();
            extractedText = pdfData?.text || '';
          }
        } catch (e: any) {
          console.warn(`PDF parse fallback for ${file.name}:`, e?.message);
        }

        if (!extractedText) {
          extractedText = buffer.toString('utf-8');
        }

        // Strip null bytes and non-printable control chars
        extractedText = extractedText.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ').trim();

        const email = extractEmail(extractedText) || `${file.name.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()}@candidates.jobninjas.ai`;
        const phone = extractPhone(extractedText) || undefined;
        const { firstName, lastName } = extractNameFromTextOrFilename(extractedText, file.name);

        // Check if candidate already exists in this role by email
        const existing = await prisma.candidate.findFirst({
          where: { roleId, email }
        });

        let candidate;
        if (existing) {
          candidate = await prisma.candidate.update({
            where: { id: existing.id },
            data: {
              resumeUrl: file.name,
              resumeText: extractedText,
              phone: phone || existing.phone,
              updatedAt: new Date(),
            }
          });
        } else {
          candidate = await prisma.candidate.create({
            data: {
              roleId,
              firstName,
              lastName,
              email,
              phone,
              resumeUrl: file.name,
              resumeText: extractedText,
              stage: 'APPLIED',
            }
          });
        }

        processedCandidates.push({
          candidate,
          fileName: file.name,
          isNew: !existing,
          email,
          name: `${candidate.firstName} ${candidate.lastName}`
        });
      } catch (err: any) {
        console.error(`Error processing file ${file.name}:`, err);
        errors.push(`${file.name}: ${err?.message || 'Failed to parse'}`);
      }
    }

    return NextResponse.json({
      success: true,
      total: files.length,
      processed: processedCandidates.length,
      candidates: processedCandidates.map(p => p.candidate),
      details: processedCandidates,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error: any) {
    console.error('Bulk upload error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Bulk upload failed' }, { status: 500 });
  }
}
