import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, department, notes } = await req.json();

    if (!title) {
      return NextResponse.json({ success: false, error: 'Job title is required to generate a description' }, { status: 400 });
    }

    const groqKey = process.env.GROQ_API_KEY;

    if (groqKey) {
      try {
        const prompt = `You are an elite Talent Architect & VP of Engineering.
Generate a structured, world-class Job Description for:
Title: ${title}
Department: ${department || 'General'}
User Context/Notes: ${notes || 'Standard industry best practices'}

Provide the output strictly in clean markdown with the following sections:
### Role Overview
[2-3 punchy sentences about why this role exists and its impact]

### Key Responsibilities
- [4-5 concrete deliverables]

### Required Qualifications
- [4-5 core competencies and technical depth requirements]

### Preferred Experience
- [2-3 high leverage nice-to-haves]

### Must-Ask Interview Questions
1. [Core technical architecture question]
2. [Real-world problem solving question]
3. [Cultural / collaboration question]`;

        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqKey}`,
          },
          body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
            max_tokens: 800,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const generatedText = data.choices?.[0]?.message?.content?.trim();
          if (generatedText) {
            return NextResponse.json({ success: true, jobDescription: generatedText });
          }
        }
      } catch (e) {
        console.warn("Groq generation fallback:", e);
      }
    }

    // High quality intelligent template fallback
    const fallbackJD = `### Role Overview
We are looking for an exceptional ${title} to join our ${department || 'core'} team. In this position, you will own critical systems, scale our architecture, and collaborate cross-functionally to deliver mission-critical software.

### Key Responsibilities
- Architect, build, and maintain production services with rigorous quality and high availability standards.
- Partner with product managers and cross-functional teams to define roadmaps and technical specifications.
- Lead code reviews, drive engineering velocity, and mentor peers across design patterns.
- Continuously profile system bottlenecks and optimize latency and throughput.

### Required Qualifications
- 4+ years of relevant industry experience in modern software engineering with ${title.toLowerCase().includes('engineer') || title.toLowerCase().includes('backend') ? 'TypeScript, Node.js, and relational databases' : 'modern development frameworks'}.
- Deep understanding of distributed systems, clean API design, and asynchronous workflows.
- Proven track record delivering end-to-end features from architecture to deployment.
- Strong written and verbal communication cadence.

### Preferred Experience
- Experience with cloud-native infrastructure, serverless compute, and automated CI/CD pipelines.
- Prior experience in high-growth startup environments.

### Must-Ask Interview Questions
1. How do you design fault-tolerant systems when downstream external APIs fail or degrade?
2. Walk us through a complex production bug you diagnosed and fixed under pressure.
3. How do you balance technical debt reduction with product shipping deadlines?`;

    return NextResponse.json({ success: true, jobDescription: fallbackJD });
  } catch (error: any) {
    console.error('Generate JD error:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to generate job description' }, { status: 500 });
  }
}
