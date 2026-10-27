import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const candidateId = formData.get('candidateId') as string;
    const file = formData.get('file') as File;

    if (!candidateId || !file) {
      return NextResponse.json({ success: false, error: 'Missing candidateId or file' }, { status: 400 });
    }

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
      console.warn('pdf-parse fallback:', e?.message);
    }

    if (!extractedText) {
      extractedText = buffer.toString('utf-8');
    }

    // Strip null bytes and non-printable control chars that break Postgres UTF8 storage
    extractedText = extractedText.replace(/\0/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, ' ').trim();

    const updatedCandidate = await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        resumeUrl: file.name,
        resumeText: extractedText,
      }
    });

    return NextResponse.json({ success: true, candidate: updatedCandidate });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
