import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { ParticlesBackground } from './ParticlesBackground';
import { BackgroundEffects } from './BackgroundEffects';
import { CursorGlow } from './CursorGlow';
import { AIAssistant } from './AIAssistant';

export const AppLayout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="flex h-screen bg-background overflow-hidden selection:bg-neon-cyan/30">
      <ParticlesBackground />
      <BackgroundEffects />
      <CursorGlow />
      <Sidebar />
      <div className="flex-1 flex flex-col ml-[80px] md:ml-[260px] transition-all duration-300 relative z-10">
        <TopNav />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-6 scrollbar-cyber">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <AIAssistant />
    </div>
  );
};
