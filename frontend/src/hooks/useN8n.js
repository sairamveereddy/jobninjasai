import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../lib/api';

// ─── DASHBOARD (refetch every 30s) ──────────────────────────

export function useDashboard() {
  const { user } = useAuth();
  const userId = user?.email || user?.id;
  return useQuery({
    queryKey: ['dashboard', userId],
    queryFn: () => api.fetchDashboard(userId),
    enabled: !!userId,
    refetchInterval: 30_000,
    staleTime: 25_000,
  });
}

// ─── LEADERBOARD (refetch every 60s) ────────────────────────

export function useLeaderboard(limit = 20) {
  const { user } = useAuth();
  const userId = user?.email || user?.id;
  return useQuery({
    queryKey: ['leaderboard', userId, limit],
    queryFn: () => api.fetchLeaderboard(userId, limit),
    enabled: !!userId,
    refetchInterval: 60_000,
    staleTime: 55_000,
  });
}

// ─── RESUME PARSING ─────────────────────────────────────────

export function useParseResume() {
  return useMutation({ mutationFn: api.parseResume });
}

export function useParseResumeText() {
  return useMutation({ mutationFn: api.parseResumeText });
}

// ─── MARKET ANALYSIS ────────────────────────────────────────

export function useAnalyseMarket() {
  return useMutation({
    mutationFn: ({ resumeText, targetRole, targetCompanies }) =>
      api.analyseResumeMarket(resumeText, targetRole, targetCompanies),
  });
}

// ─── RESUME GENERATION ──────────────────────────────────────

export function useGenerateResume() {
  return useMutation({
    mutationFn: ({ resumeText, targetRole, marketAnalysis }) =>
      api.generateResume(resumeText, targetRole, marketAnalysis),
  });
}

// ─── SKILL EXTRACTION ───────────────────────────────────────

export function useExtractSkills() {
  return useMutation({ mutationFn: api.extractSkills });
}

// ─── AI NINJA ACTIVATION ────────────────────────────────────

export function useActivateNinja() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (payload) => api.activateNinja(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      queryClient.invalidateQueries(['roadmap', user?.email || user?.id]);
    },
  });
}

export function useResetNinja() {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: (userId) => api.resetNinjaProgress(userId),
    onSuccess: () => {
      queryClient.invalidateQueries(['roadmap', user?.email || user?.id]);
      queryClient.invalidateQueries(['onboarding-survey', user?.email]);
    },
  });
}


// ─── ONBOARDING ─────────────────────────────────────────────

export function useOnboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.onboardUser(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useOnboardingSurvey() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['onboarding-survey', user?.email],
    queryFn: () => api.fetchOnboardingSurvey(user?.email),
    enabled: !!user?.email,
    staleTime: Infinity, // Only fetch once on mount
  });
}

export function useOptimizeProfile() {

  return useMutation({
    mutationFn: (payload) => api.optimizeProfile(payload),
  });
}

// ─── ROADMAP ────────────────────────────────────────────────

export function useNinjaRoadmap() {
  const { user } = useAuth();
  const userId = user?.email || user?.id;
  return useQuery({
    queryKey: ['roadmap', userId],
    queryFn: () => api.fetchNinjaRoadmap(userId),
    enabled: !!userId,
  });
}

// ─── PRACTICE SESSIONS ──────────────────────────────────────

export function useStartPractice() {
  return useMutation({
    mutationFn: (payload) => api.startNinjaPractice(payload),
  });
}

// ─── V2 HOOKS (Native FastAPI — no n8n) ─────────────────────

export function useV2Dashboard() {
  const { user } = useAuth();
  const email = user?.email;
  return useQuery({
    queryKey: ['v2-dashboard', email],
    queryFn: () => api.v2Dashboard(email),
    enabled: !!email,
    refetchInterval: 30_000,
    staleTime: 25_000,
  });
}

export function useV2Leaderboard(limit = 20) {
  return useQuery({
    queryKey: ['v2-leaderboard', limit],
    queryFn: () => api.v2Leaderboard(limit),
    refetchInterval: 60_000,
    staleTime: 55_000,
  });
}

export function useV2Onboard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.v2Onboard(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['v2-dashboard'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });
}

export function useV2ScheduleCall() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.v2ScheduleCall(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['v2-dashboard'] });
    },
  });
}

