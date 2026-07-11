import React from 'react';

export const BackgroundEffects: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Floating gradient orbs — large blurred blobs that drift slowly */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />
      <div className="bg-orb bg-orb-4" />

      {/* Animated grid overlay */}
      <div className="absolute inset-0 bg-cyber-grid opacity-100" />

      {/* Horizontal scan line sweeping down */}
      <div className="absolute inset-x-0 top-0 h-[2px] bg-scan-line" />

      {/* Vertical data rain columns */}
      <div className="absolute inset-0 data-rain">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="data-rain-column"
            style={{
              left: `${(i / 12) * 100 + Math.random() * 5}%`,
              animationDuration: `${4 + Math.random() * 6}s`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.03 + Math.random() * 0.04,
            }}
          />
        ))}
      </div>

      {/* Pulsing corner brackets */}
      <div className="absolute top-0 left-0 w-32 h-32 border-t border-l border-neon-cyan/10 animate-pulse-slow" />
      <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-neon-purple/10 animate-pulse-slow" style={{ animationDelay: '1s' }} />
      <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-neon-purple/10 animate-pulse-slow" style={{ animationDelay: '2s' }} />
      <div className="absolute bottom-0 right-0 w-32 h-32 border-b border-r border-neon-cyan/10 animate-pulse-slow" style={{ animationDelay: '0.5s' }} />

      {/* Radial pulse from center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-radial-pulse" />

      {/* Noise texture overlay */}
      <div className="absolute inset-0 bg-noise opacity-[0.015]" />

      {/* Horizontal interference lines */}
      <div className="absolute inset-0 bg-interference" />
    </div>
  );
};
