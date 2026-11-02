import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";

const SAMPLE_PROFILES = [
  {
    firstName: "Elena",
    lastName: "Rostova",
    email: "elena.rostova@cloudscale.dev",
    phone: "+1 (415) 882-9104",
    location: "San Francisco, CA (Remote)",
    resumeText: `ELENA ROSTOVA
Staff Full-Stack & Systems Engineer | San Francisco, CA
elena.rostova@cloudscale.dev • github.com/erostova • (415) 882-9104

SUMMARY
Principal / Staff Engineer with 8+ years designing fault-tolerant, high-concurrency web applications, microservices, and AI workflow orchestration engines in TypeScript, Next.js, Node.js, and PostgreSQL. Experienced leading engineering teams from seed to Series B.

TECHNICAL SKILLS
• Languages: TypeScript, JavaScript, Python, Go, SQL
• Frontend: React 19, Next.js (App Router, Server Actions), Tailwind CSS, WebSockets
• Backend & Data: Node.js, Fastify, Prisma ORM, PostgreSQL, Redis, Apache Kafka
• Infrastructure: AWS (ECS, Lambda, RDS), Docker, GitHub Actions, Terraform

EXPERIENCE
CloudScale Technologies — Staff Software Engineer (2022 – Present)
• Architected real-time event streaming pipeline processing 14,000 req/sec with sub-25ms latency using Node.js and PostgreSQL read replicas.
• Led frontend modernization to Next.js App Router, decreasing initial page load times by 48%.
• Mentored 6 junior and mid-level engineers across sprint planning and technical RFCs.

Vanguard Labs — Senior Full-Stack Engineer (2019 – 2022)
• Built collaborative canvas workspace with real-time multiplayer cursors and conflict resolution.
• Implemented automated CI/CD deployment pipelines with zero-downtime database migrations.

EDUCATION
B.S. in Computer Science — University of California, Berkeley (2018)
`,
  },
  {
    firstName: "Marcus",
    lastName: "Sterling",
    email: "marcus.sterling@devinbox.io",
    phone: "+1 (206) 745-3120",
    location: "Seattle, WA",
    resumeText: `MARCUS STERLING
Senior Backend & AI Integration Engineer | Seattle, WA
marcus.sterling@devinbox.io • github.com/msterling

SUMMARY
Senior Software Engineer specializing in backend performance tuning, AI LLM agent tool calling, structured data extraction, and relational database architecture.

CORE COMPETENCIES
• TypeScript, Python, FastAPI, Express, Prisma ORM
• LLM Orchestration: Groq API, OpenAI function calling, RAG pipelines
• Databases: PostgreSQL (indexing, EXPLAIN ANALYZE tuning), DynamoDB, Vector DBs (Pinecone, pgvector)

PROFESSIONAL EXPERIENCE
Hyperion AI — Senior Backend Engineer (2021 – Present)
• Designed autonomous AI pipeline evaluating structured documents with 99.2% accuracy.
• Integrated multi-tenant OAuth connectors with enterprise ATS systems (Workday, Greenhouse).

Acme Corp — Full-Stack Developer (2018 – 2021)
• Delivered core candidate management features in React and TypeScript.

EDUCATION
B.S. in Software Engineering — University of Washington (2018)
`,
  },
];

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let roleId = body.roleId;

    if (!roleId) {
      const firstRole = await prisma.role.findFirst({
        orderBy: { createdAt: 'desc' },
      });
      if (firstRole) {
        roleId = firstRole.id;
      }
    }

    if (!roleId) {
      return NextResponse.json({
        success: false,
        error: 'No active role found. Please create a role first before simulating applicant webhooks.',
      }, { status: 400 });
    }

    const randomIndex = Math.floor(Math.random() * SAMPLE_PROFILES.length);
    const profile = SAMPLE_PROFILES[randomIndex];

    // Unique timestamped email to allow repeated testing
    const emailSuffix = Date.now().toString().slice(-4);
    const uniqueEmail = profile.email.replace('@', `+test${emailSuffix}@`);

    const candidate = await prisma.candidate.create({
      data: {
        roleId,
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: uniqueEmail,
        phone: profile.phone,
        location: profile.location,
        resumeUrl: `${profile.firstName}_${profile.lastName}_Resume.pdf`,
        resumeText: profile.resumeText,
        stage: 'APPLIED',
      },
      include: {
        role: {
          select: {
            id: true,
            title: true,
            department: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Simulated webhook ingestion for ${profile.firstName} ${profile.lastName} into role "${candidate.role?.title || roleId}"!`,
      candidate,
    });
  } catch (error: any) {
    console.error('Simulate webhook error:', error);
    return NextResponse.json({
      success: false,
      error: error?.message || 'Failed to simulate webhook applicant ingest.',
    }, { status: 500 });
  }
}
