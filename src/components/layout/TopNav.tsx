import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Settings as SettingsIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const TopNav: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-20 glass-panel border-x-0 border-t-0 rounded-none sticky top-0 z-40 bg-cyber-darker/80 backdrop-blur-md px-8 flex items-center justify-between">
      <div className="flex items-center gap-6 w-1/3">
        <div className="relative w-full group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-neon-cyan transition-colors" />
          <input
            type="text"
            placeholder="Search resources, alerts, IPs..."
            className="w-full bg-cyber-dark/50 border border-cyber-border rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <kbd className="px-1.5 py-0.5 rounded bg-cyber-dark border border-cyber-border text-xs text-gray-400">Ctrl</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-cyber-dark border border-cyber-border text-xs text-gray-400">K</kbd>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 font-mono text-neon-cyan/80 text-sm bg-cyber-card px-4 py-1.5 rounded-md border border-cyber-border">
          <span>SYS.TIME //</span>
          <span className="text-white">{time.toLocaleTimeString()}</span>
        </div>

        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-neon-cyan transition-colors"
            >
              <Bell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse-glow shadow-[0_0_10px_rgba(239,68,68,0.8)]"></span>
            </button>

            <AnimatePresence>
              {showNotifications && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-80 glass-panel rounded-lg shadow-2xl z-50 p-4 border border-cyber-border bg-cyber-darker"
                >
                  <h3 className="text-white font-semibold mb-3 border-b border-cyber-border pb-2">Notifications</h3>
                  <div className="space-y-3">
                    <div className="text-sm">
                      <p className="text-red-400 font-medium">Critical Alert</p>
                      <p className="text-gray-300">Unauthorized access attempt blocked on Azure VM.</p>
                      <p className="text-xs text-gray-500 mt-1">2 mins ago</p>
                    </div>
                    <div className="text-sm">
                      <p className="text-orange-400 font-medium">High Risk</p>
                      <p className="text-gray-300">S3 bucket made public.</p>
                      <p className="text-xs text-gray-500 mt-1">15 mins ago</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowNotifications(false)}
                    className="w-full mt-4 py-2 text-xs text-neon-cyan hover:bg-cyber-dark rounded transition-colors border border-transparent hover:border-neon-cyan/30"
                  >
                    Close
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <button 
            onClick={() => navigate('/settings')}
            className="p-2 text-gray-400 hover:text-neon-purple transition-colors group"
          >
            <SettingsIcon className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
          </button>
        </div>
      </div>
      
      {/* Scan line effect on header */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50"></div>
    </header>
  );
};
