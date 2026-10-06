import React, { createContext, useContext, useState } from 'react';

const AINinjaContext = createContext();

export const useAINinja = () => {
    const context = useContext(AINinjaContext);
    if (!context) {
        throw new Error('useAINinja must be used within an AINinjaProvider');
    }
    return context;
};

export const AINinjaProvider = ({ children }) => {
    // --- UI State (Shared across the app) ---
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [jobContext, setJobContext] = useState(null);
    const [initialMessage, setInitialMessage] = useState(null);

    // --- Actions ---
    const openChatWithJob = (job, message = null) => {
        setJobContext(job);
        if (message) setInitialMessage(message);
        setIsChatOpen(true);
    };

    const clearJobContext = () => {
        setJobContext(null);
        setInitialMessage(null);
    };

    const toggleChat = () => setIsChatOpen(prev => !prev);

    return (
        <AINinjaContext.Provider value={{
            // Chat UI State
            isChatOpen, 
            setIsChatOpen, 
            toggleChat,
            jobContext, 
            setJobContext, 
            initialMessage, 
            setInitialMessage,
            openChatWithJob, 
            clearJobContext,

            // Legacy backward compatibility (empty defaults to prevent crashes)
            onboardingData: { step: 1, extractedSkills: [], selectedSkills: [] },
            dashboardData: null,
            isLoadingDashboard: false,
            leaderboard: [],
            isLoadingLeaderboard: false,
            refreshDashboard: () => {},
            refreshLeaderboard: () => {},
        }}>
            {children}
        </AINinjaContext.Provider>
    );
};

