import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Terminal, Loader2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const DangerBot: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    {/* Hoodie outer */}
    <path d="M8 20 Q8 6, 24 4 Q40 6, 40 20 L42 32 Q42 42, 34 44 L14 44 Q6 42, 6 32 Z" stroke="currentColor" strokeWidth="1.6" fill="none" />
    {/* Hoodie inner shadow */}
    <path d="M12 22 Q12 10, 24 8 Q36 10, 36 22 L36 28 Q36 30, 34 30 L14 30 Q12 30, 12 28 Z" stroke="currentColor" strokeWidth="0.8" fill="none" opacity="0.2" />
    {/* Messy hair peeking from hood */}
    <path d="M16 18 L14 14 L18 16 L17 11 L21 15 L22 10 L24 14 L26 10 L27 15 L30 11 L29 16 L32 14 L30 18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Face shape - thin angular */}
    <path d="M16 20 L16 30 L18 35 L24 38 L30 35 L32 30 L32 20" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Left eye - tired intense */}
    <path d="M18 24 L21 23 L23 24 L21 26 Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" fill="none" />
    <circle cx="21" cy="24.5" r="0.9" fill="currentColor" />
    {/* Right eye - tired intense */}
    <path d="M25 24 L27 23 L30 24 L27 26 Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" fill="none" />
    <circle cx="27" cy="24.5" r="0.9" fill="currentColor" />
    {/* Dark circles under eyes */}
    <path d="M19 26 Q21 28, 23 26" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.4" />
    <path d="M25 26 Q27 28, 29 26" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.4" />
    {/* Nose */}
    <path d="M24 26 L23 30 L24 30.5 L25 30" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    {/* Mouth - slight frown */}
    <path d="M21 33 Q24 34, 27 33" stroke="currentColor" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    {/* Stubble dots */}
    <circle cx="20" cy="35" r="0.3" fill="currentColor" opacity="0.3" />
    <circle cx="22" cy="36" r="0.3" fill="currentColor" opacity="0.3" />
    <circle cx="24" cy="36.5" r="0.3" fill="currentColor" opacity="0.3" />
    <circle cx="26" cy="36" r="0.3" fill="currentColor" opacity="0.3" />
    <circle cx="28" cy="35" r="0.3" fill="currentColor" opacity="0.3" />
    <circle cx="19" cy="33" r="0.3" fill="currentColor" opacity="0.2" />
    <circle cx="29" cy="33" r="0.3" fill="currentColor" opacity="0.2" />
    {/* FSociety mask hint on hoodie */}
    <circle cx="24" cy="40" r="2" stroke="currentColor" strokeWidth="0.6" fill="none" opacity="0.3" />
    <path d="M22.5 39.5 Q24 41, 25.5 39.5" stroke="currentColor" strokeWidth="0.5" fill="none" opacity="0.3" />
  </svg>
);

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey! I'm CLOUDCORE X — your cloud security assistant. I can help with scanning your AWS, Azure, or GCP environments, analyzing threats, or just chatting. What can I do for you?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => { abortRef.current?.abort(); };
  }, []);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch(`${API_BASE}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMessage }),
        signal: controller.signal,
      });
      
      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: data.response || 'System Error: Neural link severed.' 
      }]);
    } catch {
      if (controller.signal.aborted) return;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error connecting to CLOUDCORE X Backend. Please ensure the backend server is running.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.15 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 group ${isOpen ? 'hidden' : 'block'}`}
      >
        {/* Outer rotating ring */}
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-blue animate-spin-slow opacity-70 blur-[1px]" style={{ animationDuration: '3s' }} />

        {/* Secondary counter-rotating ring */}
        <div className="absolute -inset-0.5 rounded-full bg-gradient-to-l from-neon-pink via-neon-cyan to-neon-purple animate-spin-reverse opacity-50" />

        {/* Glow pulse */}
        <div className="absolute -inset-2 rounded-full bg-neon-cyan/20 animate-pulse-glow" />

        {/* Orbital dots */}
        <div className="absolute -inset-3 animate-spin-slow" style={{ animationDuration: '3s' }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-neon-cyan rounded-full shadow-[0_0_8px_rgba(6,182,212,1)]" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 bg-neon-purple rounded-full shadow-[0_0_8px_rgba(139,92,246,1)]" />
        </div>
        <div className="absolute -inset-4 animate-spin-reverse">
          <div className="absolute top-1/2 left-0 -translate-y-1/2 w-1 h-1 bg-neon-blue rounded-full shadow-[0_0_6px_rgba(59,130,246,1)]" />
          <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1.5 h-1.5 bg-neon-pink rounded-full shadow-[0_0_8px_rgba(236,72,153,1)]" />
        </div>

        {/* Button body */}
        <div className="relative w-14 h-14 rounded-full bg-cyber-darker border border-neon-cyan/40 flex items-center justify-center overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.4),inset_0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6),inset_0_0_20px_rgba(6,182,212,0.15)] transition-shadow duration-300">
          {/* Inner energy field */}
          <div className="absolute inset-1 rounded-full border border-neon-cyan/20 animate-pulse-energy" />
          <div className="absolute inset-2 rounded-full border border-neon-purple/10 animate-pulse-energy-delay" />

          {/* Scan line */}
          <div className="absolute inset-0 overflow-hidden rounded-full">
            <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent ai-scan-line" />
          </div>

          {/* Core icon */}
          <DangerBot className="w-8 h-8 text-white group-hover:text-neon-cyan transition-colors relative z-10 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />

          {/* Inner glow core */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-t from-neon-cyan/10 to-transparent" />
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: 'blur(4px)' }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-cyber-card backdrop-blur-md border border-cyber-border rounded-xl bg-cyber-darker/95 z-50 flex flex-col overflow-hidden shadow-2xl border-neon-cyan/30 rounded-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-cyber-border bg-gradient-to-r from-cyber-darker to-cyber-dark flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <DangerBot className="w-7 h-7 text-neon-cyan" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">CLOUDCORE X</h3>
                  <p className="text-neon-cyan text-xs font-mono">Status: Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white hover:scale-110 active:scale-95 transition-all duration-200 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-cyber">
              {messages.slice(-50).map((msg, idx) => (
                <motion.div
                  key={`${msg.role}-${idx}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    msg.role === 'user' 
                      ? 'bg-neon-cyan/20 text-white border border-neon-cyan/30 rounded-br-none'
                      : 'bg-cyber-dark text-gray-200 border border-cyber-border rounded-bl-none'
                  }`}>
                    {msg.role === 'assistant' && (
                      <Terminal className="w-3 h-3 text-neon-purple mb-1 opacity-70" />
                    )}
                    <span className="whitespace-pre-wrap">{msg.content}</span>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-cyber-dark p-3 rounded-lg border border-cyber-border rounded-bl-none flex items-center gap-2 text-neon-cyan text-xs font-mono">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    PROCESSING...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSend} className="p-4 border-t border-cyber-border bg-cyber-dark/50">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about cloud security, or just say hi..."
                  className="w-full bg-cyber-darker border border-cyber-border rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan focus:shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-all duration-200 placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 text-neon-cyan hover:text-white hover:scale-110 active:scale-90 disabled:opacity-50 disabled:hover:text-neon-cyan disabled:hover:scale-100 transition-all duration-200"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
