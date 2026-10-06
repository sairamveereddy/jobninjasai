import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  ShieldCheck, 
  Briefcase, 
  MapPin, 
  Star, 
  ArrowRight,
  User,
  MessageSquare,
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

const RecruiterDashboard = () => {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [minVerified, setMinVerified] = useState(0);

  useEffect(() => {
    fetchCandidates();
  }, []);

  const fetchCandidates = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/recruiter/search?query=${searchQuery}&min_verified=${minVerified}`);
      const data = await response.json();
      if (data.success) {
        setCandidates(data.candidates);
      }
    } catch (error) {
      console.error("Error fetching candidates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchCandidates();
  };

  return (
    <div className="min-h-screen bg-[#faf9ff] text-[#2d2d3f]">
      {/* ── Top Navigation ── */}
      <nav className="h-20 bg-white/50 backdrop-blur-md border-b border-white sticky top-0 z-50 px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[var(--jobninjas-accent)] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-[var(--jobninjas-accent)]/20">N</div>
          <span className="font-semibold tracking-tight text-xl">Recruiter<span className="text-[var(--jobninjas-accent)]">Portal</span></span>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <p className="text-xs font-medium text-[#5c5c7a]">PREMIUM ACCESS</p>
            <p className="text-sm font-semibold">Global Talent Stream</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-100 to-blue-50 border border-white shadow-sm flex items-center justify-center">
             <User size={18} className="text-[#5c5c7a]" />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-12 space-y-12">
        {/* ── Header ── */}
        <div className="space-y-4">
          <h1 className="text-4xl font-medium tracking-tight">Discover <span className="text-[var(--jobninjas-accent)] italic">Verified</span> Ninjas</h1>
          <p className="text-[#5c5c7a] font-light max-w-2xl">
            Access the world's first AI-verified talent pool. Every skill badge here was earned through a live technical interview with our AI Sensei.
          </p>
        </div>

        {/* ── Search Bar ── */}
        <div className="grid lg:grid-cols-12 gap-6 items-center">
          <form onSubmit={handleSearch} className="lg:col-span-8 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-[#5c5c7a]/40" size={20} />
            <Input 
              placeholder="Search by role, skill, or experience..." 
              className="h-16 pl-14 rounded-3xl border-white bg-white/70 backdrop-blur-sm shadow-xl shadow-purple-500/5 focus:ring-[var(--jobninjas-accent)] text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 h-10 px-6 rounded-2xl bg-[var(--jobninjas-accent)] hover:bg-[var(--jobninjas-accent)]/90 text-white transition-all shadow-lg shadow-[var(--jobninjas-accent)]/20">
              Search
            </Button>
          </form>
          
          <div className="lg:col-span-4 flex items-center gap-4">
            <div className="flex-1 bg-white/70 backdrop-blur-sm p-3 rounded-2xl border border-white shadow-md flex items-center justify-between px-5">
               <span className="text-xs font-semibold text-[#5c5c7a] uppercase tracking-wider">Min. Verified Skills</span>
               <div className="flex gap-1">
                 {[1, 2, 3, 5].map(num => (
                   <button 
                    key={num}
                    onClick={() => setMinVerified(num)}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${minVerified === num ? 'bg-[var(--jobninjas-accent)] text-white' : 'bg-gray-100 hover:bg-gray-200 text-[#5c5c7a]'}`}
                   >
                     {num}+
                   </button>
                 ))}
               </div>
            </div>
            <Button variant="outline" className="h-14 w-14 rounded-2xl bg-white border-white shadow-md text-[#5c5c7a]">
              <Filter size={20} />
            </Button>
          </div>
        </div>

        {/* ── Results ── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">{candidates.length} Elite Candidates Found</h2>
            <div className="flex items-center gap-2 text-sm text-[#5c5c7a]">
              <TrendingUp size={16} className="text-emerald-500" />
              <span>32 new profiles this week</span>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="popLayout">
              {loading ? (
                [...Array(6)].map((_, i) => (
                  <Card key={i} className="h-96 rounded-[40px] bg-white/40 border-white animate-pulse" />
                ))
              ) : (
                candidates.map((candidate, idx) => (
                  <motion.div
                    key={candidate.public_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                  >
                    <Card className="group relative h-full rounded-[40px] bg-white/70 backdrop-blur-xl border border-white p-8 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-500 overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[var(--jobninjas-accent)]/5 to-transparent rounded-bl-[100px] pointer-events-none" />
                      
                      <div className="space-y-6">
                        <div className="flex items-start justify-between">
                          <div className="relative w-20 h-20">
                            <div className="w-full h-full rounded-2xl bg-gradient-to-tr from-[var(--jobninjas-accent)] to-purple-600 p-[1px]">
                              <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center overflow-hidden">
                                {candidate.profile_photo_url ? (
                                  <img src={candidate.profile_photo_url} alt={candidate.name} className="w-full h-full object-cover" />
                                ) : (
                                  <User size={32} className="text-[#5c5c7a]/10" />
                                )}
                              </div>
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-emerald-500 border-2 border-white rounded-lg flex items-center justify-center text-white">
                              <ShieldCheck size={14} />
                            </div>
                          </div>
                          
                          <div className="text-right">
                             <div className="flex items-center gap-1 text-xs font-bold text-amber-500 justify-end">
                               <Star size={12} fill="currentColor" />
                               <span>TOP 1%</span>
                             </div>
                             <p className="text-[10px] text-[#5c5c7a] font-medium uppercase tracking-widest pt-1">
                               {candidate.verified_count} VERIFIED SKILLS
                             </p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-2xl font-medium tracking-tight group-hover:text-[var(--jobninjas-accent)] transition-colors">{candidate.name}</h3>
                          <p className="text-sm font-light text-[#5c5c7a] flex items-center gap-2">
                            <Briefcase size={14} /> {candidate.current_role}
                          </p>
                          {candidate.location && (
                            <p className="text-xs text-[#5c5c7a]/60 flex items-center gap-2">
                              <MapPin size={14} /> {candidate.location}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                           {(candidate.skills || []).slice(0, 3).map(skill => (
                             <Badge key={skill} variant="secondary" className="bg-[#f0edff] text-[var(--jobninjas-accent)] border-none text-[10px] uppercase font-bold py-1">
                               {skill}
                             </Badge>
                           ))}
                           {candidate.verified_count > 0 && (
                             <Badge className="bg-emerald-50 text-emerald-600 border-none text-[10px] font-bold">
                               +{candidate.verified_count} VERIFIED
                             </Badge>
                           )}
                        </div>

                        <div className="pt-4 flex items-center justify-between">
                          <a 
                            href={candidate.custom_username ? `/u/${candidate.custom_username}` : `/p/${candidate.public_id}`} 
                            target="_blank"
                            className="flex items-center gap-2 text-sm font-semibold text-[var(--jobninjas-accent)] group/link"
                          >
                            Talk to AI Agent
                            <MessageSquare size={16} className="group-hover/link:translate-x-1 transition-transform" />
                          </a>
                          <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-[#5c5c7a]/20 group-hover:bg-[var(--jobninjas-accent)] group-hover:text-white transition-all">
                            <ChevronRight size={16} />
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          
          {!loading && candidates.length === 0 && (
            <div className="h-64 flex flex-col items-center justify-center text-center space-y-4 bg-white/40 rounded-[40px] border border-dashed border-gray-200">
               <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                 <Search size={32} />
               </div>
               <div>
                 <p className="text-lg font-medium">No candidates match your filters</p>
                 <p className="text-sm text-[#5c5c7a]">Try broadening your search or reducing minimum verified skills.</p>
               </div>
            </div>
          )}
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="py-20 text-center border-t border-gray-100 bg-white/30 backdrop-blur-xl">
         <p className="text-xs text-[#5c5c7a] font-medium tracking-widest uppercase">Verified Candidate Stream • Powered by JobNinjas AI</p>
      </footer>
    </div>
  );
};

export default RecruiterDashboard;
