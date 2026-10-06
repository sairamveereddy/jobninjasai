import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Trophy, Bot, Flame, Target, MessageSquare, Zap } from 'lucide-react';
import NinjaLeaderboard from './ai-ninja/NinjaLeaderboard';
import { API_URL } from '../config/api';

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        roadmapStep: 0,
        totalSteps: 0,
        streak: 0,
        averageScore: 0,
        sessionsCompleted: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNinjaStats = async () => {
            if (!user?.email) return;
            try {
                const response = await fetch(`${API_URL}/api/ai-ninja/stats?email=${encodeURIComponent(user.email)}`, {
                    headers: { 'token': localStorage.getItem('auth_token') }
                });
                if (response.ok) {
                    const data = await response.json();
                    setStats(data.stats || stats);
                }
            } catch (error) {
                console.error('Error fetching ninja stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNinjaStats();
    }, [user?.email]);

    return (
        <div className="flex flex-col gap-6 p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header Summary for the Ninja */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-[#1a3a5f] to-[#0f2744] text-white border-0 shadow-lg">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium opacity-80 flex items-center gap-2">
                            <Bot size={16} /> Roadmap Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{stats.roadmapStep}/{stats.totalSteps}</div>
                        <p className="text-xs mt-1 opacity-70">Completed milestones</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Flame size={16} className="text-orange-500" /> Current Streak
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#1a3a5f]">{stats.streak} Days</div>
                        <p className="text-xs mt-1 text-gray-400">Consistent practice</p>
                    </CardContent>
                </Card>

                <Card className="bg-white border-gray-200 shadow-sm">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Zap size={16} className="text-[#c5a059]" /> Interview Score
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-[#1a3a5f]">{stats.averageScore}/10</div>
                        <p className="text-xs mt-1 text-gray-400">Market readiness level</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Leaderboard Section */}
            <div className="mt-4">
                <NinjaLeaderboard />
            </div>

            {/* Action Call to Action */}
            {!loading && stats.roadmapStep === 0 && (
                <Card className="border-2 border-dashed border-[#c5a059] bg-[#fdfaf2]">
                    <CardContent className="py-8 flex flex-col items-center text-center gap-4">
                        <div className="bg-[#c5a059]/10 p-3 rounded-full">
                            <Bot className="text-[#c5a059]" size={32} />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#1a3a5f]">Welcome to the Dojo!</h3>
                            <p className="text-sm text-gray-600 max-w-md">Your roadmap is waiting. Start your first session to begin your journey to becoming a certified Ninja.</p>
                        </div>
                        <Button 
                            className="bg-[#1a3a5f] hover:bg-[#0f2744] text-white px-8"
                            onClick={() => navigate('/ai-ninja/onboard')}
                        >
                            Start Onboarding
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default Dashboard;
