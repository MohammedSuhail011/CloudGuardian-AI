import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, AlertTriangle, Activity, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { FeedItem } from '../../utils/useDashboardData';

interface LiveFeedProps {
  items: FeedItem[];
  drawerFeed: FeedItem | null;
  onDismiss: (id: string) => void;
  onOpenDrawer: (item: FeedItem) => void;
  onCloseDrawer: () => void;
}

const levelConfig: Record<string, { color: string; dot: string; border: string }> = {
  critical: { color: 'bg-red-500', dot: 'bg-red-500 animate-pulse', border: 'border-l-red-500' },
  high: { color: 'bg-orange-500', dot: 'bg-orange-500', border: 'border-l-orange-500' },
  medium: { color: 'bg-yellow-500', dot: 'bg-yellow-500', border: 'border-l-yellow-500' },
  low: { color: 'bg-blue-500', dot: 'bg-blue-500', border: 'border-l-blue-500' },
};

const INITIAL_LIMIT = 5;
const SCROLLABLE_MAX_HEIGHT = 560;
const ANIMATED_CAP = 20;

const FeedItemRow = React.memo(({ feed, index, onOpen, onDismiss }: { feed: FeedItem; index: number; onOpen: (item: FeedItem) => void; onDismiss: (id: string) => void }) => {
  const cfg = levelConfig[feed.level] || levelConfig.low;
  const isNew = feed.time === 'just now';
  return (
    <motion.div
      key={feed.id}
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0, transition: { delay: Math.min(index * 0.03, 0.6) } }}
      whileHover={{ x: 4, borderColor: 'rgba(6, 182, 212, 0.5)' }}
      onClick={() => onOpen(feed)}
      className={`flex gap-3 items-start p-3 rounded-lg bg-cyber-dark/50 border border-cyber-border border-l-2 transition-colors cursor-pointer relative overflow-hidden ${cfg.border}`}
    >
      {isNew && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="absolute inset-0 bg-gradient-to-r from-neon-cyan/5 to-transparent pointer-events-none"
        />
      )}
      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${cfg.dot} ${feed.level === 'critical' || feed.level === 'high' ? 'shadow-[0_0_8px_rgba(239,68,68,0.6)]' : ''}`} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <h4 className="text-sm font-medium text-white truncate">{feed.alert}</h4>
          <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0 ml-2">{feed.time}</span>
        </div>
        <p className="text-xs text-gray-400">Source: <span className="text-neon-cyan font-mono">{feed.source}</span></p>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onDismiss(feed.id); }}
        className="text-gray-600 hover:text-white transition-colors shrink-0 opacity-0 group-hover:opacity-100"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </motion.div>
  );
});

const PlainFeedItemRow = React.memo(({ feed, onOpen, onDismiss }: { feed: FeedItem; onOpen: (item: FeedItem) => void; onDismiss: (id: string) => void }) => {
  const cfg = levelConfig[feed.level] || levelConfig.low;
  return (
    <div
      onClick={() => onOpen(feed)}
      className={`flex gap-3 items-start p-3 rounded-lg bg-cyber-dark/50 border border-cyber-border border-l-2 hover:border-l-cyan-500/60 transition-colors cursor-pointer relative overflow-hidden ${cfg.border}`}
    >
      <div className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${cfg.dot} ${feed.level === 'critical' || feed.level === 'high' ? 'shadow-[0_0_8px_rgba(239,68,68,0.6)]' : ''}`} />
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-0.5">
          <h4 className="text-sm font-medium text-white truncate">{feed.alert}</h4>
          <span className="text-[10px] text-gray-500 whitespace-nowrap shrink-0 ml-2">{feed.time}</span>
        </div>
        <p className="text-xs text-gray-400">Source: <span className="text-neon-cyan font-mono">{feed.source}</span></p>
      </div>
      <button
        onClick={e => { e.stopPropagation(); onDismiss(feed.id); }}
        className="text-gray-600 hover:text-white transition-colors shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
});

export const LiveFeed: React.FC<LiveFeedProps> = React.memo(({ items, drawerFeed, onDismiss, onOpenDrawer, onCloseDrawer }) => {
  const [expanded, setExpanded] = useState(false);
  const prevItemsKey = useRef('');

  useEffect(() => {
    const key = items.map(i => i.id).join(',');
    if (key !== prevItemsKey.current) {
      prevItemsKey.current = key;
      setExpanded(false);
    }
  }, [items]);

  const hasMore = items.length > INITIAL_LIMIT;
  const visibleItems = expanded ? items : items.slice(0, INITIAL_LIMIT);
  const usePlainForExtra = expanded && items.length > ANIMATED_CAP;
  const animatedItems = usePlainForExtra ? visibleItems.slice(0, ANIMATED_CAP) : visibleItems;
  const plainItems = usePlainForExtra ? visibleItems.slice(ANIMATED_CAP) : [];

  return (
    <>
      <div className="space-y-2">
        <motion.div
          layout
          transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className={expanded ? 'overflow-y-auto feed-scroll' : 'overflow-hidden'}
          style={{ maxHeight: expanded ? SCROLLABLE_MAX_HEIGHT : undefined }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {animatedItems.map((feed, i) => (
              <FeedItemRow key={feed.id} feed={feed} index={i} onOpen={onOpenDrawer} onDismiss={onDismiss} />
            ))}
          </AnimatePresence>
          {plainItems.map(feed => (
            <PlainFeedItemRow key={feed.id} feed={feed} onOpen={onOpenDrawer} onDismiss={onDismiss} />
          ))}
        </motion.div>

        {hasMore && (
          <motion.button
            onClick={() => setExpanded(!expanded)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full flex items-center justify-center gap-2 py-3 mt-2 text-xs border border-dashed border-cyber-border hover:border-neon-cyan/50 rounded-lg text-gray-400 hover:text-neon-cyan transition-colors"
          >
            {expanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" /> Show Less
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" /> Show All Activity ({items.length})
              </>
            )}
          </motion.button>
        )}
      </div>

      {/* Detail Drawer */}
      <AnimatePresence>
        {drawerFeed && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={onCloseDrawer}
              className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, x: 320 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 320 }}
              transition={{ type: "spring", stiffness: 250, damping: 25 }}
              className="fixed right-0 top-0 bottom-0 z-[101] w-full max-w-md glass-panel rounded-none border-y-0 border-r-0 flex flex-col shadow-2xl"
              onKeyDown={e => { if (e.key === 'Escape') onCloseDrawer(); }}
            >
              <div className="p-6 border-b border-cyber-border flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    drawerFeed.level === 'critical' ? 'bg-red-500/20 text-red-500' :
                    drawerFeed.level === 'high' ? 'bg-orange-500/20 text-orange-500' :
                    drawerFeed.level === 'medium' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-blue-500/20 text-blue-500'
                  }`}>
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white capitalize">{drawerFeed.level} Alert</h3>
                    <p className="text-xs text-gray-500">{drawerFeed.source}</p>
                  </div>
                </div>
                <button onClick={onCloseDrawer} className="text-gray-400 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-cyber p-6 space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">{drawerFeed.alert}</h4>
                  <p className="text-sm text-gray-400 leading-relaxed">{drawerFeed.detail}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Severity', value: drawerFeed.level.toUpperCase(), color: drawerFeed.level === 'critical' ? 'text-red-500' : drawerFeed.level === 'high' ? 'text-orange-500' : drawerFeed.level === 'medium' ? 'text-yellow-500' : 'text-blue-500' },
                    { label: 'Source', value: drawerFeed.source },
                    { label: 'Provider', value: drawerFeed.provider },
                    { label: 'Detected', value: drawerFeed.time },
                  ].map(s => (
                    <div key={s.label} className="p-3 rounded-lg bg-cyber-dark/40 border border-cyber-border/60">
                      <div className="text-[10px] text-gray-500 font-mono mb-1">{s.label}</div>
                      <div className={`text-xs font-semibold ${s.color || 'text-white'}`}>{s.value}</div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-cyber-dark/50 border border-cyber-border">
                  <div className="flex items-center gap-2 mb-3">
                    <Activity className="w-4 h-4 text-neon-cyan" />
                    <span className="text-xs font-semibold text-white">Recommended Actions</span>
                  </div>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-neon-cyan mt-0.5">→</span>
                      Review the alert details in the cloud provider console
                    </li>
                    <li className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-neon-cyan mt-0.5">→</span>
                      Check if automated mitigations have been applied
                    </li>
                    <li className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="text-neon-cyan mt-0.5">→</span>
                      Escalate to senior security engineer if confirmed
                    </li>
                  </ul>
                </div>
              </div>

              <div className="p-4 border-t border-cyber-border flex gap-3 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onDismiss(drawerFeed.id);
                    onCloseDrawer();
                  }}
                  className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-cyber-border text-gray-300 hover:text-white hover:border-gray-500 transition-colors flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" /> Dismiss
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onCloseDrawer}
                  className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-gradient-to-r from-neon-cyan to-neon-purple text-white font-medium flex items-center justify-center gap-2"
                >
                  <Shield className="w-4 h-4" /> Investigate
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
});
