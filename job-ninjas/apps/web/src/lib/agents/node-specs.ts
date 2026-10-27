export interface NodePortSpec {
  name: string;
  type: string;
  description: string;
  required?: boolean;
  /** Key stored on agent runs. Defaults to `type`. */
  artifactType?: string;
  /** Where an HR is expected to supply this input. */
  source?: 'edge' | 'board' | 'candidate';
}

export interface NodeDescription {
  role: string;
  displayName: string;
  subtitle: string;
  description: string;
  category: 'agent' | 'input' | 'integration' | 'gate' | 'output';
  color: string;
  bg: string;
  inputs: NodePortSpec[];
  outputs: NodePortSpec[];
  defaultModel?: string;
  defaultPrompt?: string;
  sampleInput?: any;
  sampleOutput?: any;
}

export const NODE_SPECS: Record<string, NodeDescription> = {
  // ─── AI AGENTS ───
  'agent-resume': {
    role: 'agent-resume',
    displayName: 'Resume Intelligence',
    subtitle: 'Extracts, verifies, and scores candidate credentials',
    description: 'Cross-checks candidate resume against the active job description using Groq LLM to verify technical skills, detect timeline gaps, calculate match percentage, and generate targeted interview probe questions.',
    category: 'agent',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200',
    inputs: [
      { name: 'Resume', type: 'Resume', artifactType: 'Resume', description: 'The candidate resume. Upload it, pick a candidate who has one, or connect a Resume step.', required: true, source: 'candidate' },
      { name: 'Job description', type: 'JobDescription', artifactType: 'JobDescription', description: 'The open role. Comes from this board’s job description.', required: true, source: 'board' },
      { name: 'Candidate', type: 'CandidateProfile', artifactType: 'CandidateProfile', description: 'Who the resume belongs to.', required: false, source: 'candidate' },
    ],
    outputs: [
      { name: 'Scorecard', type: 'Scorecard', artifactType: 'ResumeAnalysis', description: 'Match score, verified skills, gaps, and what to probe in an interview.' },
    ],
    defaultModel: 'openai/gpt-oss-120b',
    defaultPrompt: 'You are an expert technical recruiter. Analyze the candidate resume against job requirements. Extract verified skills, flag discrepancies, and suggest interview probe questions.',
    sampleOutput: {
      candidateSummary: "5+ years experienced ML engineer specializing in RAG architectures and Python production systems.",
      overallMatch: 78,
      skills: [
        { name: "Python", status: "VERIFIED", evidence: "Led production ML pipeline implementation" },
        { name: "RAG Systems", status: "VERIFIED", evidence: "Built enterprise vector search retrieval" },
        { name: "Kubernetes", status: "PARTIAL", evidence: "Containerized deployments via Docker" }
      ],
      strengths: ["Strong NLP and RAG background", "Production deployment experience"],
      gaps: ["Limited multi-cloud Kubernetes orchestration"],
      interviewFocusAreas: ["Evaluate depth of distributed vector indexing", "Probe experience with model latency optimization"]
    }
  },

  'agent-interview-plan': {
    role: 'agent-interview-plan',
    displayName: 'Interview Planning',
    subtitle: 'Generates targeted technical and behavioral interview guides',
    description: 'Consumes upstream Resume Intelligence output to synthesize a structured 60-minute interview plan targeting candidate weak spots and verifying claims.',
    category: 'agent',
    color: 'text-violet-600',
    bg: 'bg-violet-50 border-violet-200',
    inputs: [
      { name: 'Scorecard', type: 'Scorecard', artifactType: 'ResumeAnalysis', description: 'Screening scorecard or resume analysis. Connect Screen and score or Resume Intelligence.', required: true, source: 'edge' },
      { name: 'Job description', type: 'JobDescription', artifactType: 'JobDescription', description: 'Role the interview is hiring for.', required: true, source: 'board' },
    ],
    outputs: [
      { name: 'Interview plan', type: 'InterviewPlan', artifactType: 'InterviewPlan', description: 'Agenda, questions, and what a good answer looks like.' },
    ],
    defaultModel: 'openai/gpt-oss-120b',
    defaultPrompt: 'Design a targeted 60-minute technical interview plan. Base your questions specifically on the candidate gaps and focus areas identified by Resume Intelligence.',
    sampleOutput: {
      objective: "Verify depth of production RAG deployment and evaluate system reliability leadership.",
      durationMinutes: 60,
      sections: [
        { title: "Architecture Deep-Dive", duration: 25, focus: "RAG pipeline scaling and latency tradeoffs" },
        { title: "Behavioral & Mentorship", duration: 20, focus: "Cross-functional engineering leadership" },
        { title: "Candidate Q&A", duration: 15, focus: "Company mission and roadmap alignment" }
      ],
      questions: [
        {
          questionText: "How did you optimize embedding retrieval latency when query volume tripled in production?",
          expectedSignals: ["Understands HNSW indexing tradeoffs", "Quantization approaches", "Caching layers"],
          redFlags: ["Only mentions standard LangChain tutorials", "No concrete production numbers"]
        }
      ]
    }
  },

  'agent-interview-analysis': {
    role: 'agent-interview-analysis',
    displayName: 'Interview Analysis',
    subtitle: 'Scores transcripts for technical rigor and communication',
    description: 'Parses raw interview transcripts against the planned interview guide. Rates candidate technical depth, communication clarity, and highlights red flags or hesitation.',
    category: 'agent',
    color: 'text-purple-600',
    bg: 'bg-purple-50 border-purple-200',
    inputs: [
      { name: 'Interview plan', type: 'InterviewPlan', artifactType: 'InterviewPlan', description: 'The guide this conversation should be scored against.', required: true, source: 'edge' },
      { name: 'Transcript', type: 'Transcript', artifactType: 'Transcript', description: 'What was said in the interview. Paste it on the Transcript step.', required: true, source: 'edge' },
    ],
    outputs: [
      { name: 'Interview analysis', type: 'InterviewAnalysis', artifactType: 'InterviewAnalysis', description: 'Scores, quotes, red flags, and a hire / no-hire signal for this conversation.' },
    ],
    defaultModel: 'openai/gpt-oss-120b',
    defaultPrompt: 'Evaluate this interview transcript against the planned interview guide. Provide objective scores for technical depth and communication, citing exact quotes.',
    sampleOutput: {
      technicalScore: 8,
      communicationScore: 9,
      strengthsDemonstrated: [
        "Articulated multi-stage RAG cache invalidation clearly",
        "Honest and transparent when asked about unknown Kubernetes ingress topics"
      ],
      redFlagsSpotted: [],
      feedbackSummary: "Strong technical candidate with clear communication. Demonstrated genuine production engineering ownership.",
      overallRecommendation: "STRONG_HIRE"
    }
  },

  'agent-decision': {
    role: 'agent-decision',
    displayName: 'Candidate Decision',
    subtitle: 'Synthesizes holistic evidence into final recommendation',
    description: 'Combines resume intelligence and interview analysis artifacts into an executive recommendation with compensation guidelines and confidence ratings.',
    category: 'agent',
    color: 'text-amber-600',
    bg: 'bg-amber-50 border-amber-200',
    inputs: [
      { name: 'Scorecard', type: 'Scorecard', artifactType: 'ResumeAnalysis', description: 'Screening scorecard for this candidate.', required: true, source: 'edge' },
      { name: 'Interview analysis', type: 'InterviewAnalysis', artifactType: 'InterviewAnalysis', description: 'How the interview went.', required: true, source: 'edge' },
    ],
    outputs: [
      { name: 'Hiring recommendation', type: 'CandidateDecision', artifactType: 'CandidateDecision', description: 'Advisory hire / no-hire, rationale, and compensation notes. A person still decides.' },
    ],
    defaultModel: 'openai/gpt-oss-120b',
    defaultPrompt: 'Synthesize all evidence from resume screening and interview evaluation into a decisive hiring recommendation with compensation guidance.',
    sampleOutput: {
      overallScore: 88,
      recommendation: "STRONG_HIRE",
      strengths: ["Exceptional RAG architecture knowledge", "Strong culture alignment", "High technical bar"],
      concerns: ["Will need ramp-up time on Kubernetes container clusters"],
      unresolvedQuestions: ["Verify exact start date availability"],
      evidenceCoverage: "100% of core technical competencies evaluated with transcript evidence",
      rationale: "Candidate exceeds bar on core LLM engineering and communication. Fits senior IC profile seamlessly.",
      confidence: 94,
      compensationRecommendation: {
        suggestedSalary: 185000,
        currency: "USD",
        notes: "Top-tier offer recommended to close candidate quickly against competing offers"
      }
    }
  },

  'agent-concierge': {
    role: 'agent-concierge',
    displayName: 'Candidate Concierge',
    subtitle: 'Autonomous travel, hotel & dining orchestration',
    description: 'Searches real hotel availability and books travel logistics for onsite candidate rounds via Ophelia Travel API within candidate budget.',
    category: 'agent',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    inputs: [
      { name: 'Hiring recommendation', type: 'CandidateDecision', artifactType: 'CandidateDecision', description: 'Advance this person to onsite travel only after a hiring recommendation.', required: true, source: 'edge' },
      { name: 'Candidate', type: 'CandidateProfile', artifactType: 'CandidateProfile', description: 'Where the candidate is traveling from.', required: true, source: 'candidate' },
    ],
    outputs: [
      { name: 'Travel itinerary', type: 'Itinerary', artifactType: 'ConciergeItinerary', description: 'Hotel, travel, and a welcome note.' },
    ],
    defaultModel: 'openai/gpt-oss-120b',
    defaultPrompt: 'Plan candidate travel, luxury hotel stay, and welcome dining within the allocated travel budget.',
    sampleOutput: {
      status: "BOOKED",
      flightDetails: {
        airline: "Delta",
        flightNumber: "DL1420",
        departure: "ATL 08:30 AM",
        arrival: "JFK 11:15 AM",
        cost: 380
      },
      hotelDetails: {
        name: "Arlo Midtown Hotel New York",
        checkIn: "2026-10-24",
        checkOut: "2026-10-25",
        cost: 310
      },
      diningReservations: [
        { restaurantName: "Ci Siamo Manhattan West", time: "7:30 PM", partySize: 2 }
      ],
      welcomeMessage: "Welcome to New York, Sarah! Your stay at Arlo Midtown is confirmed. We look forward to meeting you tomorrow.",
      totalBudgetUtilized: 690
    }
  },

  'agent-jd-parser': {
    role: 'agent-jd-parser',
    displayName: 'JD Parser',
    subtitle: 'Turns the job description into must-haves',
    description: 'Reads the role’s job description and returns a parsed job: seniority, must-have skills, locations, and a short summary an HR can scan.',
    category: 'agent',
    color: 'text-sky-700',
    bg: 'bg-sky-50 border-sky-200',
    inputs: [
      { name: 'Job description', type: 'JobDescription', artifactType: 'JobDescription', description: 'Paste or upload the JD on this role. This step does not need a resume.', required: true, source: 'board' },
    ],
    outputs: [
      { name: 'Parsed job', type: 'ParsedJD', artifactType: 'ParsedJD', description: 'Structured must-haves, seniority, locations, and a plain-language summary.' },
    ],
    defaultPrompt: 'Extract seniority, must-have skills, locations, and a short summary from this job description. Do not invent requirements.',
  },

  'agent-resume-parser': {
    role: 'agent-resume-parser',
    displayName: 'Resume Parser',
    subtitle: 'Turns a resume into a candidate profile',
    description: 'Reads one candidate resume and returns a profile: name, skills, years, locations, and a summary. Other agents can take that profile as input.',
    category: 'agent',
    color: 'text-cyan-700',
    bg: 'bg-cyan-50 border-cyan-200',
    inputs: [
      { name: 'Resume', type: 'Resume', artifactType: 'Resume', description: 'Upload a resume, pick a candidate who has one, use a file on this board, or connect the Resume step.', required: true, source: 'candidate' },
    ],
    outputs: [
      { name: 'Candidate profile', type: 'CandidateProfile', artifactType: 'CandidateProfile', description: 'Structured profile extracted from the resume.' },
    ],
    defaultPrompt: 'Extract a candidate profile from the resume. Use only facts that are in the file.',
  },

  'agent-screen': {
    role: 'agent-screen',
    displayName: 'Screen and Score',
    subtitle: 'Writes a scorecard for one candidate',
    description: 'Compares a resume or candidate profile to the parsed job and returns a scorecard: match score, strengths, gaps, and advance / hold / reject.',
    category: 'agent',
    color: 'text-indigo-700',
    bg: 'bg-indigo-50 border-indigo-200',
    inputs: [
      { name: 'Resume', type: 'Resume', artifactType: 'Resume', description: 'Resume for the candidate you are scoring.', required: true, source: 'candidate' },
      { name: 'Parsed job', type: 'ParsedJD', artifactType: 'ParsedJD', description: 'Connect JD Parser. The role’s job description is used if this is not connected.', required: false, source: 'edge' },
      { name: 'Candidate profile', type: 'CandidateProfile', artifactType: 'CandidateProfile', description: 'Optional profile from Resume Parser.', required: false, source: 'edge' },
    ],
    outputs: [
      { name: 'Scorecard', type: 'Scorecard', artifactType: 'Scorecard', description: 'Match score, recommendation, strengths, gaps, and interview focus.' },
    ],
    defaultPrompt: 'Score this candidate against the role. Recommend advance, hold, or reject, and explain the gaps.',
  },

  'agent-shortlist': {
    role: 'agent-shortlist',
    displayName: 'Shortlist',
    subtitle: 'Recommends who moves forward',
    description: 'Reads a scorecard and recommends advance, hold, or pass, with the reason and the next recruiter action. The scorecard is forwarded to later steps.',
    category: 'agent',
    color: 'text-emerald-700',
    bg: 'bg-emerald-50 border-emerald-200',
    inputs: [
      { name: 'Scorecard', type: 'Scorecard', artifactType: 'Scorecard', description: 'Connect Screen and score or Resume Intelligence.', required: true, source: 'edge' },
    ],
    outputs: [
      { name: 'Shortlist', type: 'Shortlist', artifactType: 'Shortlist', description: 'Whether this person moves forward, and why.' },
      { name: 'Scorecard', type: 'Scorecard', artifactType: 'Scorecard', description: 'The same scorecard, forwarded so later steps still have it.' },
    ],
    defaultPrompt: 'Decide if this candidate should move forward. Explain the reason in plain language.',
  },

  'agent-outreach': {
    role: 'agent-outreach',
    displayName: 'Outreach Draft',
    subtitle: 'Writes the email you send',
    description: 'Drafts a recruiting email for the active candidate using the role and, when connected, the scorecard or candidate profile. You send it.',
    category: 'agent',
    color: 'text-fuchsia-700',
    bg: 'bg-fuchsia-50 border-fuchsia-200',
    inputs: [
      { name: 'Candidate', type: 'CandidateProfile', artifactType: 'CandidateProfile', description: 'The person you are writing to. Pick them on this role.', required: true, source: 'candidate' },
      { name: 'Scorecard', type: 'Scorecard', artifactType: 'Scorecard', description: 'Optional. Connect Screen or Shortlist so the email can mention a real reason.', required: false, source: 'edge' },
      { name: 'Job description', type: 'JobDescription', artifactType: 'JobDescription', description: 'The role this email is about.', required: true, source: 'board' },
    ],
    outputs: [
      { name: 'Email draft', type: 'EmailDraft', artifactType: 'EmailDraft', description: 'Subject, body, and the ask. Copy it into your mailbox.' },
    ],
    defaultPrompt: 'Write a short, specific recruiting email. Do not pretend an interview is already booked.',
  },

  'agent-schedule': {
    role: 'agent-schedule',
    displayName: 'Interview Schedule',
    subtitle: 'Proposes times and a message',
    description: 'Takes an interview plan and drafts time options plus a message to the candidate. It does not book a calendar by itself.',
    category: 'agent',
    color: 'text-violet-700',
    bg: 'bg-violet-50 border-violet-200',
    inputs: [
      { name: 'Interview plan', type: 'InterviewPlan', artifactType: 'InterviewPlan', description: 'Connect Interview Planning and run it first.', required: true, source: 'edge' },
      { name: 'Candidate', type: 'CandidateProfile', artifactType: 'CandidateProfile', description: 'Who the invite is for.', required: true, source: 'candidate' },
    ],
    outputs: [
      { name: 'Interview slots', type: 'InterviewSlots', artifactType: 'InterviewSlots', description: 'Suggested times, format, and a message you can send.' },
    ],
    defaultPrompt: 'Propose three interview options and a message the recruiter can send. Do not claim the time is booked.',
  },

  // ─── INPUT NODES ───
  'input-job-details': {
    role: 'input-job-details',
    displayName: 'Job Details',
    subtitle: 'Job requisition parameters and requirements',
    description: 'Root input node containing the open requisition title, department, location, and requirements. Automatically supplies context to downstream screening and planning agents.',
    category: 'input',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    inputs: [],
    outputs: [
      { name: 'Job description', type: 'JobDescription', artifactType: 'JobDescription', description: 'Requisition title, requirements, department, and location' }
    ]
  },

  'entry-node': {
    role: 'entry-node',
    displayName: 'Job Requisition',
    subtitle: 'Primary role definition and ATS specs',
    description: 'Defines the primary role description, minimum qualifications, and hiring manager context.',
    category: 'input',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    inputs: [],
    outputs: [
      { name: 'Job description', type: 'JobDescription', artifactType: 'JobDescription', description: 'Requisition title and requirements' }
    ]
  },

  'input-candidate': {
    role: 'input-candidate',
    displayName: 'Candidate Profile',
    subtitle: 'Candidate identity, contact, and stage',
    description: 'Supplies candidate metadata (name, email, current location, stage, and travel budget) to downstream agents.',
    category: 'input',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    inputs: [],
    outputs: [
      { name: 'Candidate profile', type: 'CandidateProfile', artifactType: 'CandidateProfile', description: 'Candidate metadata record' }
    ]
  },

  'candidate-node': {
    role: 'candidate-node',
    displayName: 'Candidate Node',
    subtitle: 'Active candidate context',
    description: 'Supplies candidate profile data and stage status.',
    category: 'input',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    inputs: [],
    outputs: [
      { name: 'Candidate profile', type: 'CandidateProfile', artifactType: 'CandidateProfile', description: 'Candidate profile record' }
    ]
  },

  'input-resume': {
    role: 'input-resume',
    displayName: 'Resume Document',
    subtitle: 'Parsed PDF / DOCX resume file',
    description: 'Contains parsed text and metadata from the candidate resume upload.',
    category: 'input',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    inputs: [
      { name: 'Candidate', type: 'CandidateProfile', artifactType: 'CandidateProfile', description: 'Candidate this resume belongs to. Pick them on the role.', required: false, source: 'candidate' }
    ],
    outputs: [
      { name: 'Resume', type: 'Resume', artifactType: 'Resume', description: 'Resume text for downstream screening and parsing.' }
    ]
  },

  'input-transcript': {
    role: 'input-transcript',
    displayName: 'Interview Transcript',
    subtitle: 'Dialogue transcript from video / phone screen',
    description: 'Provides verbatim transcript text from Zoom, Teams, or recorded interview sessions.',
    category: 'input',
    color: 'text-blue-600',
    bg: 'bg-blue-50 border-blue-200',
    inputs: [
      { name: 'Candidate', type: 'CandidateProfile', artifactType: 'CandidateProfile', description: 'Candidate who interviewed.', required: false, source: 'candidate' }
    ],
    outputs: [
      { name: 'Transcript', type: 'Transcript', artifactType: 'Transcript', description: 'Verbatim transcript text' }
    ]
  },

  // ─── INTEGRATIONS ───
  'integration-ophelia': {
    role: 'integration-ophelia',
    displayName: 'Ophelia Travel API',
    subtitle: 'Live hotel availability & booking engine',
    description: 'Connects directly to the Ophelia luxury lodging and venue booking API for candidate travel arrangements.',
    category: 'integration',
    color: 'text-orange-600',
    bg: 'bg-orange-50 border-orange-200',
    inputs: [
      { name: 'location', type: 'string', description: 'Destination city', required: true },
      { name: 'dates', type: 'object', description: 'Check-in and check-out dates', required: true }
    ],
    outputs: [
      { name: 'hotelOptions', type: 'array', description: 'List of available luxury venues with pricing and real-time availability IDs' }
    ]
  },

  // ─── HUMAN GATES ───
  'gate-shortlist': {
    role: 'gate-shortlist',
    displayName: 'Recruiter Shortlist Gate',
    subtitle: 'Human approval before advancing to interviews',
    description: 'Halts autonomous execution until a human recruiter reviews and approves the Resume Intelligence score.',
    category: 'gate',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    inputs: [
      { name: 'Scorecard', type: 'Scorecard', artifactType: 'Scorecard', description: 'Resume screening result to review', required: true, source: 'edge' }
    ],
    outputs: [
      { name: 'Approval', type: 'Approval', artifactType: 'Approval', description: 'Human approval flag' },
      { name: 'Scorecard', type: 'Scorecard', artifactType: 'Scorecard', description: 'Forwards the scorecard the recruiter reviewed' }
    ]
  },

  'gate-final': {
    role: 'gate-final',
    displayName: 'Hiring Committee Approval',
    subtitle: 'Executive sign-off on offer decision',
    description: 'Human gate requiring VP of Engineering or Hiring Manager approval before releasing offer and trigger concierge travel.',
    category: 'gate',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50 border-emerald-200',
    inputs: [
      { name: 'Hiring recommendation', type: 'CandidateDecision', artifactType: 'CandidateDecision', description: 'Synthesized hiring recommendation to approve', required: true, source: 'edge' }
    ],
    outputs: [
      { name: 'Approval', type: 'Approval', artifactType: 'Approval', description: 'Offer authorization flag' }
    ]
  }
};

export function getNodeSpec(role?: any): NodeDescription {
  if (!role || typeof role !== 'string') {
    return {
      role: 'custom-agent',
      displayName: 'Custom Agent',
      subtitle: 'Configurable autonomous worker',
      description: 'Executes customized prompting and logic against candidate records.',
      category: 'agent',
      color: 'text-slate-600',
      bg: 'bg-slate-50 border-slate-200',
      inputs: [],
      outputs: [{ name: 'output', type: 'object', description: 'Result payload' }]
    };
  }
  return NODE_SPECS[role] || {
    role,
    displayName: role.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    subtitle: 'Autonomous pipeline step',
    description: 'Configurable recruitment automation node.',
    category: role.startsWith('agent-') ? 'agent' : role.startsWith('input-') ? 'input' : 'integration',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 border-indigo-200',
    inputs: [],
    outputs: [{ name: 'output', type: 'object', description: 'Result payload' }]
  };
}
