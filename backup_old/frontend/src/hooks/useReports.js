import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../lib/api';

// ─── DAILY REPORTS ──────────────────────────────────────────

export function useDailyReports() {
  const { user } = useAuth();
  const userId = user?.email || user?.id;
  return useQuery({
    queryKey: ['reports', 'daily', userId],
    queryFn: () => api.fetchDailyReports(userId),
    enabled: !!userId,
    staleTime: 60_000,
  });
}

// ─── WEEKLY REPORTS ─────────────────────────────────────────

export function useWeeklyReports() {
  const { user } = useAuth();
  const userId = user?.email || user?.id;
  return useQuery({
    queryKey: ['reports', 'weekly', userId],
    queryFn: () => api.fetchWeeklyReports(userId),
    enabled: !!userId,
    staleTime: 5 * 60_000,
  });
}

// ─── MONTHLY REPORTS ────────────────────────────────────────

export function useMonthlyReports() {
  const { user } = useAuth();
  const userId = user?.email || user?.id;
  return useQuery({
    queryKey: ['reports', 'monthly', userId],
    queryFn: () => api.fetchMonthlyReports(userId),
    enabled: !!userId,
    staleTime: 10 * 60_000,
  });
}

// ─── STREAK CALENDAR ────────────────────────────────────────

export function useStreakCalendar() {
  const { user } = useAuth();
  const userId = user?.email || user?.id;
  return useQuery({
    queryKey: ['reports', 'streak', userId],
    queryFn: () => api.fetchStreakCalendar(userId),
    enabled: !!userId,
    staleTime: 5 * 60_000,
  });
}
