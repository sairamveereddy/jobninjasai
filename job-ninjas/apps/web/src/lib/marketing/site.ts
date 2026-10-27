export const TRIAL_HREF = "/api/auth/skip";
export const SITE_URL = "https://jobninjas.ai";
export const SITE_TITLE = "JobNinjas | The OS for one open role";
export const SITE_DESCRIPTION =
  "JobNinjas is the OS for one open role. One board holds the job, the resumes, and the agents that screen, plan, and write the decision.";

export function pageSeo(title: string, description: string) {
  const full = `${title} · JobNinjas`;
  return {
    title,
    description,
    openGraph: { title: full, description },
    twitter: { card: "summary" as const, title: full, description },
  };
}

export function topicSeo(topic: MarketingTopic) {
  const description = withRoleOs(topic.lede);
  return pageSeo(topic.title, description);
}

function withRoleOs(lede: string) {
  const suffix = " JobNinjas is the OS for one open role.";
  const combined = `${lede}${suffix}`;
  if (combined.length <= 160) return combined;
  const firstSentence = lede.split(/(?<=\.)\s/)[0] ?? lede;
  const fromFirst = `${firstSentence}${suffix}`;
  if (fromFirst.length <= 160) return fromFirst;
  const budget = 160 - suffix.length;
  const cut = firstSentence.slice(0, budget).replace(/\s+\S*$/, "").replace(/[.,;:\s]+$/, "");
  return `${cut}.${suffix}`;
}

export const PLANS = [
  {
    name: "Starter",
    price: "$0",
    period: "to open one role",
    blurb: "A single requisition, with the agents that screen resumes and write a decision.",
    features: [
      "1 active role",
      "Resume Intelligence and Candidate Decision",
      "Job description and resumes on the role",
      "Demo workspace to try the board",
    ],
    cta: "Try a role",
    href: TRIAL_HREF,
    featured: false,
  },
  {
    name: "Team",
    price: "$49",
    period: "per month",
    blurb: "Every open role on its own board, with the full hiring pipeline.",
    features: [
      "Unlimited roles",
      "Full agent pipeline, including interview analysis",
      "Greenhouse candidate import",
      "Shared hiring team on the role",
    ],
    cta: "Try a role",
    href: TRIAL_HREF,
    featured: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "scoped with you",
    blurb: "For teams that need a security review, SSO, or connectors beyond Greenhouse.",
    features: [
      "Everything in Team",
      "Security review and SSO conversation",
      "Custom connectors",
      "Dedicated support",
    ],
    cta: "Talk to us",
    href: "mailto:veereddy@jobninjas.org?subject=JobNinjas%20Enterprise",
    featured: false,
  },
] as const;

export const FAQS = [
  {
    q: "What is a board?",
    a: "A board is one open role. Senior Backend Engineer is one board. The next requisition is a different board. The job description, candidates, resumes, transcripts, and agent output stay on that role.",
  },
  {
    q: "What do the agents actually do?",
    a: "They run in order, per candidate. Resume Intelligence scores the resume against the job description. Interview Planning writes the loop from those gaps. Interview Analysis reads the transcript. Candidate Decision writes a recommendation and a rationale. Candidate Concierge plans onsite travel after someone is advanced.",
  },
  {
    q: "Can one role hold many candidates?",
    a: "Yes. Add people directly or import them from a Greenhouse job. The same pipeline runs for each person, so match scores and interview notes stay comparable.",
  },
  {
    q: "Does JobNinjas replace Greenhouse?",
    a: "No. Greenhouse can stay the system of record. JobNinjas imports candidates from a Greenhouse job onto the role so screening, interview plans, and the decision live in one place.",
  },
  {
    q: "Who makes the hiring decision?",
    a: "Your team does. Agents produce scores, a plan, and a written recommendation. A person decides who moves forward.",
  },
  {
    q: "How do I try it?",
    a: "Open the demo workspace and create a role. That drops you on the product board. Team sign-in is rolling out separately.",
  },
] as const;

export const AGENTS = [
  {
    name: "Resume Intelligence",
    summary: "Reads one resume against this role’s job description.",
    inputs: ["Candidate", "Resume", "Job description"],
    outputs: ["Match score", "Verified skills", "Gaps", "Probe questions"],
  },
  {
    name: "Interview Planning",
    summary: "Turns resume gaps into a structured interview plan.",
    inputs: ["Resume analysis", "Role requirements"],
    outputs: ["Agenda", "Questions", "Signals to listen for"],
  },
  {
    name: "Interview Analysis",
    summary: "Scores a transcript against the plan you already wrote.",
    inputs: ["Interview plan", "Transcript"],
    outputs: ["Technical score", "Communication score", "Red flags"],
  },
  {
    name: "Candidate Decision",
    summary: "Combines the resume and the interview into a recommendation.",
    inputs: ["Resume analysis", "Interview analysis"],
    outputs: ["Hire or hold", "Rationale", "Compensation note"],
  },
  {
    name: "Candidate Concierge",
    summary: "Plans onsite travel after you advance a finalist.",
    inputs: ["Decision", "Candidate location"],
    outputs: ["Flight", "Hotel", "Welcome note"],
  },
] as const;

export type MarketingTopic = {
  kicker: string;
  title: string;
  lede: string;
  points: { title: string; body: string }[];
};

const DEFAULT_POINTS = [
  {
    title: "One board, one role",
    body: "Open a requisition and keep the job description, candidates, and documents on that board.",
  },
  {
    title: "Agents with inputs and outputs",
    body: "Resume, interview plan, transcript analysis, and a written decision run for each candidate.",
  },
  {
    title: "People still decide",
    body: "Agents prepare the work. A recruiter or hiring manager chooses who advances.",
  },
];

export const TOPICS: Record<string, MarketingTopic> = {
  "product/canvas": {
    kicker: "Product",
    title: "The role board",
    lede: "Every open role gets one board. It holds the job description, the people in process, their documents, and the agents running that hire.",
    points: [
      {
        title: "The requisition is the container",
        body: "Title, department, location, and job description live on the role. A second job is a second board.",
      },
      {
        title: "Candidates stay attached",
        body: "Each person on the role keeps a resume, a stage, and the agent output produced for them.",
      },
      {
        title: "The pipeline is fixed work",
        body: "Agents run a fixed hiring sequence on this requisition: resume, interview plan, transcript, and decision.",
      },
    ],
  },
  "product/resume-parser": {
    kicker: "Product",
    title: "Resume Intelligence",
    lede: "Drop a resume on the role. The agent reads it against that job description and returns a match score, which skills are verified, where the gaps are, and which questions to ask next.",
    points: [
      {
        title: "Input",
        body: "The candidate, the resume text, and the open role.",
      },
      {
        title: "Output",
        body: "A structured analysis: overall match, skill evidence, gaps, and interview focus areas.",
      },
      {
        title: "Many resumes, one bar",
        body: "Run it across the slate. Scores stay tied to the same job description, so the shortlist is comparable.",
      },
    ],
  },
  "product/copilot": {
    kicker: "Product",
    title: "Interview analysis",
    lede: "JobNinjas does not sit in the interview and talk for you. After the conversation, Interview Analysis reads the transcript against the plan and scores what the candidate actually said.",
    points: [
      {
        title: "Plan first",
        body: "Interview Planning writes the agenda from resume gaps before anyone is on the call.",
      },
      {
        title: "Transcript in",
        body: "Paste or attach the interview transcript. The agent scores technical depth and communication.",
      },
      {
        title: "Evidence out",
        body: "You get strengths, red flags, and a recommendation you can hand to the hiring manager.",
      },
    ],
  },
  "product/integrations": {
    kicker: "Product",
    title: "Greenhouse, then the rest of the role",
    lede: "Import candidates from a Greenhouse job onto the role board. Gmail, Calendar, Slack, Workday, and DocuSign connectors sit on the same requisition so the hire does not scatter across tabs.",
    points: [
      {
        title: "Greenhouse import",
        body: "Connect a job, pick the people, and land them on this role with their profiles intact.",
      },
      {
        title: "Greenhouse stays the system of record",
        body: "JobNinjas is where the screening, the plan, and the decision get written.",
      },
      {
        title: "Documents stay on the role",
        body: "Resumes, the job description, and transcripts belong to the candidate on that board.",
      },
    ],
  },
  "use-cases/technical": {
    kicker: "Use case",
    title: "A technical role with a stack of resumes",
    lede: "Open one engineering requisition. Load the job description once. Run Resume Intelligence on every applicant, then generate an interview plan from the gaps that actually showed up.",
    points: [
      {
        title: "Same bar for every resume",
        body: "Match scores are computed against this job description, not a generic skills list.",
      },
      {
        title: "Probe questions come from gaps",
        body: "Interview Planning targets what the resume did not prove.",
      },
      {
        title: "The loop leaves a record",
        body: "Transcript analysis and the decision memo stay on the candidate.",
      },
    ],
  },
  "use-cases/executive": {
    kicker: "Use case",
    title: "A senior search with a short slate",
    lede: "Executive roles are still one board. Fewer candidates, heavier documents, and a decision memo the hiring committee can read. Concierge plans the onsite once you advance a finalist.",
    points: [
      {
        title: "One confidential role",
        body: "The search lives on its own board, separate from high-volume reqs.",
      },
      {
        title: "A written recommendation",
        body: "Candidate Decision combines resume evidence and interview analysis into a rationale.",
      },
      {
        title: "Onsite logistics",
        body: "Candidate Concierge drafts travel, hotel, and a welcome note after you advance someone.",
      },
    ],
  },
  "use-cases/high-volume": {
    kicker: "Use case",
    title: "Many candidates, one requisition",
    lede: "High-volume hiring is still one role. Import the slate, run the same resume screen on each person, and sort by the score that role produced.",
    points: [
      {
        title: "Import the job",
        body: "Pull candidates from Greenhouse onto this board instead of copying rows into a sheet.",
      },
      {
        title: "One pipeline, repeated",
        body: "Every candidate gets the same inputs and the same outputs, so comparisons stay fair.",
      },
      {
        title: "People advance people",
        body: "The agent ranks evidence. A recruiter decides who gets a screen.",
      },
    ],
  },
  "use-cases/campus": {
    kicker: "Use case",
    title: "A campus cohort on one role",
    lede: "Treat the intern or new-grad opening as a single role. Resumes land on that board, the same screen runs for the cohort, and interview plans stay consistent across campus interviewers.",
    points: [
      {
        title: "One job description",
        body: "The cohort is scored against the same requirements.",
      },
      {
        title: "Shared interview plan",
        body: "Interview Planning gives every interviewer the same agenda and signals.",
      },
      {
        title: "Notes stay with the student",
        body: "Transcript analysis is filed on the candidate, not in a separate doc.",
      },
    ],
  },
  "solutions/startups": {
    kicker: "Solutions",
    title: "A startup hiring without a recruiting team",
    lede: "Founders and a single recruiter can run each open role as its own board. The job description, the resumes, and the agent pipeline replace the side spreadsheet.",
    points: [
      {
        title: "One role at a time",
        body: "Start with the req that is actually open. Add another board when the next job opens.",
      },
      {
        title: "Agents do the first pass",
        body: "Resume Intelligence and Interview Planning cover the work a coordinator usually does by hand.",
      },
      {
        title: "The founder still decides",
        body: "The decision memo is a recommendation, not an automatic offer.",
      },
    ],
  },
  "solutions/enterprise": {
    kicker: "Solutions",
    title: "Enterprise teams who already have an ATS",
    lede: "Keep Greenhouse as the system of record. Use JobNinjas as the operating layer for one requisition: imported candidates, resume evidence, interview plans, and a decision the committee can audit.",
    points: [
      {
        title: "Import, don’t migrate",
        body: "Bring a Greenhouse job’s candidates onto the role board.",
      },
      {
        title: "A record per candidate",
        body: "Scores, plans, and transcript notes stay attached to the person and the role.",
      },
      {
        title: "Security conversations belong on Enterprise",
        body: "SSO and a security review are scoped with us. They are not claimed as a certification on this page.",
      },
    ],
  },
  "solutions/agencies": {
    kicker: "Solutions",
    title: "Agencies running one board per client role",
    lede: "Each client search is a role. Resumes, interview plans, and the decision memo live on that board so the team is not assembling a packet from five tools.",
    points: [
      {
        title: "A board per search",
        body: "Client work stays separated by requisition.",
      },
      {
        title: "A packet the client can read",
        body: "Candidate Decision writes the rationale from resume and interview evidence.",
      },
      {
        title: "The same pipeline every search",
        body: "The same pipeline runs on every search, so each role produces the same kind of packet.",
      },
    ],
  },
  "resources/docs": {
    kicker: "Resources",
    title: "Work a role",
    lede: "Create a role, add the job description, bring candidates in, and run the pipeline. That is the product.",
    points: [
      {
        title: "1. Open a role",
        body: "Name the job, department, location, and hiring manager. You land on that role’s board.",
      },
      {
        title: "2. Add inputs",
        body: "Paste the job description, upload resumes, or import a Greenhouse slate.",
      },
      {
        title: "3. Run agents",
        body: "Resume Intelligence, Interview Planning, Interview Analysis, and Candidate Decision each take the previous output.",
      },
    ],
  },
  "resources/blog": {
    kicker: "Resources",
    title: "Notes for talent teams",
    lede: "A blog is not published yet. The useful starting point is the pipeline: what each agent reads, and what it writes back onto the role.",
    points: DEFAULT_POINTS,
  },
  "resources/case-studies": {
    kicker: "Resources",
    title: "How a role board is meant to be used",
    lede: "We are not publishing customer logos or invented metrics. These are the workflows the product is built to run.",
    points: [
      {
        title: "Screen a slate",
        body: "One job description, many resumes, a match score and gap list per person.",
      },
      {
        title: "Run a loop",
        body: "An interview plan before the call, a transcript score after it.",
      },
      {
        title: "Write the decision",
        body: "A recommendation with rationale, then onsite logistics if you advance a finalist.",
      },
    ],
  },
};

export function topicFor(section: string, slug: string[]): MarketingTopic {
  const key = `${section}/${slug.join("/")}`;
  const known = TOPICS[key];
  if (known) return known;
  const title = slug
    .join(" ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    kicker: section.replace(/-/g, " "),
    title: title || "JobNinjas",
    lede: "JobNinjas is the operating system for one open role. Agents screen resumes, plan interviews, read transcripts, and write a decision on that requisition.",
    points: DEFAULT_POINTS,
  };
}
