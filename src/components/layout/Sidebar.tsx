import React, { useState, useEffect, useRef, useCallback } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Cloud, ShieldAlert, FileText, Settings, Server, Box, Shield, ChevronLeft, ChevronRight, Sparkles, Cpu, Bug } from 'lucide-react';

const navItems = [
  { path: '/', name: 'Dashboard', icon: LayoutDashboard },
  { path: '/aws', name: 'AWS', icon: Cloud },
  { path: '/azure', name: 'Azure', icon: Server },
  { path: '/gcp', name: 'GCP', icon: Box },
  { path: '/analysis', name: 'AI Analysis', icon: ShieldAlert },
  { path: '/threat-tester', name: 'Threat Dataset Tester', icon: Bug },
  { path: '/reports', name: 'Reports', icon: FileText },
  { path: '/settings', name: 'Settings', icon: Settings },
];

export const Sidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [avatar, setAvatar] = useState('https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.webp');
  const [profileExpanding, setProfileExpanding] = useState(false);
  const [expandOrigin, setExpandOrigin] = useState({ x: 0, y: 0 });
  const profileRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const activeIndex = navItems.findIndex(item => {
    if (item.path === '/') return location.pathname === '/';
    return location.pathname.startsWith(item.path);
  });
  const activeItemRef = useRef<HTMLAnchorElement>(null);
  const [sliderStyle, setSliderStyle] = useState({ top: 0, height: 0 });
  const navRef = useRef<HTMLDivElement>(null);

  const updateSlider = useCallback(() => {
    if (activeIndex >= 0 && navRef.current) {
      const activeEl = navRef.current.querySelector(`[data-nav-index="${activeIndex}"]`) as HTMLElement | null;
      if (activeEl) {
        const navRect = navRef.current.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();
        setSliderStyle({
          top: elRect.top - navRect.top + elRect.height / 2 - 14,
          height: 28,
        });
      }
    }
  }, [activeIndex]);

  useEffect(() => {
    const handleAvatarChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setAvatar(customEvent.detail);
    };
    window.addEventListener('avatarChange', handleAvatarChange);
    return () => window.removeEventListener('avatarChange', handleAvatarChange);
  }, []);

  useEffect(() => {
    const timer = setTimeout(updateSlider, 100);
    return () => clearTimeout(timer);
  }, [updateSlider, location.pathname]);

  const handleProfileClick = () => {
    if (profileRef.current) {
      const rect = profileRef.current.getBoundingClientRect();
      setExpandOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
    }
    setProfileExpanding(true);
    setTimeout(() => {
      setProfileExpanding(false);
      navigate('/settings');
    }, 800);
  };

  return (
    <motion.aside
      initial={{ width: 260 }}
      animate={{ width: isExpanded ? 260 : 80 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="h-screen glass-panel rounded-none border-y-0 border-l-0 flex flex-col fixed left-0 top-0 z-50 bg-cyber-darker/90 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between p-6 border-b border-cyber-border relative overflow-hidden">
        {/* Animated scan line across header */}
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-50 animate-glow-line" />
        <div className="absolute -inset-20 bg-gradient-to-r from-neon-cyan/5 via-transparent to-neon-purple/5 animate-spin-slow pointer-events-none" style={{ animationDuration: '8s' }} />
        
        {isExpanded ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 relative z-10">
            <div className="relative w-10 h-10 flex items-center justify-center">
              {/* Outer rotating ring */}
              <svg className="absolute inset-0 w-10 h-10 animate-spin-slow" style={{ animationDuration: '4s' }} viewBox="0 0 40 40">
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <circle cx="20" cy="20" r="17" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" strokeDasharray="30 20" opacity="0.8" />
              </svg>
              {/* Inner pulsing dot */}
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple animate-pulse-glow shadow-[0_0_12px_rgba(6,182,212,0.6)]" />
              {/* Center shield icon */}
              <Shield className="absolute w-4 h-4 text-white drop-shadow-[0_0_4px_rgba(6,182,212,0.8)]" />
            </div>
            <div className="relative group">
              {/* Glitch layers (visible on hover) */}
              <span className="absolute inset-0 font-bold text-xl text-neon-cyan opacity-0 group-hover:opacity-70 group-hover:translate-x-[2px] group-hover:-translate-y-[1px] transition-all duration-100 pointer-events-none select-none [clip-path:inset(20%_0_40%_0)]" aria-hidden>
                CloudGuardian AI
              </span>
              <span className="absolute inset-0 font-bold text-xl text-neon-purple opacity-0 group-hover:opacity-70 group-hover:-translate-x-[2px] group-hover:translate-y-[1px] transition-all duration-100 pointer-events-none select-none [clip-path:inset(60%_0_0%_0)]" aria-hidden>
                CloudGuardian AI
              </span>
              {/* Main text */}
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-white to-neon-purple relative inline-block">
                CloudGuardian AI
                {/* Scan line sweeping across text */}
                <span className="absolute inset-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(black,black)] [background:linear-gradient(90deg,transparent,rgba(6,182,212,0.4),transparent)] [background-size:40%_100%] animate-[shimmer_3s_ease-in-out_infinite]" />
              </span>
              {/* Underline with traveling glow */}
              <div className="relative h-[2px] mt-1 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan bg-[length:200%_100%] animate-[glow-line_3s_linear_infinite] opacity-60" />
                <div className="absolute top-0 left-0 h-full w-8 bg-gradient-to-r from-transparent via-white/80 to-transparent animate-[travel_2s_ease-in-out_infinite]" />
              </div>
              {/* Floating particles around text */}
              <span className="absolute -top-1 -right-1 w-1 h-1 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_6px_rgba(6,182,212,0.8)]" />
              <span className="absolute -bottom-1 left-4 w-0.5 h-0.5 rounded-full bg-neon-purple animate-pulse shadow-[0_0_6px_rgba(139,92,246,0.8)]" style={{ animationDelay: '0.5s' }} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="relative w-10 h-10 flex items-center justify-center mx-auto"
            whileHover={{ scale: 1.15 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <svg className="absolute inset-0 w-10 h-10 animate-spin-slow" style={{ animationDuration: '3s' }} viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="17" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="25 25" opacity="0.6" />
            </svg>
            <Shield className="w-5 h-5 text-neon-cyan drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
          </motion.div>
        )}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="absolute -right-3 top-8 bg-cyber-dark border border-neon-cyan rounded-full p-1 text-neon-cyan hover:bg-neon-cyan hover:text-cyber-dark transition-all duration-200 hover:scale-110 active:scale-95"
        >
          {isExpanded ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      <nav ref={navRef} className="flex-1 py-8 px-4 flex flex-col gap-2 overflow-y-auto scrollbar-cyber relative">
        {isExpanded && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute left-4 w-[3px] bg-neon-cyan rounded-full shadow-[0_0_8px_rgba(6,182,212,0.6)]"
            style={{ top: sliderStyle.top, height: sliderStyle.height }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          />
        )}
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              data-nav-index={idx}
              to={item.path}
              ref={activeIndex === idx ? activeItemRef : undefined}
              onClick={() => { setTimeout(updateSlider, 50); }}
              className={({ isActive }) =>
                `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ease-out group relative ${
                  isActive
                    ? isExpanded
                      ? 'text-white bg-gradient-to-r from-neon-cyan/15 to-transparent shadow-[inset_0_0_20px_rgba(6,182,212,0.08)]'
                      : 'text-white bg-neon-cyan/20'
                    : 'text-gray-400 hover:text-white hover:bg-cyber-card hover:translate-x-1'
                }`
              }
            >
              <Icon className="w-5 h-5 flex-shrink-0 group-hover:text-neon-cyan transition-colors" />
              {isExpanded && (
                <span className="font-medium whitespace-nowrap">{item.name}</span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-cyber-border relative">
        <button
          ref={profileRef}
          onClick={handleProfileClick}
          className={`w-full glass-panel p-4 rounded-lg flex items-center gap-3 hover:border-neon-cyan/50 hover:translate-y-[-1px] transition-all duration-200 ${isExpanded ? '' : 'justify-center'} group cursor-pointer relative overflow-hidden active:scale-[0.98]`}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/0 via-neon-cyan/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple p-[2px] shrink-0 relative z-10">
            <img src={avatar} alt="User" className="w-full h-full rounded-full border border-cyber-dark object-cover bg-cyber-dark" />
          </div>
          {isExpanded && (
            <div className="overflow-hidden text-left flex-1 relative z-10">
              <p className="text-sm font-semibold truncate text-white group-hover:text-neon-cyan transition-colors">Commander Jarvis</p>
              <p className="text-xs text-neon-purple truncate">SysAdmin</p>
            </div>
          )}
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, x: -5 }}
              whileHover={{ opacity: 1, x: 0 }}
              className="relative z-10"
            >
              <Settings className="w-4 h-4 text-gray-500 group-hover:text-neon-cyan transition-colors" />
            </motion.div>
          )}
        </button>
      </div>

      {/* Profile Expansion Portal */}
      <AnimatePresence>
        {profileExpanding && (
          <motion.div
            key="profile-portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[200] flex items-center justify-center"
            style={{ backgroundColor: '#020617' }}
          >
            {/* Scan line overlay */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <motion.div
                initial={{ y: '-100%' }}
                animate={{ y: '200%' }}
                transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
                className="w-full h-[2px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent opacity-60"
              />
            </div>

            {/* Grid background */}
            <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{
              backgroundImage: `linear-gradient(rgba(6,182,212,1) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,1) 1px, transparent 1px)`,
              backgroundSize: '60px 60px',
            }} />

            {/* Expanding burst rings from click position */}
            <motion.div
              initial={{ scale: 0, x: expandOrigin.x - window.innerWidth / 2, y: expandOrigin.y - window.innerHeight / 2, opacity: 0.6 }}
              animate={{ scale: 4, x: 0, y: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="absolute w-20 h-20 rounded-full border-2 border-neon-cyan/40"
            />
            <motion.div
              initial={{ scale: 0, x: expandOrigin.x - window.innerWidth / 2, y: expandOrigin.y - window.innerHeight / 2, opacity: 0.4 }}
              animate={{ scale: 3, x: 0, y: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.08 }}
              className="absolute w-32 h-32 rounded-full border border-neon-purple/30"
            />
            <motion.div
              initial={{ scale: 0, x: expandOrigin.x - window.innerWidth / 2, y: expandOrigin.y - window.innerHeight / 2, opacity: 0.3 }}
              animate={{ scale: 2.5, x: 0, y: 0, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut', delay: 0.15 }}
              className="absolute w-44 h-44 rounded-full border border-neon-cyan/20"
            />

            {/* Floating profile card */}
            <motion.div
              initial={{ scale: 0.3, opacity: 0, y: 60 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="relative z-10 text-center"
            >
              {/* Avatar with glow */}
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 12, delay: 0.15 }}
                className="relative mx-auto mb-6 w-28 h-28"
              >
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-neon-cyan via-neon-purple to-neon-cyan animate-spin-slow p-[3px]" style={{ animationDuration: '3s' }}>
                  <div className="w-full h-full rounded-full bg-cyber-darker" />
                </div>
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-neon-cyan/20 to-neon-purple/20 animate-pulse-glow" style={{ animationDuration: '2s' }} />
                <img src={avatar} alt="User" className="absolute inset-[4px] rounded-full object-cover bg-cyber-dark border-2 border-cyber-dark" />
                <motion.div
                  animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-16 h-3 rounded-full bg-neon-cyan/30 blur-md"
                />
              </motion.div>

              {/* Name & title */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <motion.h2
                  className="text-3xl font-bold text-white mb-2"
                  animate={{ textShadow: ['0 0 4px rgba(6,182,212,0.5)', '0 0 20px rgba(6,182,212,0.8)', '0 0 4px rgba(6,182,212,0.5)'] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  Commander Jarvis
                </motion.h2>
                <motion.p className="text-lg text-neon-cyan font-mono mb-3">
                  SYSTEM ADMINISTRATOR
                </motion.p>
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500 font-mono">
                  <Sparkles className="w-3 h-3 text-neon-cyan" />
                  <span>ACCESS LEVEL 5 · CLEARANCE OMEGA</span>
                  <Cpu className="w-3 h-3 text-neon-purple" />
                </div>
              </motion.div>

              {/* Progress bar */}
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '60%' }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="h-px bg-gradient-to-r from-transparent via-neon-cyan to-transparent mx-auto mt-6"
              />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="text-[10px] text-gray-600 font-mono mt-2"
              >
                [ DECRYPTING IDENTITY PROFILE ... ]
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};
