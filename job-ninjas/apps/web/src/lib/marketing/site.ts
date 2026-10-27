export const TRIAL_HREF = "/api/auth/skip";
export const SITE_URL = "https://jobninjas.ai";
export const SITE_TITLE = "JobNinjas | The OS for one open role";
export const SITE_DESCRIPTION =
  "JobNinjas is the OS for one open role. One board holds the job, the resumes, and the agents that screen, plan, and write the decision.";

export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "JobNinjas, the OS for one open role",
};

export function pageSeo(title: string, description: string) {
  const full = `${title} · JobNinjas`;
  return {
    title,
    description,
    openGraph: { title: full, description, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image" as const, title: full, description, images: [OG_IMAGE.url] },
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
      "1 open role at a time",
      "JD Parser, Resume Parser, Screen & Score",
      "Hiring Recommendation on that role",
      "Demo workspace, no card",
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
      "Unlimited open roles",
      "Shortlist, Outreach, interview schedule and analysis",
      "Greenhouse candidate import",
      "$49 for the workspace, not per person",
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
    a: "On each candidate: JD Parser structures the job, Resume Parser reads the resume, and Screen & Score writes a scorecard. Shortlist says whether they move forward. Outreach drafts an email you send yourself. Interview Schedule proposes times. Interview Analysis scores the transcript. Hiring Recommendation writes an advisory hire or no-hire. A person still decides.",
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
    a: "Your team does. Hiring Recommendation is an advisory hire or no-hire with a rationale. A person decides who moves forward.",
  },
  {
    q: "How do I try it?",
    a: "Open the demo workspace and create a role. That drops you on the product. It does not start a paid subscription. Team sign-in is rolling out separately.",
  },
  {
    q: "What counts as an open role on Starter?",
    a: "Starter includes one requisition you are still hiring for. Opening a second role is a Team workspace. Close the first role when that search is done and the slot is free again.",
  },
  {
    q: "Is Team priced per person or per role?",
    a: "Neither. Team is $49 a month for the workspace. Teammates are not an extra seat fee, and additional open roles are included. This page has no annual price.",
  },
  {
    q: "Does Outreach or Interview Schedule send anything?",
    a: "No. Outreach writes a subject and body for you to copy into your mailbox. Interview Schedule proposes times and a message. Neither sends email nor writes to a calendar.",
  },
] as const;

export const AGENTS = [
  {
    name: "JD Parser",
    summary: "Turns this role’s job description into the hiring bar.",
    inputs: ["Job description"],
    outputs: ["Must-haves", "Seniority", "Locations", "Summary"],
  },
  {
    name: "Resume Parser",
    summary: "Reads one resume into a structured profile.",
    inputs: ["Resume"],
    outputs: ["Candidate profile"],
  },
  {
    name: "Screen & Score",
    summary: "Scores the resume against the parsed job.",
    inputs: ["Resume", "Parsed job"],
    outputs: ["Match score", "Strengths", "Gaps", "Interview focus"],
  },
  {
    name: "Shortlist",
    summary: "Says whether this person moves forward, and why.",
    inputs: ["Scorecard"],
    outputs: ["Advance or hold", "Reason"],
  },
  {
    name: "Outreach",
    summary: "Drafts the email. You send it.",
    inputs: ["Candidate", "Job description"],
    outputs: ["Subject", "Body", "The ask"],
  },
  {
    name: "Interview Schedule",
    summary: "Proposes times from the interview plan. It does not book the calendar.",
    inputs: ["Interview plan", "Candidate"],
    outputs: ["Suggested times", "Format", "Invite message"],
  },
  {
    name: "Interview Analysis",
    summary: "Scores the transcript against that plan.",
    inputs: ["Interview plan", "Transcript"],
    outputs: ["Scores", "Quotes", "Red flags"],
  },
  {
    name: "Hiring Recommendation",
    summary: "Writes an advisory hire or no-hire. A person still decides.",
    inputs: ["Scorecard", "Interview analysis"],
    outputs: ["Recommendation", "Rationale", "Compensation note"],
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
    body: "JD Parser, Screen & Score, Outreach, and Hiring Recommendation each write an output on the candidate.",
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
        body: "JD Parser, Resume Parser, Screen & Score, Shortlist, Outreach, Interview Schedule, Interview Analysis, and Hiring Recommendation run on this requisition.",
      },
    ],
  },
  "product/resume-parser": {
    kicker: "Product",
    title: "Resume Parser",
    lede: "Resume Parser reads one resume into a candidate profile. Screen & Score then compares that resume with the parsed job and writes the scorecard.",
    points: [
      {
        title: "Resume Parser",
        body: "Input is the resume. Output is a structured candidate profile.",
      },
      {
        title: "Screen & Score",
        body: "Inputs are the resume and the parsed job. Output is a match score, strengths, gaps, and interview focus.",
      },
      {
        title: "Many resumes, one bar",
        body: "JD Parser sets the bar once. Every resume on the role is scored against it.",
      },
    ],
  },
  "product/copilot": {
    kicker: "Product",
    title: "Interview analysis",
    lede: "Interview Analysis reads the transcript against the interview plan and writes scores, quotes, and red flags. It does not join the call.",
    points: [
      {
        title: "Schedule first",
        body: "Interview Schedule proposes times and an invite message from the interview plan. You send it.",
      },
      {
        title: "Transcript in",
        body: "Paste the transcript. Interview Analysis scores what was actually said.",
      },
      {
        title: "Recommendation out",
        body: "Hiring Recommendation combines that analysis with the scorecard. A person still decides.",
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
    lede: "Open one engineering requisition. JD Parser sets the bar once. Screen & Score runs on every resume.",
    points: [
      {
        title: "Same bar for every resume",
        body: "Match scores are computed against this job description, not a generic skills list.",
      },
      {
        title: "Probe questions come from gaps",
        body: "Screen & Score lists the gaps. Interview Analysis later checks them against the transcript.",
      },
      {
        title: "The loop leaves a record",
        body: "Interview Analysis and the Hiring Recommendation stay on the candidate.",
      },
    ],
  },
  "use-cases/executive": {
    kicker: "Use case",
    title: "A senior search with a short slate",
    lede: "Executive roles are still one board. Fewer candidates, heavier documents, and a Hiring Recommendation the committee can read.",
    points: [
      {
        title: "One confidential role",
        body: "The search lives on its own board, separate from high-volume reqs.",
      },
      {
        title: "A written recommendation",
        body: "Hiring Recommendation combines the scorecard and Interview Analysis into a rationale.",
      },
      {
        title: "The interview gets a time",
        body: "Interview Schedule proposes slots and a message. You send the invite.",
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
        body: "Screen & Score and the interview plan give every interviewer the same gaps and signals.",
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
        body: "JD Parser, Resume Parser, and Screen & Score cover the first pass a coordinator usually does by hand.",
      },
      {
        title: "The founder still decides",
        body: "Hiring Recommendation is advice. The founder still makes the offer.",
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
        body: "Hiring Recommendation writes the rationale from the scorecard and Interview Analysis.",
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
        body: "Run JD Parser, Resume Parser, Screen & Score, then Shortlist, Outreach, Interview Schedule, Interview Analysis, and Hiring Recommendation.",
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
