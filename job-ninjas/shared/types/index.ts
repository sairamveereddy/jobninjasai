export type RoleId = string;
export type CandidateId = string;

export interface Role {
  id: RoleId;
  title: string;
  department: string;
  location: string;
  hiringManager: string;
  jobDescription: string;
  status: 'open' | 'closed';
  createdAt: string;
}

export interface Candidate {
  id: CandidateId;
  name: string;
  email: string;
  status: string; // Applied, Recruiter Screen, etc.
  resumeText?: string;
  location?: string;
  interviewLocation?: string;
  interviewDate?: string;
  interviewTime?: string;
  travelBudget?: number;
  onsiteDetails?: any;
}

// Minimal mock models for prototype
