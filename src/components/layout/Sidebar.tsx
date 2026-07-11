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
  const [avatar, setAvatar] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('cyberweb-settings') || '{}').avatar;
      if (saved) return saved;
    } catch {}
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes g1{0%,100%{clip-path:inset(0 0 0 0);transform:translate(0)}5%{clip-path:inset(20% 0 50% 0);transform:translate(3px,-1px)}10%{clip-path:inset(0 0 0 0);transform:translate(0)}45%{clip-path:inset(0 0 0 0);transform:translate(0)}46%{clip-path:inset(60% 0 10% 0);transform:translate(-2px,1px)}47%{clip-path:inset(0 0 0 0);transform:translate(0)}}@keyframes eyePulse{0%,100%{opacity:.6;filter:drop-shadow(0 0 4px #ef4444)}50%{opacity:1;filter:drop-shadow(0 0 12px #ef4444) drop-shadow(0 0 24px #ef4444)}}</style></defs><circle cx="60" cy="60" r="60" fill="#0a0514"/><g style="animation:g1 4s steps(1) infinite" fill="none" stroke="#06b6d4" stroke-width="1.5"><ellipse cx="60" cy="55" rx="28" ry="32" opacity=".8"/><ellipse cx="48" cy="48" rx="8" ry="10"/><ellipse cx="72" cy="48" rx="8" ry="10"/><path d="M48 68 L53 73 L60 68 L67 73 L72 68" stroke-width="1.2"/></g><g style="animation:eyePulse 2s ease-in-out infinite"><circle cx="48" cy="48" r="3" fill="#ef4444"/><circle cx="72" cy="48" r="3" fill="#ef4444"/></g></svg>`)}`;
  });
  const [displayName, setDisplayName] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cyberweb-settings') || '{}').displayName || 'Commander Jarvis'; } catch { return 'Commander Jarvis'; }
  });
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
    const handleNameChange = (e: Event) => {
      const customEvent = e as CustomEvent<string>;
      setDisplayName(customEvent.detail);
    };
    window.addEventListener('avatarChange', handleAvatarChange);
    window.addEventListener('displayNameChange', handleNameChange);
    return () => {
      window.removeEventListener('avatarChange', handleAvatarChange);
      window.removeEventListener('displayNameChange', handleNameChange);
    };
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
        {/* Intense animated background wash */}
        <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan/8 via-neon-purple/5 to-neon-cyan/8 animate-[borderTravel_4s_linear_infinite] bg-[length:200%_100%]" />
        <div className="absolute inset-0 bg-gradient-to-b from-neon-cyan/5 via-transparent to-neon-purple/5 animate-[hexPulse_3s_ease-in-out_infinite]" />

        {/* Energy border glow */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-neon-cyan to-transparent animate-[energyPulse_2s_ease-in-out_infinite]" />
        <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-neon-purple to-transparent animate-[energyPulse_2s_ease-in-out_infinite] [animation-delay:0.5s]" />
        <div className="absolute inset-y-0 left-0 w-[1px] bg-gradient-to-b from-transparent via-neon-cyan/40 to-transparent" />

        {/* Laser sweep across header */}
        <div className="absolute top-0 left-[-30%] w-[15%] h-full bg-gradient-to-r from-transparent via-neon-cyan/30 to-transparent skew-x-[-20deg] animate-[laserSweep_4s_ease-in-out_infinite] pointer-events-none" />
        <div className="absolute top-0 left-[-30%] w-[10%] h-full bg-gradient-to-r from-transparent via-neon-purple/20 to-transparent skew-x-[-20deg] animate-[laserSweep_4s_ease-in-out_infinite] [animation-delay:2s] pointer-events-none" />

        {isExpanded ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-3 relative z-10">
            {/* Logo icon with crazy effects */}
            <div className="relative w-12 h-12 flex items-center justify-center" style={{ animation: 'coreGlow 2s ease-in-out infinite' }}>
              {/* Outermost orbit ring */}
              <svg className="absolute -inset-2 w-16 h-16" style={{ animation: 'orbitRing 6s linear infinite' }} viewBox="0 0 64 64">
                <defs>
                  <linearGradient id="outerRing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.6" />
                    <stop offset="50%" stopColor="#8b5cf6" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.6" />
                  </linearGradient>
                </defs>
                <circle cx="32" cy="32" r="28" fill="none" stroke="url(#outerRing)" strokeWidth="0.8" strokeDasharray="8 16 4 12" />
              </svg>
              {/* Middle orbit ring (reverse) */}
              <svg className="absolute -inset-1 w-14 h-14" style={{ animation: 'orbitRingReverse 4s linear infinite' }} viewBox="0 0 56 56">
                <circle cx="28" cy="28" r="24" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="12 8 6 14" opacity="0.5" />
              </svg>
              {/* Inner rotating ring */}
              <svg className="absolute inset-0 w-12 h-12" style={{ animation: 'orbitRing 3s linear infinite' }} viewBox="0 0 48 48">
                <defs>
                  <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#06b6d4" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
                <circle cx="24" cy="24" r="20" fill="none" stroke="url(#ringGrad)" strokeWidth="1.5" strokeDasharray="20 12" opacity="0.9" />
                <circle cx="24" cy="24" r="20" fill="none" stroke="url(#ringGrad)" strokeWidth="0.5" strokeDasharray="6 30" opacity="0.4" />
              </svg>
              {/* Energy core with pulse */}
              <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-gradient-to-br from-neon-cyan/40 to-neon-purple/40 animate-[energyPulse_1.5s_ease-in-out_infinite] blur-[2px]" />
              <div className="absolute inset-0 m-auto w-6 h-6 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple animate-pulse-glow shadow-[0_0_15px_rgba(6,182,212,0.8),0_0_30px_rgba(139,92,246,0.4)]" />
              {/* Center shield icon */}
              <Shield className="absolute w-5 h-5 text-white drop-shadow-[0_0_6px_rgba(6,182,212,1)] drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]" />
              {/* Sparkle dots */}
              <span className="absolute top-0 right-1 w-1 h-1 rounded-full bg-neon-cyan shadow-[0_0_4px_#06b6d4]" style={{ animation: 'sparkle 2s ease-in-out infinite' }} />
              <span className="absolute bottom-1 left-0 w-0.5 h-0.5 rounded-full bg-neon-purple shadow-[0_0_4px_#8b5cf6]" style={{ animation: 'sparkle 2s ease-in-out infinite 0.7s' }} />
              <span className="absolute top-2 left-0 w-0.5 h-0.5 rounded-full bg-white shadow-[0_0_4px_#fff]" style={{ animation: 'sparkle 2s ease-in-out infinite 1.3s' }} />
            </div>

            {/* Text with crazy VFX */}
            <div className="relative group">
              {/* Permanent glitch layer 1 - cyan */}
              <span
                className="absolute inset-0 font-bold text-xl text-neon-cyan pointer-events-none select-none [clip-path:inset(20%_0_40%_0)]"
                style={{ animation: 'textGlitchCopy1 5s steps(1) infinite' }}
                aria-hidden
              >
                CLOUDCORE X
              </span>
              {/* Permanent glitch layer 2 - purple */}
              <span
                className="absolute inset-0 font-bold text-xl text-neon-purple pointer-events-none select-none [clip-path:inset(60%_0_0%_0)]"
                style={{ animation: 'textGlitchCopy2 5s steps(1) infinite' }}
                aria-hidden
              >
                CLOUDCORE X
              </span>
              {/* Main text with constant flicker and glow */}
              <span
                className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-neon-cyan via-white to-neon-purple relative inline-block"
                style={{ animation: 'logoGlitch 5s steps(1) infinite, logoFlicker 8s ease-in-out infinite', textShadow: '0 0 20px rgba(6,182,212,0.5), 0 0 40px rgba(139,92,246,0.3)' }}
              >
                CLOUDCORE X
                {/* Shimmer sweep */}
                <span className="absolute inset-0 overflow-hidden pointer-events-none [mask-image:linear-gradient(black,black)] [background:linear-gradient(90deg,transparent,rgba(255,255,255,0.6),transparent)] [background-size:30%_100%] animate-[shimmer_2s_ease-in-out_infinite]" />
              </span>
              {/* Animated energy underline */}
              <div className="relative h-[3px] mt-1 rounded-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan bg-[length:200%_100%] animate-[borderTravel_2s_linear_infinite] opacity-80" />
                <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-transparent via-white/90 to-transparent animate-[travel_1.5s_ease-in-out_infinite]" />
                <div className="absolute top-0 left-0 h-full w-6 bg-gradient-to-r from-transparent via-neon-cyan/60 to-transparent animate-[travel_2.5s_ease-in-out_infinite_0.3s]" />
              </div>
              {/* Orbiting particles around text */}
              <span className="absolute -top-2 -right-2 w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,1)]" style={{ animation: 'sparkle 1.5s ease-in-out infinite' }} />
              <span className="absolute -bottom-2 left-6 w-1 h-1 rounded-full bg-neon-purple animate-pulse shadow-[0_0_8px_rgba(139,92,246,1)]" style={{ animation: 'sparkle 1.5s ease-in-out infinite 0.5s' }} />
              <span className="absolute top-1/2 -right-4 w-0.5 h-0.5 rounded-full bg-white shadow-[0_0_6px_#fff]" style={{ animation: 'sparkle 2s ease-in-out infinite 1s' }} />
              <span className="absolute -top-1 left-1/3 w-0.5 h-0.5 rounded-full bg-neon-cyan shadow-[0_0_4px_#06b6d4]" style={{ animation: 'sparkle 1.8s ease-in-out infinite 0.3s' }} />
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="relative w-10 h-10 flex items-center justify-center mx-auto"
            whileHover={{ scale: 1.2, rotate: 180 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {/* Collapsed logo rings */}
            <svg className="absolute inset-0 w-10 h-10" style={{ animation: 'orbitRing 2s linear infinite' }} viewBox="0 0 40 40">
              <defs>
                <linearGradient id="ringGradSmall" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="100%" stopColor="#8b5cf6" />
                </linearGradient>
              </defs>
              <circle cx="20" cy="20" r="17" fill="none" stroke="url(#ringGradSmall)" strokeWidth="1.5" strokeDasharray="15 10 8 12" opacity="0.8" />
            </svg>
            <svg className="absolute inset-0 w-10 h-10" style={{ animation: 'orbitRingReverse 3s linear infinite' }} viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="14" fill="none" stroke="#8b5cf6" strokeWidth="0.8" strokeDasharray="8 14" opacity="0.4" />
            </svg>
            <div className="absolute inset-0 m-auto w-5 h-5 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple animate-pulse-glow shadow-[0_0_12px_rgba(6,182,212,0.8)]" style={{ animation: 'energyPulse 1.5s ease-in-out infinite' }} />
            <Shield className="w-5 h-5 text-neon-cyan drop-shadow-[0_0_8px_rgba(6,182,212,1)] relative z-10" style={{ filter: 'drop-shadow(0 0 4px rgba(6,182,212,0.8))' }} />
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
              <p className="text-sm font-semibold truncate text-white group-hover:text-neon-cyan transition-colors">{displayName}</p>
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
                  {displayName}
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
