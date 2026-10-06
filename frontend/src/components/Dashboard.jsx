import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Bot, Flame, Zap, ArrowUpRight } from 'lucide-react';
import NinjaLeaderboard from './ai-ninja/NinjaLeaderboard';
import { motion } from 'framer-motion';
import { useV2Dashboard } from '../hooks/useN8n';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const { data: v2Data, isLoading: statsLoading } = useV2Dashboard();
    
    // stats can come from v2Data.stats
    const stats = v2Data?.stats || {
        roadmapStep: 0,
        totalSteps: 0,
        streak: 0,
        averageScore: 0,
        sessionsCompleted: 0
    };
    const loading = statsLoading;

    return (
        <div className="flex flex-col gap-8 p-4 md:p-8 max-w-7xl mx-auto pb-20 bg-background min-h-screen">
            {/* Header Area */}
            <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-1"
            >
                <h1 className="text-4xl font-bold text-foreground tracking-tight">
                    Global Rankings
                </h1>
                <p className="text-muted-foreground text-sm">
                    Your position in the elite engineering ecosystem.
                </p>
            </motion.div>

            {/* Stats Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                >
                    <Card className="vercel-card p-6 group">
                        <CardHeader className="p-0 pb-3">
                            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                                <span className="flex items-center gap-2"><Bot size={14} className="text-foreground" /> Intel Roadmap</span>
                                <ArrowUpRight size={14} className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-3xl font-bold text-foreground tracking-tight">
                                {stats.roadmapStep}<span className="text-muted-foreground font-medium text-xl">/{stats.totalSteps}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-2 font-medium uppercase tracking-wider">Synchronized Milestones</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <Card className="vercel-card p-6 group">
                        <CardHeader className="p-0 pb-3">
                            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                                <span className="flex items-center gap-2"><Flame size={14} className="text-foreground" /> Active Protocol</span>
                                <ArrowUpRight size={14} className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-3xl font-bold text-foreground tracking-tight">
                                {stats.streak} <span className="text-muted-foreground font-medium text-xl">Days</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-2 font-medium uppercase tracking-wider">System Consistency</p>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                >
                    <Card className="vercel-card p-6 group">
                        <CardHeader className="p-0 pb-3">
                            <CardTitle className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                                <span className="flex items-center gap-2"><Zap size={14} className="text-foreground" /> Combat Power</span>
                                <ArrowUpRight size={14} className="text-muted-foreground opacity-50 group-hover:opacity-100 transition-opacity" />
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-0">
                            <div className="text-3xl font-bold text-foreground tracking-tight">
                                {stats.averageScore}<span className="text-muted-foreground font-medium text-xl">/10</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-2 font-medium uppercase tracking-wider">Market Delta Score</p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>

            {/* Main Leaderboard Section */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
            >
                <div className="bg-background rounded-xl shadow-[0_0_0_1px_rgba(0,0,0,0.08)] dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1)] p-1 overflow-hidden">
                    <NinjaLeaderboard />
                </div>
            </motion.div>

            {/* Action CTA */}
            {!loading && stats.roadmapStep === 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <Card className="p-12 flex flex-col items-center text-center gap-6 vercel-card relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-foreground/[0.02] rounded-full blur-3xl -mr-32 -mt-32" />
                        
                        <div className="bg-secondary p-4 rounded-xl relative z-10 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]">
                            <Bot className="text-foreground" size={32} />
                        </div>
                        <div className="space-y-2 relative z-10">
                            <h3 className="text-2xl font-bold text-foreground tracking-tight">Welcome to the Dojo, Rookie.</h3>
                            <p className="text-muted-foreground text-sm max-w-sm mx-auto leading-relaxed">
                                Your path to seniority begins with the first protocol. Initialize your roadmap to start competing.
                            </p>
                        </div>
                        <Button 
                            className="vercel-button h-11 px-8 relative z-10 text-xs"
                            onClick={() => navigate('/ai-ninja/onboard')}
                        >
                            Initialize Onboarding Protocol
                        </Button>
                    </Card>
                </motion.div>
            )}
        </div>
    );
};

export default Dashboard;
