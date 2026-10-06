import React from 'react';
import { 
  Flame, Award, Target, TrendingUp, 
  ArrowUpRight, Calendar, Bell, Settings,
  Trophy, CreditCard, RefreshCw
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { useDashboard, useNinjaRoadmap, useStartPractice, useV2Dashboard, useV2ScheduleCall } from '../../../hooks/useN8n';
import { useAuth } from '../../../contexts/AuthContext';
import CountdownTimer from './CountdownTimer';
import ScoreChart from './ScoreChart';
import SkillGrid from './SkillGrid';
import RoadmapTimeline from './RoadmapTimeline';
import SkeletonCard, { SkeletonValue } from '../../ui/SkeletonCard';
import ApiError from '../../ui/ApiError';
import { apiCall } from '../../../config/api';
import { toast } from 'sonner';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const NinjaDashboard = ({ onReset }) => {
    const { data, isLoading, isError, error, refetch } = useDashboard();
    const { 
        data: roadmapData, 
        isLoading: roadmapLoading, 
        isError: roadmapError 
    } = useNinjaRoadmap();
    const { user } = useAuth();
    
    // V2 data overlay — enriches dashboard with new schema data
    const { data: v2Data } = useV2Dashboard();
    const v2 = v2Data || {};
    const v2Stats = v2.stats || {};
    const v2Profile = v2.profile || {};

    const roadmapSteps = roadmapData?.steps || v2?.roadmap?.steps || [];
    const startPractice = useStartPractice();

    const navigate = useNavigate();

    const handleStartPractice = async () => {
        const callsRemaining = data?.calls_remaining || 0;
        const carriesCredits = (data?.credits_balance || 0) > 0;
        const hasSub = data?.subscription_tier && data?.subscription_tier !== 'free' && data?.subscription_tier !== 'none';
        const sessionsCompleted = data?.sessionsCompleted ?? 0;
        const isFirstTimerCall = sessionsCompleted === 0;
        
        // If no quota and not first timer, go to pricing
        if (callsRemaining <= 0 && !isFirstTimerCall && !carriesCredits && !hasSub) {
            navigate('/pricing');
            return;
        }

        if (!data?.targetRole || data?.todaysStatus === 'called' || data?.todaysStatus === 'completed') return;
        
        try {
            await startPractice.mutateAsync({
                userId: user?.email || data.email || 'user',
                email: user?.email || data.email || '',
                targetRole: data.targetRole,
                dayNumber: data.dayNumber || 1
            });
            // Update local state or refetch dashboard to show 'called' status
            refetch();
        } catch (err) {
            console.error("Failed to start session:", err);
            alert("Failed to initiate training. Please try again later.");
        }
    };

    // Gating Logic
    const today = new Date().getDay();
    const subTier = (data?.subscription_tier || 'free').toLowerCase();
    const hasSub = subTier !== 'free' && subTier !== 'none' && subTier !== '';
    const credits = data?.credits_balance || 0;
    const callsRemaining = data?.calls_remaining || 0;
    const preferredDays = data?.preferred_call_days || [];
    const sessionsCompleted = data?.sessionsCompleted ?? 0;
    const isFirstTimerCall = !isLoading && sessionsCompleted === 0;
    
    let isAllowedToday = false;
    let btnText = 'Start Today\'s Session';
    let btnDisabled = false;
    let gateMessage = "";

    if (isFirstTimerCall) {
        isAllowedToday = true;
        btnText = '🎯 Take First Free AI Ninja Call';
    } else if (hasSub) {
        if (subTier === 'elite' || subTier === 'ninja-elite') {
            isAllowedToday = true;
            btnText = `Start Elite Protocol (${callsRemaining} left)`;
        } else if (preferredDays.includes(today)) {
            if (callsRemaining > 0) {
                isAllowedToday = true;
                btnText = `Start Session (${callsRemaining} left)`;
            } else {
                isAllowedToday = false;
                btnText = "Quota Exceeded";
                btnDisabled = true;
                gateMessage = "Monthly quota reached. Upgrade or buy credits.";
            }
        } else {
            isAllowedToday = false;
            btnText = "Not Scheduled Today";
            btnDisabled = true;
            const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const nextDay = preferredDays.find(d => d > today) ?? preferredDays[0];
            gateMessage = nextDay !== undefined ? `Next session: ${dayNames[nextDay]}` : "No days scheduled";
        }
    } else if (callsRemaining > 0 || credits > 0) {
        isAllowedToday = true;
        const totalQuota = Math.max(callsRemaining, credits);
        btnText = `Start Session (${totalQuota} left)`;
    } else {
        isAllowedToday = false;
        btnText = "Unlock AI Ninja";
    }

    if (data?.todaysStatus === 'called') {
        btnText = "Call Initiated";
        btnDisabled = true;
    } else if (data?.todaysStatus === 'completed') {
        btnText = "Call Completed ✓";
        btnDisabled = true;
    }

    const roadmapRef = React.useRef(null);

    const scrollToRoadmap = () => {
        roadmapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    if (isError) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <ApiError error={error} retry={refetch} />
            </div>
        );
    }

    // Derive display values — prefer V2 data when available, fallback to legacy
    const streak        = v2Stats.current_streak ?? data?.currentStreak ?? '—';
    const rank          = v2Stats.rank ? `#${v2Stats.rank}` : data?.leaderboardRank ? `#${data.leaderboardRank.toLocaleString()}` : '—';
    const readiness     = v2Stats.avg_score ? `${Math.round(v2Stats.avg_score)}%` : data?.avgScore ? `${Math.round(data.avgScore)}%` : '—';
    const dayNumber     = v2Stats.current_day ?? data?.dayNumber ?? '—';
    const currentPhase  = data?.currentPhase ?? 'depth';
    const depthDays     = data?.depthPhaseDays ?? 34;
    const totalDays     = data?.totalDays ?? 34;
    const phasePct      = dayNumber !== '—' ? Math.min((dayNumber / depthDays) * 100, 100) : 0;
    const weeklyImprove = data?.weeklyImprovement ? `+${data.weeklyImprovement}%` : '+0%';
    const targetRole    = v2Profile.target_role ?? data?.targetRole ?? 'Your Roadmap';
    const longestStreak = v2Stats.longest_streak ?? data?.longestStreak ?? '—';
    const totalSessions = v2Stats.total_sessions ?? data?.sessionsCompleted ?? 0;
    
    // Fallback to roadmap data for "Today's Topics" if dashboard data doesn't have it
    const activeDay = data?.dayNumber || 1;
    const todaysTopics = data?.todaysQuestions || 
                        roadmapSteps.filter(s => s.day_number === activeDay) || 
                        [];


    const stats = [
        { label: 'Current Streak', value: isLoading ? null : `${streak} Days`, icon: <Flame className="text-orange-500" />, sub: `Longest: ${longestStreak} days` },
        { label: 'Global Rank', value: isLoading ? null : rank, icon: <Award className="text-blue-600" />, sub: `${totalSessions} sessions completed` },
        { label: 'Job Readiness', value: isLoading ? null : readiness, icon: <Target className="text-emerald-500" />, sub: `${weeklyImprove} from last week` },
        { label: 'Quota Remaining', value: isLoading ? null : `${v2Profile.calls_remaining ?? data?.calls_remaining ?? 0} Calls`, icon: <CheckCircle2 className="text-emerald-500" />, sub: `${data?.credits_balance || 0} Credits available` },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-20">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">
                        Welcome Back, Ninja.
                    </h1>
                    <p className="text-slate-500 font-medium">
                        Day {dayNumber} of your <span className="text-blue-600 font-bold">{targetRole} — {currentPhase === 'depth' ? 'Deep Dive' : 'Gap Analysis'}</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="rounded-2xl border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-100 px-4 font-bold"
                        onClick={onReset}
                    >
                        Reset Protocol
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-2xl border-slate-200">
                        <Bell size={20} />
                    </Button>
                    <Button 
                        className={`rounded-2xl px-6 font-bold flex items-center gap-2 transition-all ${
                            !isAllowedToday && !hasSub && credits === 0 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200' 
                            : btnDisabled 
                                ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
                                : 'bg-slate-900 text-white'
                        }`}
                        disabled={(btnDisabled && data?.todaysStatus !== 'not_scheduled') || startPractice.isPending}
                        onClick={handleStartPractice}
                    >
                        {!hasSub && credits === 0 && <CreditCard size={18} />}
                        {startPractice.isPending ? 'Initiating...' : btnText}
                    </Button>
                </div>
            </div>

            {/* CALL SCHEDULING - Moved from Profile */}
            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-3 p-8 border-slate-100 rounded-[32px] bg-white shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-[#1a3a5f]/5 rounded-2xl flex items-center justify-center text-[#1a3a5f]">
                            <Clock size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">Training Schedule</h3>
                            <p className="text-sm text-slate-500 font-medium">Configure when your AI Ninja initiates training protocols.</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 items-start">
                        <div className="bg-[#f8fafc] p-6 rounded-2xl border border-slate-100 flex gap-4">
                            <AlertCircle className="text-[#c5a059] flex-shrink-0" size={20} />
                            <p className="text-sm text-slate-700 font-bold leading-relaxed">
                                {subTier === 'ninja-starter' 
                                    ? "Starter Member: 1 session per week protocols active. Select your target synchronization day."
                                    : subTier === 'ninja-pro'
                                    ? "Pro Member: Triple-protocol active (3 sessions per week). Select your preferred baseline day."
                                    : subTier === 'ninja-elite' || subTier === 'elite'
                                    ? "Elite Member: Daily 24/7 training protocols active. No manual scheduling required."
                                    : "Subscription required for recurring training. Credit-based access enables manually triggered sessions."}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Select Target Days</label>
                            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
                                    const dayNum = idx + 1; // 1-7
                                    const isSelected = preferredDays.includes(dayNum);
                                    
                                    return (
                                        <button
                                            key={day}
                                            disabled={subTier === 'free' || subTier === 'none' || subTier === 'elite' || subTier === 'ninja-elite'}
                                            onClick={async () => {
                                                try {
                                                    await apiCall('/api/update-call-schedule', {
                                                        method: 'POST',
                                                        body: JSON.stringify({ email: user?.email, preferred_days: [dayNum] })
                                                    });
                                                    toast.success(`${day} scheduled for training.`);
                                                    refetch();
                                                } catch (err) {
                                                    toast.error("Failed to update schedule.");
                                                }
                                            }}
                                            className={`py-3 rounded-xl font-bold text-xs transition-all border-2 ${
                                                isSelected 
                                                ? 'bg-[#1a3a5f] border-[#1a3a5f] text-white shadow-lg' 
                                                : 'bg-white border-slate-100 text-[#1a3a5f] hover:border-[#c5a059] hover:text-[#c5a059]'
                                            } ${(subTier === 'free' || subTier === 'none' || subTier === 'elite' || subTier === 'ninja-elite') ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
                                        >
                                            {day}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            <div className="mt-6">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Preferred Calling Time</label>
                                <select 
                                    className="w-full sm:w-auto px-4 py-3 bg-white border-2 border-slate-100 rounded-xl text-sm font-bold text-slate-700 outline-none hover:border-[#c5a059] focus:border-[#1a3a5f] cursor-pointer"
                                    defaultValue={data?.preferred_call_time || "10:00"}
                                    onChange={async (e) => {
                                        try {
                                            await apiCall('/api/update-call-schedule', {
                                                method: 'POST',
                                                body: JSON.stringify({ email: user?.email, preferred_time: e.target.value })
                                            });
                                            toast.success(`Call time updated to ${e.target.value}`);
                                        } catch (err) {
                                            toast.error("Failed to update time.");
                                        }
                                    }}
                                    disabled={subTier === 'free' || subTier === 'none'}
                                >
                                    <option value="08:00">08:00 AM</option>
                                    <option value="09:00">09:00 AM</option>
                                    <option value="10:00">10:00 AM</option>
                                    <option value="11:00">11:00 AM</option>
                                    <option value="12:00">12:00 PM</option>
                                    <option value="13:00">01:00 PM</option>
                                    <option value="14:00">02:00 PM</option>
                                    <option value="15:00">03:00 PM</option>
                                    <option value="16:00">04:00 PM</option>
                                    <option value="17:00">05:00 PM</option>
                                    <option value="18:00">06:00 PM</option>
                                    <option value="19:00">07:00 PM</option>
                                    <option value="20:00">08:00 PM</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
            
            {gateMessage && (
                <div className="bg-blue-50 border border-blue-100 flex items-center justify-center p-3 rounded-2xl">
                    <p className="text-blue-700 font-bold text-sm tracking-tight">{gateMessage}</p>
                </div>
            )}

            {/* Countdown & Live Status */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <CountdownTimer todaysStatus={data?.todaysStatus} />
                </div>
                <div className="bg-slate-900 text-white rounded-3xl p-6 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <Badge className="bg-emerald-500/20 text-emerald-400 border-none px-3 py-1 font-bold">CURRENT PHASE</Badge>
                        <TrendingUp size={20} className="text-blue-400" />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold mb-1">
                            {currentPhase === 'depth' ? 'Depth Phase' : 'Gap Phase'}
                        </h3>
                        <p className="text-slate-400 text-sm">
                            {currentPhase === 'depth'
                                ? 'Focusing on high-impact skills and system design.'
                                : 'Filling skill gaps identified during depth phase.'}
                        </p>
                    </div>
                    <div className="mt-4 h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${phasePct}%` }} />
                    </div>
                    <p className="text-[10px] text-slate-500 font-bold mt-2 uppercase tracking-wider">
                        Day {dayNumber} / {totalDays}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <Card key={i} className="p-6 border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                                {stat.icon}
                            </div>
                            <ArrowUpRight size={16} className="text-slate-300" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                            {stat.value === null
                                ? <SkeletonValue width="80px" height="32px" />
                                : <h4 className="text-3xl font-black text-slate-900">{stat.value}</h4>
                            }
                            <p className="text-xs font-bold text-slate-500">{stat.sub}</p>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Performance Chart & Weekly Topics */}
            <div className="grid lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2 p-8 border-slate-100 rounded-[32px] overflow-hidden">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            Performance Trend <Badge variant="secondary" className="bg-blue-50 text-blue-600 border-none font-bold">{weeklyImprove}</Badge>
                        </h3>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="font-bold text-slate-400">7D</Button>
                            <Button variant="ghost" size="sm" className="font-bold text-blue-600 bg-blue-50">30D</Button>
                        </div>
                    </div>
                    {isLoading
                        ? <SkeletonCard lines={4} className="border-none p-0" />
                        : <ScoreChart recentScores={data?.recentScores} />
                    }
                </Card>

                <Card className="p-8 border-slate-100 rounded-[32px] bg-slate-50/50">
                    <h3 className="text-xl font-bold mb-6">Today's Topics</h3>
                    <div className="space-y-4">
                        {(isLoading || roadmapLoading) ? (
                            <SkeletonCard lines={3} className="border-none p-0" />
                        ) : todaysTopics.length > 0 ? (
                            todaysTopics.slice(0, 5).map((topic, i) => (
                                <div key={topic.id || i} className="flex items-center gap-4 group cursor-pointer">
                                    <div className={`w-2 h-12 rounded-full group-hover:h-14 transition-all ${
                                        topic.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
                                    }`} />
                                    <div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {topic.topic || topic.title || topic.question || topic.skill}
                                        </h4>
                                        <p className="text-xs font-bold text-slate-400 capitalize">
                                            {topic.topic_category || topic.skill} • {topic.difficulty || 'Medium'}
                                        </p>

                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-slate-400 font-medium">No topics scheduled for today.</p>
                        )}
                    </div>
                    <Button 
                        onClick={scrollToRoadmap}
                        className="w-full mt-8 rounded-2xl border-2 border-slate-200 bg-white text-slate-900 font-black hover:bg-slate-50" 
                        variant="outline"
                    >
                        View Full Roadmap
                    </Button>
                </Card>
            </div>

            {/* Roadmap Timeline Section */}
            <div className="space-y-8 pt-8" ref={roadmapRef}>
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <Badge className="bg-slate-900/5 text-slate-600 border-none font-bold uppercase tracking-widest text-[10px]">THE PATH TO MASTERY</Badge>
                        <h3 className="text-4xl font-black text-slate-900 tracking-tight">Your 34-Day Roadmap</h3>
                        <p className="text-slate-500 max-w-2xl font-medium">
                            Each day is a tactical operation. Complete Day 3 to unlock Day 6, and follow the sequence to achieve seniority.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="bg-blue-50 p-4 rounded-2xl flex items-center gap-4">
                            <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                 <Trophy size={20} />
                            </div>
                            <div>
                                 <p className="text-[10px] font-black text-blue-400 uppercase tracking-wider">Projected Readiness</p>
                                 <p className="text-lg font-black text-blue-900">94% Senior Match</p>
                            </div>
                        </div>
                        {/* ── Reset Roadmap Button ── */}
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-2xl border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-300 font-bold px-4 py-2 flex items-center gap-2"
                            onClick={onReset}
                        >
                            <RefreshCw size={14} />
                            Reset Roadmap
                        </Button>
                    </div>
                </div>


                {roadmapLoading ? (
                    <div className="space-y-12">
                        {[1, 2, 3].map(i => <SkeletonCard key={i} lines={3} />)}
                    </div>
                ) : roadmapError ? (
                    <Card className="p-8 border-red-100 bg-red-50/30 text-center">
                        <p className="text-red-600 font-bold mb-4">Failed to synchronize roadmap intel.</p>
                        <Button variant="outline" className="rounded-xl" onClick={() => window.location.reload()}>Retry Sync</Button>
                    </Card>
                ) : (
                    <RoadmapTimeline 
                        steps={roadmapSteps} 
                        currentDay={activeDay} 
                        todaysStatus={data?.todaysStatus}
                        onStartSession={handleStartPractice}
                        isStarting={startPractice.isPending}
                    />
                )}

            </div>

            {/* Skill Progression Grid */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight">Active Skills</h3>
                    <Button variant="link" className="text-blue-600 font-bold p-0">Detailed Analysis</Button>
                </div>
                {isLoading
                    ? <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[1,2,3].map(i => <SkeletonCard key={i} lines={2} />)}
                      </div>
                    : <SkillGrid 
                        selectedSkills={data?.selectedSkills} 
                        missingSkills={data?.missingSkills} 
                      />
                }
            </div>
        </div>
    );
};

export default NinjaDashboard;
