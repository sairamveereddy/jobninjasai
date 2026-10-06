import React from 'react';
import { 
  Flame, Award, Target, TrendingUp, 
  ArrowUpRight, Calendar, Bell, 
  Trophy, CreditCard, RefreshCw, ChevronDown,
  Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { useDashboard, useNinjaRoadmap, useStartPractice, useV2Dashboard } from '../../../hooks/useN8n';
import { useAuth } from '../../../contexts/AuthContext';
import CountdownTimer from './CountdownTimer';
import ScoreChart from './ScoreChart';
import SkillGrid from './SkillGrid';
import RoadmapTimeline from './RoadmapTimeline';
import SkeletonCard, { SkeletonValue } from '../../ui/SkeletonCard';
import ApiError from '../../ui/ApiError';
import { apiCall } from '../../../config/api';
import { toast } from 'sonner';

const NinjaDashboard = ({ onReset }) => {
    const { data, isLoading, isError, error, refetch } = useDashboard();
    const { 
        data: roadmapData, 
        isLoading: roadmapLoading, 
        isError: roadmapError 
    } = useNinjaRoadmap();
    const { user } = useAuth();
    const { data: v2Data, refetch: refetchV2 } = useV2Dashboard();
    const v2 = v2Data || {};
    const v2Stats = v2.stats || {};
    const v2Profile = v2.profile || {};
    const [isPurchasing, setIsPurchasing] = React.useState(false);

    const subTier = v2Profile.subscription_tier || data?.subscriptionTier || 'free';
    const hasSub = subTier !== 'free' && subTier !== 'none';
    const credits = v2Profile.credits_balance || data?.credits_balance || 0;
    const preferredDays = v2Profile.preferred_days || data?.preferred_days || [];

    const roadmapSteps = roadmapData?.steps || v2?.roadmap?.steps || [];
    const startPractice = useStartPractice();
    const navigate = useNavigate();

    const todaysFocus = v2Data?.todays_focus || {};
    const activeDay = todaysFocus.session_number || v2Stats.current_day || data?.dayNumber || 1;
    const todaysTopics = (todaysFocus.topics && todaysFocus.topics.length > 0)
        ? todaysFocus.topics.map(t => typeof t === 'string' ? { topic: t } : t)
        : (data?.todaysQuestions || roadmapSteps.filter(s => s.day_number === activeDay) || []);
    

    const handleStartPractice = async (dayNum) => {
        const email = user?.email || data?.email || v2Data?.user?.email;
        if (!email) {
            toast.error("Authentication required.");
            return;
        }
        
        try {
            await startPractice.mutateAsync({
                email,
                day_number: dayNum || todaysFocus.session_number || activeDay,
                roadmap_id: v2Data?.roadmap_id || v2Data?.roadmap?.id
            });
            toast.success("AI Ninja call initiated! Answer your phone.");
            if (refetchV2) refetchV2();
        } catch (err) {
            console.error("Failed to start session:", err);
            // Show the specific error from the backend if available
            const errorMsg = err.message || "Failed to initiate training. Please try again later.";
            toast.error(errorMsg);
        }
    };

    const handlePurchaseCall = async () => {
        if (!user?.email) return;
        setIsPurchasing(true);
        try {
            const res = await apiCall(`/ninja/v2/purchase-call?email=${user.email}`, { method: 'POST' });
            if (res.success) {
                toast.success("Practice call added successfully! ($5)");
                refetch();
                window.location.reload(); // Simple way to refresh all V2 state
            } else {
                toast.error(res.message || "Failed to purchase call");
            }
        } catch (err) {
            toast.error("An error occurred during purchase");
        } finally {
            setIsPurchasing(false);
        }
    };

    const sessionsCompleted = v2Stats.sessionsCompleted ?? data?.sessionsCompleted ?? 0;
    const isFirstTimer = sessionsCompleted === 0;
    const isCallDay = todaysFocus.is_call_day !== undefined ? todaysFocus.is_call_day : true;
    const calledToday = todaysFocus.called_today;
    const isVerified = todaysFocus.is_verified;
    
    let btnText = 'Initialize Practice';
    let btnDisabled = false;
    let gateMessage = "";

    if (isFirstTimer) {
        btnText = '🎯 Take First Free Call';
    } else if (isVerified) {
        btnText = "Call Verified ✓";
        btnDisabled = true;
    } else if (calledToday) {
        btnText = "Report Generating...";
        btnDisabled = true;
    } else if (!isCallDay) {
        btnText = "Study Mode: Preparation";
        btnDisabled = true;
        gateMessage = "Complete your focus points first. Your next call is scheduled.";
    } else {
        btnText = "🎯 Start AI Ninja Call";
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
    
    const stats = [
        { label: 'Current Streak', value: isLoading ? null : `${streak} Days`, icon: <Flame className="text-orange-500" />, sub: `Longest: ${longestStreak} days` },
        { label: 'Global Rank', value: isLoading ? null : rank, icon: <Award className="text-blue-400" />, sub: `${totalSessions} sessions` },
        { label: 'Readiness', value: isLoading ? null : readiness, icon: <Target className="text-purple-400" />, sub: `${weeklyImprove} growth` },
        { label: 'Remaining', value: isLoading ? null : `${v2Profile.calls_remaining ?? data?.calls_remaining ?? 0} Calls`, icon: <CheckCircle2 className="text-emerald-400" />, sub: `${data?.credits_balance || 0} Credits` },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 space-y-10 pb-20 overflow-x-hidden bg-[#faf9ff]">
            {/* Header Area */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
                <div className="space-y-1">
                    <h1 className="text-4xl font-medium text-[var(--text-main)] tracking-tight">
                        Welcome Back, <span className="text-[var(--jobninjas-accent)]">Ninja.</span>
                    </h1>
                    <p className="text-[#5c5c7a] text-sm">
                        Day {activeDay} of your <span className="text-[var(--text-main)] font-medium">{targetRole}</span> protocol
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="bg-white text-[var(--jobninjas-accent)] border-[var(--jobninjas-accent)] hover:bg-[#f3f0ff] px-4 h-9 text-xs font-bold"
                        onClick={handlePurchaseCall}
                        disabled={isPurchasing}
                    >
                        {isPurchasing ? <RefreshCw className="w-3 h-3 animate-spin mr-2" /> : <CreditCard className="w-3 h-3 mr-2" />}
                        On-Demand Call ($5)
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[#5c5c7a] hover:text-[var(--text-main)] hover:bg-[#e8e3f8] px-4 h-9 text-xs font-medium"
                        onClick={onReset}
                    >
                        Reset Protocol
                    </Button>
                    <div className="relative">
                        <Button variant="ghost" size="icon" className="h-9 w-9 text-[#5c5c7a] hover:text-[var(--text-main)] hover:bg-[#e8e3f8] border border-black/5">
                            <Bell size={16} />
                        </Button>
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-[var(--jobninjas-accent)] rounded-full shadow-[0_0_8px_var(--jobninjas-accent)]" />
                    </div>
                    <Button 
                        className={`btn-premium-primary h-9 px-6 text-xs font-medium ${
                            btnDisabled && data?.todaysStatus !== 'not_scheduled' ? 'opacity-50' : ''
                        }`}
                        disabled={(btnDisabled && data?.todaysStatus !== 'not_scheduled') || startPractice.isPending}
                        onClick={handleStartPractice}
                    >
                        {startPractice.isPending ? (
                            <RefreshCw className="animate-spin mr-2" size={14} />
                        ) : (
                            !hasSub && credits === 0 ? <CreditCard className="mr-2" size={14} /> : null
                        )}
                        {startPractice.isPending ? 'Initiating...' : btnText}
                    </Button>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                    >
                        <Card className="glass-card p-5 border-black/5 bg-[#eeeafc] hover:bg-[#e8e3f8] transition-colors cursor-default group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-[var(--text-main)]/40 group-hover:text-[var(--text-main)] transition-colors">
                                    {stat.icon}
                                </div>
                                <ArrowUpRight size={14} className="text-[var(--text-main)]/10 group-hover:text-[var(--jobninjas-accent)] transition-colors" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">{stat.label}</p>
                                {stat.value === null
                                    ? <SkeletonValue width="60px" height="24px" />
                                    : <h4 className="text-2xl font-medium text-[var(--text-main)] tracking-tight">{stat.value}</h4>
                                }
                                <p className="text-[10px] text-[#5c5c7a]">{stat.sub}</p>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Protocol Card */}
                    <Card className="glass-card p-6 bg-[#eeeafc] border-black/5">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock size={18} className="text-[var(--jobninjas-accent)]" />
                            <h3 className="text-lg font-medium text-[var(--text-main)]">Training Protocol</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <div className="p-4 bg-[#e8e3f8] rounded-lg border border-black/5 space-y-2">
                                    <div className="flex items-center gap-2 text-[var(--jobninjas-accent)] font-medium text-[10px] uppercase tracking-wider">
                                        <AlertCircle size={12} /> System Status
                                    </div>
                                    <p className="text-xs text-[#5c5c7a] leading-relaxed">
                                        {subTier === 'ninja-starter' 
                                            ? "Starter: 1 session weekly on your sync day."
                                            : subTier === 'ninja-pro'
                                            ? "Pro: Triple-sync active (3 sessions weekly)."
                                            : subTier === 'ninja-elite' || subTier === 'elite'
                                            ? "Elite: Full 24/7 autonomous protocol active."
                                            : "Manual: Subscription required for automated sync."}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">Calling Window</label>
                                    <div className="relative">
                                        <select 
                                            className="w-full px-4 py-2.5 bg-[#faf9ff]/60 border border-black/5 rounded-lg text-sm text-[var(--text-main)] outline-none hover:border-black/10 focus:border-[var(--jobninjas-accent)] transition-all appearance-none"
                                            defaultValue={data?.preferred_call_time || "10:00"}
                                            onChange={async (e) => {
                                                try {
                                                    await apiCall('/api/update-call-schedule', {
                                                        method: 'POST',
                                                        body: JSON.stringify({ email: user?.email, preferred_time: e.target.value })
                                                    });
                                                    toast.success(`Updated to ${e.target.value}`);
                                                } catch (err) {
                                                    toast.error("Update failed");
                                                }
                                            }}
                                            disabled={subTier === 'free' || subTier === 'none'}
                                        >
                                            <option value="08:00">08:00 AM — Early Morning</option>
                                            <option value="10:00">10:00 AM — Peak Focus</option>
                                            <option value="12:00">12:00 PM — Mid-Day Review</option>
                                            <option value="15:00">03:00 PM — Afternoon</option>
                                            <option value="18:00">06:00 PM — Evening</option>
                                        </select>
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-main)]/20 pointer-events-none" size={14} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-medium text-[#5c5c7a] uppercase tracking-wider">Target Days</label>
                                <div className="flex gap-2">
                                    {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, idx) => {
                                        const dayNum = idx + 1;
                                        const isSelected = preferredDays.includes(dayNum);
                                        const isLocked = (subTier === 'free' || subTier === 'none' || subTier === 'elite' || subTier === 'ninja-elite');
                                        
                                        return (
                                            <button
                                                key={idx}
                                                disabled={isLocked}
                                                onClick={async () => {
                                                    try {
                                                        await apiCall('/api/update-call-schedule', {
                                                            method: 'POST',
                                                            body: JSON.stringify({ email: user?.email, preferred_days: [dayNum] })
                                                        });
                                                        toast.success(`${day} scheduled`);
                                                        refetch();
                                                    } catch (err) {
                                                        toast.error("Failed");
                                                    }
                                                }}
                                                className={`w-8 h-8 rounded-lg text-[10px] font-medium transition-all border ${
                                                    isSelected 
                                                    ? 'bg-[var(--jobninjas-accent)] border-[var(--jobninjas-accent)] text-white' 
                                                    : 'bg-transparent border-black/5 text-[#5c5c7a] hover:border-white/20'
                                                } ${isLocked ? 'opacity-40 cursor-default' : ''}`}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-[10px] text-[#5c5c7a] mt-4">
                                    * Elite members have 24/7 protocols active.
                                </p>
                            </div>
                        </div>
                    </Card>

                    {/* Performance Card */}
                    <Card className="glass-card p-6 bg-[#eeeafc] border-black/5">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-medium text-[var(--text-main)] flex items-center gap-2">
                                Readiness Trajectory
                                <Badge className="bg-[var(--jobninjas-accent)]/10 text-[var(--jobninjas-accent)] border-[var(--jobninjas-accent)]/20 font-medium text-[10px] px-2 py-0">
                                    {weeklyImprove}
                                </Badge>
                            </h3>
                            <div className="flex bg-[#e8e3f8] p-1 rounded-lg">
                                <button className="px-3 py-1 rounded text-[10px] font-medium text-[#5c5c7a]">7D</button>
                                <button className="px-3 py-1 rounded text-[10px] font-medium bg-[var(--jobninjas-accent)] text-white shadow-sm">30D</button>
                            </div>
                        </div>
                        <div className="h-[240px]">
                            {isLoading
                                ? <SkeletonCard lines={4} className="border-none p-0 bg-transparent" />
                                : <ScoreChart recentScores={data?.recentScores} />
                            }
                        </div>
                    </Card>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Phase Card */}
                    <Card className="p-6 bg-gradient-to-br from-[#eeeafc] to-white border border-black/5 rounded-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--jobninjas-accent)]/10 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 space-y-6">
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] text-[#5c5c7a] font-medium uppercase tracking-wider">Current Phase</p>
                                <TrendingUp size={14} className="text-[var(--jobninjas-accent)]" />
                            </div>
                            
                            <div className="space-y-1">
                                <h3 className="text-xl font-medium text-[var(--text-main)]">
                                    {currentPhase === 'depth' ? 'Depth Phase' : 'Gap Phase'}
                                </h3>
                                <p className="text-xs text-[#5c5c7a] leading-relaxed">
                                    {currentPhase === 'depth'
                                        ? 'Calibrating system architecture and high-fidelity technical patterns.'
                                        : 'Focusing on edge-case readiness and critical skill gaps.'}
                                </p>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center">
                                    <p className="text-[10px] text-[#5c5c7a] font-medium">PROGRESS</p>
                                    <p className="text-[10px] font-medium text-[var(--text-main)]">{Math.round(phasePct)}%</p>
                                </div>
                                <div className="h-1 w-full bg-[#e8e3f8] rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${phasePct}%` }}
                                        transition={{ duration: 1 }}
                                        className="h-full bg-[var(--jobninjas-accent)] shadow-[0_0_12px_var(--jobninjas-accent)]" 
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Topics Card */}
                    <Card className="glass-card p-6 bg-[#eeeafc] border-black/5">
                        <div className="flex items-center gap-3 mb-6">
                            <Target size={16} className="text-[var(--jobninjas-accent)]" />
                            <h3 className="text-base font-medium text-[var(--text-main)]">Today's Focus</h3>
                        </div>

                        <div className="space-y-4">
                            {(isLoading || roadmapLoading) ? (
                                <SkeletonCard lines={3} className="border-none p-0 bg-transparent" />
                            ) : todaysTopics.length > 0 ? (
                                todaysTopics.slice(0, 4).map((topic, i) => (
                                    <div key={i} className="flex items-start gap-3 group">
                                        <div className="w-1 h-1 rounded-full bg-[var(--jobninjas-accent)] mt-1.5" />
                                        <div className="space-y-0.5">
                                            <h4 className="text-sm font-medium text-[var(--text-main)]/90 group-hover:text-[var(--jobninjas-accent)] transition-colors leading-tight">
                                                {topic.topic || topic.title || topic.question}
                                            </h4>
                                            <p className="text-[10px] text-[#5c5c7a] uppercase tracking-wider">
                                                {topic.topic_category || 'TECHNICAL'} • {topic.difficulty || 'INTENSE'}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-6 text-[#5c5c7a] text-xs font-medium italic">
                                    Protocol Standby
                                </div>
                            )}
                        </div>
                        
                        <Button 
                            onClick={scrollToRoadmap}
                            variant="ghost"
                            className="w-full mt-6 text-[#5c5c7a] hover:text-[var(--text-main)] hover:bg-[#e8e3f8] text-[10px] font-medium uppercase tracking-wider"
                        >
                            Review Full Roadmap Intel
                        </Button>
                    </Card>
                </div>
            </div>

            {/* Roadmap Section */}
            <div className="pt-16 border-t border-black/5" ref={roadmapRef}>
                <div className="mb-10">
                    <Badge className="bg-[var(--jobninjas-accent)]/5 text-[var(--jobninjas-accent)] border-[var(--jobninjas-accent)]/10 font-medium uppercase tracking-widest text-[10px] px-3 py-1 mb-4">TACTICAL TRAJECTORY</Badge>
                    <h3 className="text-3xl font-medium text-[var(--text-main)] tracking-tight">Protocol Roadmap</h3>
                    <p className="text-[#5c5c7a] text-sm mt-2 max-w-xl font-light">
                        A 34-day precision sequence designed to bridge the gap to senior engineering roles.
                    </p>
                </div>

                <div className="bg-[#eeeafc] rounded-2xl border border-black/5 p-1">
                    {roadmapLoading ? (
                        <div className="p-8"><SkeletonCard lines={5} className="bg-transparent border-none" /></div>
                    ) : (
                        <RoadmapTimeline 
                            steps={roadmapSteps} 
                            currentDay={activeDay} 
                            verificationStatus={todaysFocus.verification_status || {}}
                            onStartCall={handleStartPractice}
                            isStarting={startPractice.isPending}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default NinjaDashboard;
