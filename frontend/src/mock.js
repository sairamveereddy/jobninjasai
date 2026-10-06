// Mock data for JobNinjas landing page
import { BRAND } from './config/branding';

export const heroStats = {
  jobsThisWeek: 347,
  totalJobsApplied: 2850,
  hoursSaved: 485,
  successRate: "92%"
};

export const whyDifferent = [
  {
    id: 1,
    title: "AI-Powered Strategy",
    description: "Our AI analyzes job descriptions and your profile to create the perfect application strategy, ensuring you stand out in the applicant tracking systems."
  },
  {
    id: 2,
    title: "Lightning Fast Tailoring",
    description: "Automatically generate customized resumes, cover letters, and application answers in seconds. No more spending hours on a single application."
  },
  {
    id: 3,
    title: "Data-Driven Insights",
    description: "Get real-time feedback on your job search performance and interview readiness with our advanced performance analytics and reporting."
  },
  {
    id: 4,
    title: "Personalized Career Roadmaps",
    description: "Your AI Ninja builds a custom roadmap tailored to your career goals, helping you focus on the skills and roles that matter most."
  }
];

export const servicesOffered = [
  "AI-powered resume and cover letter tailoring",
  "Automated application filling and tracking",
  "Real-time interview preparation and practice",
  "Personalized career roadmaps and goal setting",
  "Daily job search performance analytics",
  "Direct roadmap refinement from AI coaching"
];

export const whyChooseUs = [
  "92% success rate in landing interviews",
  "Advanced AI-powered application tailoring",
  "Real-time progress tracking dashboard",
  "Flexible plans for every career stage",
  "Cancel anytime, no long-term contracts"
];

export const testimonials = [
  {
    id: 1,
    name: "Rahul M.",
    role: "Software Engineer",
    before: "Unemployed for 4 months",
    after: "Senior Developer at Fortune 500",
    quote: "JobNinjas transformed my job search. I was spending 4 hours daily applying to jobs with no results. Within 6 weeks of using their service, I had 5 interviews and 2 offers.",
    rating: 5
  },
  {
    id: 2,
    name: "Priya K.",
    role: "Product Manager",
    before: "Stuck in underpaying role",
    after: "40% salary increase",
    quote: "The team applied to over 200 relevant positions in my first month. The quality was incredible - every application was tailored. I landed my dream job with a 40% raise.",
    rating: 5
  },
  {
    id: 3,
    name: "Arjun S.",
    role: "Data Analyst",
    before: "H1B visa holder, 60 days to find job",
    after: "Secured role in 5 weeks",
    quote: "With my visa timeline, I couldn't afford to waste time. JobNinjas understood the urgency and delivered. I'm now working at a company that sponsored my visa.",
    rating: 5
  }
];

export const targetUsers = [
  {
    id: 1,
    title: "Recently laid off in the US",
    description: "You're dealing with unexpected job loss and need to get back on your feet quickly. The thought of applying to hundreds of jobs is overwhelming when you're already stressed."
  },
  {
    id: 2,
    title: "On a visa and racing against time",
    description: "Every day counts when your visa status depends on employment. You can't afford to waste time on the endless grind of job applications while your clock is ticking."
  },
  {
    id: 3,
    title: "Underpaid or stuck in the wrong role",
    description: "You know you deserve better, but finding time to job search while working full-time feels impossible. You're trading precious evenings for resume uploads and cover letters."
  }
];

export const howItWorksSteps = [
  {
    id: 1,
    title: "Define Your Career Goals",
    description: "Upload your resume and share your target roles, locations, and salary expectations. Your AI Ninja analyzes your profile to build your strategy."
  },
  {
    id: 2,
    title: "Activate Your AI Ninja",
    description: "Your AI Ninja starts analyzing thousands of job openings to find the best matches and builds a personalized career roadmap for you."
  },
  {
    id: 3,
    title: "Automate Your Applications",
    description: "Use our AI tools to lightning-fast tailor every resume and cover letter. Track your progress and get immediate feedback on every application."
  },
  {
    id: 4,
    title: "Crush Your Interviews",
    description: "Practice with our AI interview prep tools, track your session performance, and walk into every interview with confidence."
  }
];

export const comparisonData = [
  {
    feature: "Advanced AI job description analysis",
    jobninjas: true,
    aiBots: false
  },
  {
    feature: "Strategic, non-spammy application tailoring",
    jobninjas: true,
    aiBots: false
  },
  {
    feature: "Personalized career roadmap & goal tracking",
    jobninjas: true,
    aiBots: false
  },
  {
    feature: "AI-powered interview prep & performance feedback",
    jobninjas: true,
    aiBots: false
  },
  {
    feature: "Full control over every application submission",
    jobninjas: true,
    aiBots: false
  }
];

// Legacy pricing plans removed - use PRICING from branding.js instead
// Current pricing:
// - AI Ninja Free: $0, 5 applications
// - AI Ninja Pro: $29.99/month, 200 applications/month
// - Human Ninja Starter: $50 for 25 applications
// - Human Ninja Growth: $199 for 100 applications  
// - Human Ninja Scale: $399 for 250 applications
export const pricingPlans = [];

export const metricsData = [
  {
    id: 1,
    number: "12,500+",
    label: "Applications submitted for clients"
  },
  {
    id: 2,
    number: "6,200+",
    label: "Estimated hours saved for job seekers"
  },
  {
    id: 3,
    number: "73%",
    label: "Report more interviews within 4-8 weeks"
  }
];

export const faqData = [
  {
    id: 1,
    question: "Do you guarantee a job?",
    answer: "While we don't guarantee job offers, we guarantee a dramatically more efficient and strategic job search. We automate the repetitive grind so you can focus on interview performance and networking, which are the real keys to landing offers."
  },
  {
    id: 2,
    question: "How does the AI tailoring work?",
    answer: "Our AI analyzes job descriptions in real-time and identifies key requirements. It then maps your experience to those requirements, helping you generate perfectly tailored resumes and cover letters for every single application."
  },
  {
    id: 3,
    question: "Will you apply to jobs automatically for me?",
    answer: "Our tools are designed to automate the heavy lifting of tailoring and form-filling. You maintain control over which roles to apply for, while our AI Ninja handles the time-consuming process of preparation and tracking."
  },
  {
    id: 4,
    question: "Which countries do you support?",
    answer: "Currently, our platform is optimized for the US job market, helping job seekers navigate US-based application platforms and employer expectations."
  },
  {
    id: 5,
    question: "Is my data secure?",
    answer: "Yes, we prioritize your data security. Your resumes and profile information are encrypted and stored securely. We never share your personal information with third parties without your explicit consent."
  },
  {
    id: 6,
    question: "How quickly will I see results?",
    answer: "Most users start landing more interview requests within 2-4 weeks of using our AI-powered tailoring. By ensuring every application is high-quality, you significantly increase your conversion rate from application to interview."
  },
  {
    id: 7,
    question: "Can I cancel my subscription anytime?",
    answer: "Absolutely. Our monthly subscriptions are flexible. You can cancel anytime from your dashboard with a single click. No hidden fees or long-term commitments."
  }
];

export const aboutContent = {
  title: `Why we started ${BRAND.name}`,
  story: `We started ${BRAND.name} because we saw too many talented people stuck in the exhausting cycle of manual job applications. That's why we created AI Ninja — your personal career automation partner. Our platform uses advanced AI to analyze job descriptions and tailor your applications with precision, helping you stand out in competitive markets. We never mass-apply or spam recruiters. Instead, we empower you with the tools and insights needed to land your dream job faster, while you focus on what actually gets you hired: building relationships and crushing interviews.`
};

// ============================================
// SAMPLE JOB DATA FOR AI NINJA
// ============================================

export const sampleJobs = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    location: 'San Francisco, CA',
    salaryRange: '$150,000 - $200,000',
    visaTags: ['H-1B', 'STEM OPT'],
    type: 'remote',
    highPay: true,
    sourceUrl: 'https://example.com/job/1',
    categoryTags: ['High-paying', 'Visa sponsorship'],
    description: 'We are looking for a Senior Software Engineer to join our growing team. You will work on cutting-edge technologies and help build scalable systems.',
    fullDescription: `About the Role:
We are seeking a talented Senior Software Engineer to join our engineering team. You will be responsible for designing, developing, and maintaining high-quality software solutions.

Requirements:
- 5+ years of experience in software development
- Proficiency in Python, JavaScript, or similar languages
- Experience with cloud platforms (AWS, GCP, Azure)
- Strong problem-solving skills

Benefits:
- Competitive salary with equity
- Full health, dental, and vision coverage
- Flexible work arrangements
- H-1B visa sponsorship available`,
    postedDate: '2025-12-28'
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'InnovateTech',
    location: 'New York, NY',
    salaryRange: '$130,000 - $170,000',
    visaTags: ['OPT', 'STEM OPT', 'H-1B'],
    type: 'hybrid',
    highPay: true,
    sourceUrl: 'https://example.com/job/2',
    categoryTags: ['High-paying', 'Visa sponsorship'],
    description: 'Join our product team to drive innovation and lead product development from concept to launch.',
    fullDescription: `About InnovateTech:
We're a fast-growing startup revolutionizing the fintech space. Our Product Manager will own the entire product lifecycle.

What You'll Do:
- Define product vision and roadmap
- Work closely with engineering and design teams
- Conduct user research and gather feedback
- Drive product launches and iterations

What We're Looking For:
- 3+ years of product management experience
- Strong analytical and communication skills
- Experience with agile methodologies
- MBA preferred but not required

We sponsor all visa types!`,
    postedDate: '2025-12-27'
  },
  {
    id: '3',
    title: 'Data Scientist',
    company: 'DataFlow Analytics',
    location: 'Austin, TX',
    salaryRange: '$120,000 - $160,000',
    visaTags: ['STEM OPT', 'H-1B'],
    type: 'remote',
    highPay: true,
    sourceUrl: 'https://example.com/job/3',
    categoryTags: ['High-paying', 'Visa sponsorship', 'Remote'],
    description: 'Build machine learning models and derive insights from complex datasets to drive business decisions.',
    fullDescription: `Role Overview:
As a Data Scientist at DataFlow Analytics, you'll work with large-scale datasets to build predictive models and extract actionable insights.

Responsibilities:
- Develop and deploy ML models
- Analyze complex datasets
- Collaborate with stakeholders to understand business needs
- Present findings to leadership

Requirements:
- MS or PhD in Computer Science, Statistics, or related field
- 2+ years of industry experience
- Proficiency in Python, SQL, and ML frameworks
- Experience with deep learning is a plus

100% remote position with visa sponsorship available.`,
    postedDate: '2025-12-26'
  },
  {
    id: '4',
    title: 'Frontend Developer',
    company: 'WebSolutions Co.',
    location: 'Seattle, WA',
    salaryRange: '$100,000 - $140,000',
    visaTags: ['OPT'],
    type: 'onsite',
    highPay: false,
    sourceUrl: 'https://example.com/job/4',
    categoryTags: ['Visa sponsorship'],
    description: 'Create beautiful, responsive web applications using modern frontend technologies.',
    fullDescription: `About the Position:
WebSolutions Co. is looking for a skilled Frontend Developer to join our creative team.

What You'll Work On:
- Build responsive web applications
- Collaborate with UX designers
- Optimize performance and accessibility
- Contribute to our component library

Tech Stack:
- React, TypeScript
- Next.js, Tailwind CSS
- Testing with Jest and Playwright

We welcome OPT candidates!`,
    postedDate: '2025-12-25'
  },
  {
    id: '5',
    title: 'DevOps Engineer',
    company: 'CloudScale Systems',
    location: 'Denver, CO',
    salaryRange: '$140,000 - $180,000',
    visaTags: ['H-1B', 'Green Card'],
    type: 'remote',
    highPay: true,
    sourceUrl: 'https://example.com/job/5',
    categoryTags: ['High-paying', 'Visa sponsorship', 'Remote'],
    description: 'Design and maintain cloud infrastructure, CI/CD pipelines, and ensure system reliability.',
    fullDescription: `CloudScale Systems is seeking a DevOps Engineer to help us scale our infrastructure.

Key Responsibilities:
- Design and implement CI/CD pipelines
- Manage Kubernetes clusters
- Monitor system performance and reliability
- Automate infrastructure provisioning

Requirements:
- 4+ years of DevOps/SRE experience
- Strong knowledge of AWS or GCP
- Experience with Terraform, Docker, Kubernetes
- Scripting skills (Python, Bash)

Remote work + H-1B and Green Card sponsorship available.`,
    postedDate: '2025-12-24'
  }
];

// AI Ninja FAQ
export const aiNinjaFAQ = [
  {
    id: 1,
    question: "Do you log into company portals and apply for me?",
    answer: "Our AI generates high-quality resumes, cover letters, and suggested answers for each job based on the job description. You review the generated materials and stay in full control of the final submission process."
  },
  {
    id: 2,
    question: "Will this get my resume blacklisted?",
    answer: "Our goal is the opposite. We don't spam dozens of roles in the same company with the same profile. We focus on targeted roles and one smart application per company per month when we operate on your behalf."
  },
  {
    id: 3,
    question: "Can you guarantee me a job or visa?",
    answer: "No. We don't make fake guarantees. We guarantee a serious, structured application process. Your interviews, performance, and the market still matter."
  }
];
