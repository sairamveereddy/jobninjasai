import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Role, Candidate } from '@/../../shared/types'; // Using relative path for prototype

interface DemoState {
  roles: Role[];
  candidates: Candidate[];
  isSeeded: boolean;
  seedDemoData: () => void;
  addRole: (role: Role) => void;
  updateRole: (id: string, updates: Partial<Role>) => void;
  updateCandidate: (id: string, updates: Partial<Candidate>) => void;
}

const mockRoles: Role[] = [
  {
    id: 'role-1',
    title: 'Senior AI/ML Engineer',
    department: 'Engineering',
    location: 'Remote',
    hiringManager: 'Jane Doe',
    jobDescription: 'Looking for an experienced AI engineer to build spatial recruiting tools...',
    status: 'open',
    createdAt: new Date().toISOString()
  },
  {
    id: 'role-2',
    title: 'Product Designer',
    department: 'Design',
    location: 'New York, NY',
    hiringManager: 'John Smith',
    jobDescription: 'Design spatial interfaces for B2B SaaS...',
    status: 'open',
    createdAt: new Date().toISOString()
  },
  {
    id: 'role-fde',
    title: 'Forward Deployed Engineer',
    department: 'Engineering',
    location: 'San Francisco, CA (Hybrid)',
    hiringManager: 'Alex Mercer',
    jobDescription: 'Deploy and integrate our advanced AI agents into client systems. Requires deep systems knowledge, excellent communication, and rapid problem-solving skills.',
    status: 'open',
    createdAt: new Date().toISOString()
  },
  {
    id: 'role-ophelia-demo',
    title: 'AI Engineer (Final Round → Onsite)',
    department: 'Engineering',
    location: 'New York, NY',
    hiringManager: 'Maya Rodriguez',
    jobDescription: 'Full recruiting pipeline demo with Ophelia integration. Shows start-to-end workflow: sourcing → screening → technical → final interview (2 candidates) → candidate selection → Ophelia travel booking → onsite confirmation.',
    status: 'open',
    createdAt: new Date().toISOString()
  }
];

const generateDemoCandidates = (): Candidate[] => {
  const candidates: Candidate[] = [
    {
      id: 'candidate-sarah',
      name: 'Sarah Chen',
      email: 'sarah.chen@example.com',
      status: 'Final Interview',
      location: 'Atlanta, GA',
      interviewLocation: 'New York, NY',
      interviewDate: 'October 15, 2026',
      interviewTime: '10:00 AM',
      travelBudget: 800
    }
  ];
  const stages = ['Applied', 'Recruiter Screen', 'Technical', 'Hiring Manager', 'Final'];
  for (let i = 1; i <= 12; i++) {
    candidates.push({
      id: `candidate-${i}`,
      name: `Demo Candidate ${i}`,
      email: `candidate${i}@example.com`,
      status: stages[i % stages.length]
    });
  }
  return candidates;
};

export const useDemoStore = create<DemoState>()(
  persist(
    (set) => ({
      roles: [],
      candidates: [],
      isSeeded: false,
      seedDemoData: () => set({ roles: mockRoles, candidates: generateDemoCandidates(), isSeeded: true }),
      addRole: (role) => set((state) => ({ roles: [role, ...state.roles] })),
      updateRole: (id, updates) => set((state) => ({
        roles: state.roles.map(r => r.id === id ? { ...r, ...updates } : r)
      })),
      updateCandidate: (id, updates) => set((state) => ({
        candidates: state.candidates.map(c => c.id === id ? { ...c, ...updates } : c)
      })),
    }),
    {
      name: 'job-ninjas-demo-storage',
    }
  )
);
