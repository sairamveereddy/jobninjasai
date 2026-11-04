import { NextResponse } from 'next/server';
import { createGroq } from '@ai-sdk/groq';
import { generateText } from 'ai';

export interface CopilotAction {
  type: 'ADD_AGENT' | 'CREATE_PIPELINE' | 'CONNECT_NODES' | 'INSPECT_NODE' | 'NAVIGATE';
  payload: Record<string, any>;
  label: string;
}

const SYSTEM_PROMPT = `You are JobNinja Copilot, the built-in intelligent recruiting automation assistant for JobNinjas.ai.
Your mission is to guide recruiters and hiring managers, troubleshoot broken or blocked pipeline steps, create new hiring pipelines, and dynamically add agents to the visual canvas.

### About JobNinjas
JobNinjas is a visual, infinite-canvas AI recruiting automation workspace (similar to n8n for hiring). It orchestrates 15 specialized agents:
1. "agent-jd-parser" (Job Description Intake & Parsing)
2. "agent-resume-parser" (Resume Parser & Skill Extraction)
3. "agent-screen" / "resume-intelligence" (Screen & Scorecard matching candidate to JD)
4. "agent-shortlist" (Shortlists candidates meeting threshold)
5. "agent-outreach" (Drafts personalized cold outreach emails)
6. "agent-interview-plan" (Generates tailored 60-min interview plan)
7. "agent-schedule" (Proposes interview slots & Google Meet links)
8. "input-transcript" (Interview dialogue transcript intake)
9. "agent-interview-analysis" (Scores interview citing quotes & trade-offs)
10. "agent-decision" (Evidence synthesis & final hiring recommendation)
11. "agent-offer-draft" (Generates compensation & formal offer letter)
12. "agent-rejection-draft" (Generates warm, constructive pass notification)
13. "agent-onboarding-handoff" (Drafts equipment, team intros, and week-1 goals)
14. "agent-concierge" (Ophelia travel, flights, and hotel bookings for candidates)
15. "agent-verification" (GitHub open-source repository & code audit)

### Capabilities & Actions
When appropriate, you can suggest direct actions by including a JSON code block with \`\`\`action at the very end of your response:
1. To add an agent to the board:
\`\`\`action
{
  "type": "ADD_AGENT",
  "label": "Add Outreach Agent to Board",
  "payload": {
    "agentRole": "agent-outreach",
    "name": "Candidate Outreach Agent"
  }
}
\`\`\`

2. To create a new pipeline:
\`\`\`action
{
  "type": "CREATE_PIPELINE",
  "label": "Create Senior AI Engineer Pipeline",
  "payload": {
    "title": "Senior AI Engineer",
    "department": "Engineering"
  }
}
\`\`\`

### Guidelines:
- Keep explanations clear, friendly, and concise.
- When a user asks how to do something, explain it in 1-2 sentences and attach an action button if possible.
- If a user is stuck (e.g. "my screening is blocked" or "interview analysis didn't run"), diagnose:
  - Missing Resume: they need to upload a resume file or paste text in the Resume Intake node.
  - Missing Transcript: they must paste the transcript text in the Transcript node and connect it to Interview Plan.
  - Disconnected nodes: advise connecting the preceding agent's output edge to the next step.
`;

export async function POST(req: Request) {
  try {
    const { messages, context } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1]?.content || '';
    const currentPath = context?.pathname || '/';
    const roleTitle = context?.roleTitle || 'Open Role';
    const existingAgents = context?.existingAgents || [];

    const enrichedSystemPrompt = `${SYSTEM_PROMPT}

### Current User Context:
- Current Page: ${currentPath}
- Active Role: ${roleTitle}
- Existing Nodes on Board: ${existingAgents.join(', ') || 'None / Not on canvas'}
`;

    const apiKey = process.env.GROQ_API_KEY;

    if (apiKey && apiKey.trim() !== '' && apiKey !== 'demo') {
      try {
        const groq = createGroq({ apiKey });
        const modelName = 'openai/gpt-oss-120b';

        // Convert messages format
        const formattedMessages = messages.map((m: any) => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: String(m.content),
        }));

        const result = await generateText({
          model: groq(modelName),
          system: enrichedSystemPrompt,
          messages: formattedMessages,
        });

        const rawText = result.text;
        let action: CopilotAction | null = null;
        let cleanText = rawText;

        const actionMatch = rawText.match(/```action\s*([\s\S]*?)\s*```/);
        if (actionMatch) {
          try {
            action = JSON.parse(actionMatch[1]);
            cleanText = rawText.replace(/```action[\s\S]*?```/, '').trim();
          } catch {
            // ignore malformed action JSON
          }
        }

        return NextResponse.json({
          reply: cleanText,
          action,
        });
      } catch (groqErr: any) {
        console.warn(`[Copilot Groq] Error (${groqErr?.message}). Using intelligent offline guidance.`);
      }
    }

    // Intelligent Deterministic Fallback Assistant
    const query = lastMessage.toLowerCase();
    let reply = "I'm here to help you navigate JobNinjas, automate candidate pipelines, and configure AI agents.";
    let action: CopilotAction | null = null;

    if (query.includes('add') && (query.includes('outreach') || query.includes('email'))) {
      reply = "I can add a Candidate Outreach Agent to your canvas. This agent drafts hyper-personalized introductory emails citing verified skills from candidate scorecards.";
      action = {
        type: 'ADD_AGENT',
        label: 'Add Outreach Agent to Canvas',
        payload: { agentRole: 'agent-outreach', name: 'Candidate Outreach Agent' }
      };
    } else if (query.includes('add') && (query.includes('concierge') || query.includes('travel') || query.includes('hotel'))) {
      reply = "Adding the Candidate Concierge Agent. This agent automates travel itineraries, hotels, and flight bookings for on-site interviews via Ophelia OS.";
      action = {
        type: 'ADD_AGENT',
        label: 'Add Concierge Agent to Canvas',
        payload: { agentRole: 'agent-concierge', name: 'Candidate Concierge' }
      };
    } else if (query.includes('add') && (query.includes('interview') || query.includes('analysis') || query.includes('score'))) {
      reply = "Adding the Interview Analysis Agent. Connect your Interview Plan and Interview Transcript to this node to score answers against objective rubrics.";
      action = {
        type: 'ADD_AGENT',
        label: 'Add Interview Analysis Agent',
        payload: { agentRole: 'agent-interview-analysis', name: 'Interview Analysis Agent' }
      };
    } else if (query.includes('create') && (query.includes('pipeline') || query.includes('role'))) {
      const extractedTitle = lastMessage.replace(/create|pipeline|for|a|new|role/gi, '').trim() || 'AI Engineer';
      reply = `I can set up a new recruiting pipeline for **${extractedTitle}** with pre-configured screening, scoring, and interview agents.`;
      action = {
        type: 'CREATE_PIPELINE',
        label: `Create "${extractedTitle}" Pipeline`,
        payload: { title: extractedTitle, department: 'Engineering' }
      };
    } else if (query.includes('stuck') || query.includes('blocked') || query.includes('error') || query.includes('not working')) {
      reply = "Here are the 3 most common reasons a pipeline step gets blocked:\n\n1. **Missing Resume:** The Resume Screening agent requires candidate resume text. Ensure a resume PDF is uploaded or text is pasted.\n2. **Missing Transcript:** Interview Analysis needs dialogue. Paste what was said into the Transcript node.\n3. **Disconnected Edges:** Drag a connection wire from the previous step's output dot to the next step's input dot.";
    } else {
      reply = `JobNinjas orchestrates 15 autonomous agents on an infinite canvas. You can ask me to **add agents to this board**, **create a new role pipeline**, or **troubleshoot any step**. What would you like to build?`;
    }

    return NextResponse.json({
      reply,
      action,
    });
  } catch (error: any) {
    console.error('Error in Copilot API:', error);
    return NextResponse.json(
      { error: error?.message || 'Internal copilot error' },
      { status: 500 }
    );
  }
}
