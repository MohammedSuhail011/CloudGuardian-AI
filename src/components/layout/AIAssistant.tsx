import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, X, Send, Terminal, Loader2 } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: "Hey! I'm CloudGuardian AI — your cloud security assistant. I can help with scanning your AWS, Azure, or GCP environments, analyzing threats, or just chatting. What can I do for you?" }
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
      const response = await fetch('http://localhost:3001/api/chat', {
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
    } catch (err) {
      if (controller.signal.aborted) return;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Error connecting to CloudGuardian Backend. Please ensure the backend server is running.' 
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
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple p-[2px] z-50 shadow-[0_0_20px_rgba(6,182,212,0.5)] ${isOpen ? 'hidden' : 'block'}`}
      >
        <div className="w-full h-full bg-cyber-darker rounded-full flex items-center justify-center relative overflow-hidden group">
          <Bot className="w-7 h-7 text-white group-hover:text-neon-cyan transition-colors relative z-10" />
          <div className="absolute inset-0 bg-neon-cyan/20 animate-ping rounded-full"></div>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] glass-panel bg-cyber-darker/95 z-50 flex flex-col overflow-hidden shadow-2xl border border-neon-cyan/30 rounded-2xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-cyber-border bg-gradient-to-r from-cyber-darker to-cyber-dark flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Bot className="w-6 h-6 text-neon-cyan" />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-neon-green rounded-full animate-pulse"></span>
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">CloudGuardian AI</h3>
                  <p className="text-neon-cyan text-xs font-mono">Status: Online</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-cyber">
              {messages.slice(-50).map((msg, idx) => (
                <div key={`${msg.role}-${idx}`} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
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
                </div>
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
                  className="w-full bg-cyber-darker border border-cyber-border rounded-lg pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all placeholder:text-gray-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 p-2 text-neon-cyan hover:text-white disabled:opacity-50 disabled:hover:text-neon-cyan transition-colors"
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
