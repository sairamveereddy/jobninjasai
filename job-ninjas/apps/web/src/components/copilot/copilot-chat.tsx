'use client';

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Sparkles, Send, X, Bot, PlusCircle, ArrowRight, HelpCircle, Layers, CheckCircle2, ChevronDown, RefreshCw } from 'lucide-react';
import { useBoardStore } from '@/store/board';
import { LayerType } from '@/types/canvas';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  action?: {
    type: 'ADD_AGENT' | 'CREATE_PIPELINE' | 'CONNECT_NODES' | 'INSPECT_NODE' | 'NAVIGATE';
    payload: Record<string, any>;
    label: string;
  };
}

const DEFAULT_SUGGESTIONS = [
  '⚡ Add an Outreach Agent to this board',
  '🚀 Create a new pipeline for Senior AI Engineer',
  '❓ Why is my pipeline blocked?',
  '🏨 How does the Concierge agent work?',
];

export function CopilotChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: "👋 Hi! I'm **JobNinja Copilot**.\n\nI can help you build and manage recruiting pipelines, explain any step, diagnose blocked candidates, or dynamically add agents to your canvas.",
    },
  ]);

  const pathname = usePathname();
  const router = useRouter();
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Board store access
  const layerIds = useBoardStore((s) => s.layerIds);
  const layers = useBoardStore((s) => s.layers);
  const insertLayer = useBoardStore((s) => s.insertLayer);
  const setConnectionNotice = useBoardStore((s) => s.setConnectionNotice);

  // Keyboard shortcut Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to bottom on new message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const sendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Gather active canvas context
      const existingAgents = layerIds
        .map((id) => layers[id]?.agentRole)
        .filter(Boolean) as string[];

      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          context: {
            pathname,
            existingAgents,
          },
        }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: data.reply || "I've processed your request.",
          action: data.action || undefined,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: "I'm having a brief connection delay. You can continue adding nodes from the left toolbar or ask me another question.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeAction = async (action: Message['action']) => {
    if (!action) return;

    if (action.type === 'ADD_AGENT') {
      const { agentRole, name } = action.payload;
      
      // Calculate rightmost position
      let maxX = 400;
      let targetY = 150;
      layerIds.forEach((id) => {
        const l = layers[id];
        if (l && l.x > maxX) maxX = l.x;
      });

      const newId = insertLayer(
        LayerType.Agent,
        { x: maxX + 320, y: targetY },
        { r: 245, g: 247, b: 250 },
        undefined,
        agentRole
      );

      setConnectionNotice?.({
        tone: 'ok',
        message: `Added ${name || 'Agent'} to canvas!`,
      });

      setActionSuccess(`Added "${name || 'Agent'}" to canvas!`);
      setTimeout(() => setActionSuccess(null), 3000);
    } else if (action.type === 'CREATE_PIPELINE') {
      const { title, department } = action.payload;
      setActionSuccess(`Creating pipeline for ${title}...`);
      
      try {
        const res = await fetch('/api/roles', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: title || 'New Role',
            department: department || 'Engineering',
            location: 'Remote',
            hiringManager: 'Hiring Lead',
            jobDescription: `Job description for ${title}. Responsibilities include building scalable production systems and collaborating with product teams.`,
          }),
        });

        const data = await res.json();
        if (data.success && data.role?.id) {
          router.push(`/roles/${data.role.id}/board`);
          setIsOpen(false);
        }
      } catch (err) {
        console.error('Failed to create pipeline:', err);
      }
    }
  };

  // Do not render Copilot chatbot on landing page or marketing pages
  const isMarketingPage =
    !pathname ||
    pathname === '/' ||
    pathname.startsWith('/pricing') ||
    pathname.startsWith('/templates') ||
    pathname.startsWith('/solutions') ||
    pathname.startsWith('/product') ||
    pathname.startsWith('/resources') ||
    pathname.startsWith('/privacy') ||
    pathname.startsWith('/terms') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/use-cases');

  if (isMarketingPage) {
    return null;
  }

  return (
    <>
      {/* Floating Launcher Pill */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-slate-900/95 hover:bg-slate-900 text-white rounded-full shadow-xl shadow-slate-900/20 border border-slate-700/60 backdrop-blur-md transition-all duration-200 hover:scale-105 group active:scale-95"
        >
          <div className="relative flex items-center justify-center w-6 h-6 rounded-full bg-indigo-500/30 text-indigo-400">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-300" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-slate-900" />
          </div>
          <span className="text-xs font-semibold tracking-wide">JobNinja Copilot</span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700">⌘K</span>
        </button>
      )}

      {/* Expandable Chat Drawer */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-4rem)] flex flex-col bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-slate-100 bg-slate-50/70 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-slate-900">JobNinja Copilot</h3>
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 bg-emerald-100 text-emerald-700 rounded-full">AI Online</span>
                </div>
                <p className="text-[11px] text-slate-400 font-medium">Pipeline Architect & Assistant</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([messages[0]])}
                title="Clear conversation"
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Action Success Toast Banner */}
          {actionSuccess && (
            <div className="px-4 py-2 bg-emerald-50 border-b border-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          )}

          {/* Chat Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl whitespace-pre-wrap leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-slate-900 text-white font-medium rounded-br-xs'
                      : 'bg-slate-100/80 text-slate-800 border border-slate-200/50 rounded-bl-xs'
                  }`}
                >
                  {m.content}

                  {/* Interactive Action Button inside Assistant Bubble */}
                  {m.action && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60">
                      <button
                        onClick={() => executeAction(m.action)}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                      >
                        {m.action.type === 'ADD_AGENT' && <PlusCircle className="w-3.5 h-3.5" />}
                        {m.action.type === 'CREATE_PIPELINE' && <ArrowRight className="w-3.5 h-3.5" />}
                        {m.action.label}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-slate-400 text-xs py-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]" />
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[11px] font-medium text-slate-400">Analyzing pipeline...</span>
              </div>
            )}
          </div>

          {/* Quick Suggestions Chips */}
          <div className="px-3 py-2 border-t border-slate-100 bg-slate-50/50 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {DEFAULT_SUGGESTIONS.map((s, idx) => (
              <button
                key={idx}
                onClick={() => sendMessage(s)}
                className="shrink-0 px-2.5 py-1 text-[11px] font-semibold bg-white text-slate-700 hover:text-indigo-600 hover:border-indigo-200 border border-slate-200/80 rounded-full shadow-2xs transition-colors"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage();
            }}
            className="p-3 border-t border-slate-100 bg-white flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Copilot to build pipelines or add agents..."
              className="flex-1 px-3.5 py-2 text-xs font-medium text-slate-900 bg-slate-100/70 border border-slate-200/70 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-2.5 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-xl shadow-xs transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
