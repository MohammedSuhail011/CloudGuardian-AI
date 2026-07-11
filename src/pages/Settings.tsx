import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Key, Bell, User, Layout, Save, Check, Cloud, Monitor, Mail, Smartphone, Plus, X, Trash2 } from 'lucide-react';

const tabs = ['API Keys', 'Theme', 'Notifications', 'Cloud Accounts', 'Profile'];

const animatedAvatars = [
  {
    id: 'glitch-skull',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes g1{0%,100%{clip-path:inset(0 0 0 0);transform:translate(0)}5%{clip-path:inset(20% 0 50% 0);transform:translate(3px,-1px)}10%{clip-path:inset(0 0 0 0);transform:translate(0)}45%{clip-path:inset(0 0 0 0);transform:translate(0)}46%{clip-path:inset(60% 0 10% 0);transform:translate(-2px,1px)}47%{clip-path:inset(0 0 0 0);transform:translate(0)}}@keyframes g2{0%,100%{clip-path:inset(0 0 0 0);transform:translate(0)}6%{clip-path:inset(40% 0 30% 0);transform:translate(-3px,1px)}11%{clip-path:inset(0 0 0 0);transform:translate(0)}48%{clip-path:inset(0 0 0 0);transform:translate(0)}49%{clip-path:inset(10% 0 70% 0);transform:translate(2px,-2px)}50%{clip-path:inset(0 0 0 0);transform:translate(0)}}@keyframes flicker{0%,93%,95%,100%{opacity:1}94%{opacity:.3}96%{opacity:.5}}@keyframes eyePulse{0%,100%{opacity:.6;filter:drop-shadow(0 0 4px #ef4444)}50%{opacity:1;filter:drop-shadow(0 0 12px #ef4444) drop-shadow(0 0 24px #ef4444)}}@keyframes scanY{0%{y:-10%}100%{y:120%}}@keyframes codeRain{0%{transform:translateY(-100%)}100%{transform:translateY(120%)}}</style><radialGradient id="bg1" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#1a0a2e"/><stop offset="100%" stop-color="#0a0514"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg1)"/><g style="animation:codeRain 4s linear infinite;opacity:.15"><text x="10" y="10" font-family="monospace" font-size="6" fill="#06b6d4">01101001</text><text x="70" y="20" font-family="monospace" font-size="5" fill="#8b5cf6">10110010</text><text x="20" y="35" font-family="monospace" font-size="6" fill="#06b6d4">11001010</text><text x="80" y="15" font-family="monospace" font-size="5" fill="#ef4444">01010111</text></g><g style="animation:g1 4s steps(1) infinite"><g style="animation:flicker 6s ease-in-out infinite" fill="none" stroke="#06b6d4" stroke-width="1.5"><ellipse cx="60" cy="55" rx="28" ry="32" opacity=".8"/><ellipse cx="48" cy="48" rx="8" ry="10"/><ellipse cx="72" cy="48" rx="8" ry="10"/><path d="M48 68 L53 73 L60 68 L67 73 L72 68" stroke-width="1.2"/><line x1="60" y1="35" x2="60" y2="25" opacity=".5"/><line x1="42" y1="40" x2="32" y2="35" opacity=".4"/><line x1="78" y1="40" x2="88" y2="35" opacity=".4"/></g><g style="animation:eyePulse 2s ease-in-out infinite"><circle cx="48" cy="48" r="3" fill="#ef4444"/><circle cx="72" cy="48" r="3" fill="#ef4444"/></g><rect x="0" y="0" width="120" height="3" fill="rgba(6,182,212,0.3)" style="animation:scanY 3s linear infinite"/></g><g style="animation:g2 4s steps(1) infinite"><ellipse cx="60" cy="55" rx="28" ry="32" fill="none" stroke="#8b5cf6" stroke-width="1" opacity=".3" transform="translate(1,-1)"/></g></svg>`)}`,
    name: 'Ghost Protocol',
  },
  {
    id: 'cyber-mask',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes breathe{0%,100%{opacity:.7;transform:scale(1)}50%{opacity:1;transform:scale(1.02)}}@keyframes maskPulse{0%,100%{filter:drop-shadow(0 0 8px rgba(6,182,212,0.4))}50%{filter:drop-shadow(0 0 20px rgba(6,182,212,0.8)) drop-shadow(0 0 40px rgba(139,92,246,0.4))}}@keyframes visorGlow{0%,100%{stop-color:#06b6d4;stop-opacity:.8}50%{stop-color:#8b5cf6;stop-opacity:1}}@keyframes dataFlow{0%{stroke-dashoffset:20}100%{stroke-dashoffset:0}}@keyframes hexSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style><radialGradient id="bg2" cx="50%" cy="50%" r="55%"><stop offset="0%" stop-color="#0f172a"/><stop offset="100%" stop-color="#020617"/></radialGradient><linearGradient id="visor" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#06b6d4"><animate attributeName="stop-color" values="#06b6d4;#8b5cf6;#06b6d4" dur="3s" repeatCount="indefinite"/></stop><stop offset="100%" stop-color="#8b5cf6"><animate attributeName="stop-color" values="#8b5cf6;#06b6d4;#8b5cf6" dur="3s" repeatCount="indefinite"/></stop></linearGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg2)"/><g style="animation:maskPulse 3s ease-in-out infinite"><path d="M60 18 C35 18 20 38 20 58 C20 72 28 82 38 88 L38 98 C38 100 40 102 42 102 L78 102 C80 102 82 100 82 98 L82 88 C92 82 100 72 100 58 C100 38 85 18 60 18Z" fill="#111827" stroke="#06b6d4" stroke-width="1.2" style="animation:breathe 4s ease-in-out infinite"/><path d="M35 52 C35 52 42 46 60 46 C78 46 85 52 85 52 L85 62 C85 62 78 68 60 68 C42 68 35 62 35 62Z" fill="url(#visor)" opacity=".9"/><line x1="60" y1="46" x2="60" y2="68" stroke="#020617" stroke-width="1.5" opacity=".4"/><line x1="47" y1="57" x2="73" y2="57" stroke="#020617" stroke-width="0.5" opacity=".3"/><line x1="44" y1="52" x2="76" y2="52" stroke="rgba(255,255,255,0.1)" stroke-width="0.3"/><line x1="44" y1="62" x2="76" y2="62" stroke="rgba(255,255,255,0.1)" stroke-width="0.3"/><path d="M50 78 L55 82 L60 78 L65 82 L70 78" fill="none" stroke="#06b6d4" stroke-width="1" opacity=".6"/><line x1="60" y1="84" x2="60" y2="92" stroke="#06b6d4" stroke-width="0.8" opacity=".4"/><line x1="55" y1="84" x2="55" y2="89" stroke="#8b5cf6" stroke-width="0.5" opacity=".3"/><line x1="65" y1="84" x2="65" y2="89" stroke="#8b5cf6" stroke-width="0.5" opacity=".3"/><circle cx="32" cy="35" r="1" fill="#06b6d4" opacity=".4"/><circle cx="88" cy="35" r="1" fill="#8b5cf6" opacity=".4"/><circle cx="60" cy="15" r="1.5" fill="#06b6d4" opacity=".6"/></g><circle cx="45" cy="57" r="1.5" fill="#fff" opacity=".8"/><circle cx="75" cy="57" r="1.5" fill="#fff" opacity=".8"/><g style="animation:hexSpin 20s linear infinite;transform-origin:60px 60px" opacity=".06"><polygon points="60,20 80,30 80,50 60,60 40,50 40,30" fill="none" stroke="#06b6d4" stroke-width="0.5"/></g></svg>`)}`,
    name: 'Cyber Phantom',
  },
  {
    id: 'matrix-face',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes mDrop{0%{transform:translateY(-20px);opacity:0}10%{opacity:1}90%{opacity:1}100%{transform:translateY(130px);opacity:0}}@keyframes faceGlow{0%,100%{filter:drop-shadow(0 0 6px rgba(16,185,129,0.5))}50%{filter:drop-shadow(0 0 16px rgba(16,185,129,0.9)) drop-shadow(0 0 30px rgba(52,211,153,0.3))}}@keyframes eyeFlash{0%,90%,100%{opacity:.7}95%{opacity:1}}</style><radialGradient id="bg3" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#052e16"/><stop offset="100%" stop-color="#020617"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg3)"/><g opacity=".2"><text x="8" y="12" font-family="monospace" font-size="7" fill="#10b981" style="animation:mDrop 3s linear infinite">H</text><text x="25" y="8" font-family="monospace" font-size="6" fill="#34d399" style="animation:mDrop 3.5s linear infinite .5s">A</text><text x="42" y="15" font-family="monospace" font-size="7" fill="#10b981" style="animation:mDrop 2.8s linear infinite 1s">C</text><text x="58" y="10" font-family="monospace" font-size="6" fill="#34d399" style="animation:mDrop 3.2s linear infinite .3s">K</text><text x="75" y="14" font-family="monospace" font-size="7" fill="#10b981" style="animation:mDrop 3.8s linear infinite .8s">E</text><text x="92" y="8" font-family="monospace" font-size="6" fill="#34d399" style="animation:mDrop 2.5s linear infinite 1.2s">R</text><text x="15" y="25" font-family="monospace" font-size="5" fill="#10b981" style="animation:mDrop 4s linear infinite .2s">0x4F</text><text x="80" y="28" font-family="monospace" font-size="5" fill="#34d399" style="animation:mDrop 3.6s linear infinite .7s">FF01</text><text x="5" y="40" font-family="monospace" font-size="6" fill="#10b981" style="animation:mDrop 4.2s linear infinite 1.5s">root@</text><text x="85" y="45" font-family="monospace" font-size="6" fill="#34d399" style="animation:mDrop 3.4s linear infinite .4s">sudo</text><text x="30" y="30" font-family="monospace" font-size="5" fill="#10b981" style="animation:mDrop 3.1s linear infinite .9s">01010</text><text x="65" y="35" font-family="monospace" font-size="5" fill="#34d399" style="animation:mDrop 2.9s linear infinite 1.1s">11001</text></g><g style="animation:faceGlow 3s ease-in-out infinite"><circle cx="60" cy="60" r="32" fill="none" stroke="#10b981" stroke-width="1.5" opacity=".7"/><circle cx="60" cy="60" r="28" fill="#0a0514" opacity=".85"/><ellipse cx="48" cy="52" rx="6" ry="7" fill="none" stroke="#10b981" stroke-width="1.5"/><ellipse cx="72" cy="52" rx="6" ry="7" fill="none" stroke="#10b981" stroke-width="1.5"/><circle cx="48" cy="52" r="2" fill="#34d399" opacity=".9" style="animation:eyeFlash 4s ease-in-out infinite"/><circle cx="72" cy="52" r="2" fill="#34d399" opacity=".9" style="animation:eyeFlash 4s ease-in-out infinite .5s"/><line x1="52" y1="68" x2="68" y2="68" stroke="#10b981" stroke-width="1" opacity=".6"/><line x1="54" y1="72" x2="66" y2="72" stroke="#10b981" stroke-width="0.8" opacity=".4"/><line x1="56" y1="76" x2="64" y2="76" stroke="#10b981" stroke-width="0.6" opacity=".3"/></g><g opacity=".1" style="animation:mDrop 5s linear infinite"><text x="35" y="120" font-family="monospace" font-size="8" fill="#10b981">&gt;_</text></g></svg>`)}`,
    name: 'Matrix Ghost',
  },
  {
    id: 'circuit-skull',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes circuitPulse{0%,100%{stroke-dashoffset:0;opacity:.5}50%{stroke-dashoffset:10;opacity:.9}}@keyframes skullGlow{0%,100%{filter:drop-shadow(0 0 4px rgba(139,92,246,0.4))}50%{filter:drop-shadow(0 0 14px rgba(139,92,246,0.8)) drop-shadow(0 0 28px rgba(6,182,212,0.3))}}@keyframes nodeBlink{0%,40%,60%,100%{opacity:.3}50%{opacity:1}}</style><radialGradient id="bg4" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#1e1b4b"/><stop offset="100%" stop-color="#020617"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg4)"/><g opacity=".12" style="animation:circuitPulse 3s linear infinite" stroke="#8b5cf6" stroke-width="0.5" fill="none"><path d="M10 30 L30 30 L30 20 L50 20" stroke-dasharray="4 3"/><path d="M10 60 L20 60 L20 50 L35 50" stroke-dasharray="3 4"/><path d="M85 30 L100 30 L100 20 L115 20" stroke-dasharray="4 3"/><path d="M90 60 L105 60 L105 50 L115 50" stroke-dasharray="3 4"/><path d="M10 90 L25 90 L25 80 L40 80" stroke-dasharray="4 3"/><path d="M80 90 L100 90 L100 85 L115 85" stroke-dasharray="3 4"/><path d="M30 100 L30 110" stroke-dasharray="2 3"/><path d="M90 100 L90 110" stroke-dasharray="2 3"/></g><g><circle cx="10" cy="30" r="2" fill="#8b5cf6" opacity=".4" style="animation:nodeBlink 2s ease-in-out infinite"/><circle cx="50" cy="20" r="1.5" fill="#06b6d4" opacity=".3" style="animation:nodeBlink 2s ease-in-out infinite .3s"/><circle cx="100" cy="30" r="2" fill="#8b5cf6" opacity=".4" style="animation:nodeBlink 2s ease-in-out infinite .7s"/><circle cx="20" cy="60" r="1.5" fill="#06b6d4" opacity=".3" style="animation:nodeBlink 2s ease-in-out infinite 1s"/><circle cx="105" cy="60" r="1.5" fill="#8b5cf6" opacity=".3" style="animation:nodeBlink 2s ease-in-out infinite .5s"/><circle cx="40" cy="80" r="2" fill="#06b6d4" opacity=".4" style="animation:nodeBlink 2s ease-in-out infinite 1.2s"/><circle cx="115" cy="50" r="1.5" fill="#8b5cf6" opacity=".3" style="animation:nodeBlink 2s ease-in-out infinite .8s"/></g><g style="animation:skullGlow 3s ease-in-out infinite"><path d="M60 22 C40 22 28 36 28 52 C28 64 34 72 42 76 L42 86 C42 88 44 90 46 90 L74 90 C76 90 78 88 78 86 L78 76 C86 72 92 64 92 52 C92 36 80 22 60 22Z" fill="#0a0514" stroke="#8b5cf6" stroke-width="1.5"/><circle cx="47" cy="48" r="8" fill="none" stroke="#8b5cf6" stroke-width="1.2"/><circle cx="73" cy="48" r="8" fill="none" stroke="#8b5cf6" stroke-width="1.2"/><circle cx="47" cy="48" r="3" fill="#8b5cf6" opacity=".7"/><circle cx="73" cy="48" r="3" fill="#8b5cf6" opacity=".7"/><circle cx="47" cy="48" r="1" fill="#fff" opacity=".9"/><circle cx="73" cy="48" r="1" fill="#fff" opacity=".9"/><path d="M53 68 L57 72 L60 68 L63 72 L67 68" fill="none" stroke="#8b5cf6" stroke-width="1.2" opacity=".7"/><line x1="60" y1="56" x2="60" y2="62" stroke="#8b5cf6" stroke-width="0.8" opacity=".5"/></g><g opacity=".15"><line x1="47" y1="48" x2="30" y2="30" stroke="#06b6d4" stroke-width="0.5" stroke-dasharray="2 2"/><line x1="73" y1="48" x2="92" y2="30" stroke="#06b6d4" stroke-width="0.5" stroke-dasharray="2 2"/><line x1="47" y1="48" x2="40" y2="80" stroke="#8b5cf6" stroke-width="0.5" stroke-dasharray="2 2"/><line x1="73" y1="48" x2="105" y2="60" stroke="#8b5cf6" stroke-width="0.5" stroke-dasharray="2 2"/></g></svg>`)}`,
    name: 'Neural Hacker',
  },
  {
    id: 'neon-eyes',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes hoodPulse{0%,100%{filter:drop-shadow(0 0 6px rgba(6,182,212,0.3))}50%{filter:drop-shadow(0 0 18px rgba(6,182,212,0.7)) drop-shadow(0 0 36px rgba(139,92,246,0.2))}}@keyframes eyeScan{0%,100%{transform:translateX(-2px)}50%{transform:translateX(2px)}}@keyframes static{0%{opacity:.02}25%{opacity:.04}50%{opacity:.01}75%{opacity:.03}100%{opacity:.02}}</style><radialGradient id="bg5" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#0c1222"/><stop offset="100%" stop-color="#020617"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg5)"/><rect width="120" height="120" rx="60" fill="#06b6d4" opacity=".02" style="animation:static 0.3s steps(5) infinite"/><g style="animation:hoodPulse 3s ease-in-out infinite"><path d="M60 15 C30 15 15 40 15 60 C15 80 30 105 60 105 C90 105 105 80 105 60 C105 40 90 15 60 15Z" fill="#080412"/><path d="M60 18 C32 18 18 42 18 60 C18 78 32 102 60 102 C88 102 102 78 102 60 C102 42 88 18 60 18Z" fill="#050208" stroke="#06b6d4" stroke-width="0.8" opacity=".6"/><ellipse cx="60" cy="42" rx="35" ry="18" fill="#050208" opacity=".9"/><g style="animation:eyeScan 4s ease-in-out infinite"><ellipse cx="44" cy="58" rx="10" ry="5" fill="none" stroke="#06b6d4" stroke-width="1.5"/><ellipse cx="76" cy="58" rx="10" ry="5" fill="none" stroke="#06b6d4" stroke-width="1.5"/><ellipse cx="44" cy="58" rx="5" ry="3" fill="#06b6d4" opacity=".8"/><ellipse cx="76" cy="58" rx="5" ry="3" fill="#06b6d4" opacity=".8"/><circle cx="44" cy="58" r="1.5" fill="#fff" opacity=".9"/><circle cx="76" cy="58" r="1.5" fill="#fff" opacity=".9"/></g><path d="M50 74 L55 70 L60 74 L65 70 L70 74" fill="none" stroke="#06b6d4" stroke-width="0.8" opacity=".5"/><line x1="44" y1="64" x2="44" y2="72" stroke="#8b5cf6" stroke-width="0.3" opacity=".3"/><line x1="76" y1="64" x2="76" y2="72" stroke="#8b5cf6" stroke-width="0.3" opacity=".3"/></g></svg>`)}`,
    name: 'Shadow Op',
  },
  {
    id: 'binary-reaper',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes reaperPulse{0%,100%{filter:drop-shadow(0 0 5px rgba(239,68,68,0.3))}50%{filter:drop-shadow(0 0 15px rgba(239,68,68,0.7)) drop-shadow(0 0 30px rgba(239,68,68,0.2))}}@keyframes binaryScroll{0%{transform:translateY(0)}100%{transform:translateY(-40px)}}@keyframes scytheGlow{0%,100%{stroke:rgba(239,68,68,0.5)}50%{stroke:rgba(239,68,68,0.9)}}</style><radialGradient id="bg6" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#1c0a0a"/><stop offset="100%" stop-color="#020617"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg6)"/><g opacity=".08" style="animation:binaryScroll 6s linear infinite" font-family="monospace" font-size="5" fill="#ef4444"><text x="5" y="15">01001010</text><text x="20" y="25">11010011</text><text x="50" y="12">10110100</text><text x="75" y="22">01101001</text><text x="10" y="38">11001010</text><text x="60" y="35">01010111</text><text x="85" y="15">10101010</text><text x="30" y="48">01110010</text><text x="70" y="45">11000110</text></g><g style="animation:reaperPulse 3s ease-in-out infinite"><circle cx="60" cy="55" r="28" fill="#0a0514" stroke="#ef4444" stroke-width="1.2" opacity=".8"/><circle cx="48" cy="48" r="5" fill="#1c0a0a" stroke="#ef4444" stroke-width="1.5"/><circle cx="72" cy="48" r="5" fill="#1c0a0a" stroke="#ef4444" stroke-width="1.5"/><circle cx="48" cy="48" r="2" fill="#ef4444" opacity=".9"/><circle cx="72" cy="48" r="2" fill="#ef4444" opacity=".9"/><circle cx="48" cy="48" r="0.8" fill="#fff" opacity=".8"/><circle cx="72" cy="48" r="0.8" fill="#fff" opacity=".8"/><path d="M52 66 L56 70 L60 66 L64 70 L68 66" fill="none" stroke="#ef4444" stroke-width="1" opacity=".6"/><line x1="40" y1="42" x2="35" y2="35" stroke="#ef4444" stroke-width="0.5" opacity=".3"/><line x1="80" y1="42" x2="85" y2="35" stroke="#ef4444" stroke-width="0.5" opacity=".3"/></g><g style="animation:scytheGlow 2s ease-in-out infinite"><path d="M85 20 C95 20 105 30 100 45 C98 52 90 55 85 52" fill="none" stroke="#ef4444" stroke-width="1.5" opacity=".5"/><line x1="85" y1="52" x2="80" y2="90" stroke="#ef4444" stroke-width="1" opacity=".4"/></g><g opacity=".15"><text x="40" y="95" font-family="monospace" font-size="6" fill="#ef4444">D34TH</text></g></svg>`)}`,
    name: 'Death Coder',
  },
  {
    id: 'hud-operator',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes hudSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes hudBlink{0%,90%,100%{opacity:.4}95%{opacity:1}}@keyframes hudPulse{0%,100%{filter:drop-shadow(0 0 4px rgba(59,130,246,0.3))}50%{filter:drop-shadow(0 0 12px rgba(59,130,246,0.7)) drop-shadow(0 0 24px rgba(99,102,241,0.3))}}</style><radialGradient id="bg7" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#0c1a33"/><stop offset="100%" stop-color="#020617"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg7)"/><g style="animation:hudSpin 25s linear infinite;transform-origin:60px 60px" opacity=".08"><circle cx="60" cy="60" r="50" fill="none" stroke="#3b82f6" stroke-width="0.5" stroke-dasharray="8 4"/><circle cx="60" cy="60" r="42" fill="none" stroke="#6366f1" stroke-width="0.3" stroke-dasharray="4 8"/></g><g style="animation:hudSpin 15s linear infinite reverse;transform-origin:60px 60px" opacity=".1"><circle cx="60" cy="60" r="46" fill="none" stroke="#3b82f6" stroke-width="0.5" stroke-dasharray="12 6"/></g><g style="animation:hudPulse 3s ease-in-out infinite"><circle cx="60" cy="55" r="26" fill="#0a0514" stroke="#3b82f6" stroke-width="1.2" opacity=".8"/><path d="M42 50 C42 44 48 40 54 40 C56 40 58 42 58 44 L58 44 C58 42 60 40 62 40 C68 40 74 44 74 50 L74 52 C74 56 70 58 66 58 L54 58 C50 58 46 56 46 52Z" fill="none" stroke="#3b82f6" stroke-width="1.5"/><circle cx="54" cy="49" r="3" fill="#3b82f6" opacity=".6"/><circle cx="66" cy="49" r="3" fill="#3b82f6" opacity=".6"/><circle cx="54" cy="49" r="1.2" fill="#fff" opacity=".7" style="animation:hudBlink 3s ease-in-out infinite"/><circle cx="66" cy="49" r="1.2" fill="#fff" opacity=".7" style="animation:hudBlink 3s ease-in-out infinite .3s"/><line x1="58" y1="60" x2="62" y2="60" stroke="#3b82f6" stroke-width="0.8" opacity=".5"/><path d="M50 66 L55 70 L60 66 L65 70 L70 66" fill="none" stroke="#3b82f6" stroke-width="0.8" opacity=".4"/><line x1="54" y1="58" x2="48" y2="62" stroke="#3b82f6" stroke-width="0.3" opacity=".3"/><line x1="66" y1="58" x2="72" y2="62" stroke="#3b82f6" stroke-width="0.3" opacity=".3"/></g><g opacity=".2" style="animation:hudBlink 2s ease-in-out infinite"><text x="22" y="80" font-family="monospace" font-size="5" fill="#3b82f6">SYS://OK</text><text x="78" y="80" font-family="monospace" font-size="5" fill="#6366f1">ID:0x7F</text></g></svg>`)}`,
    name: 'Hud Operator',
  },
  {
    id: 'anarchist',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes chaos{0%,100%{transform:rotate(0deg) scale(1)}25%{transform:rotate(2deg) scale(1.01)}50%{transform:rotate(-1deg) scale(0.99)}75%{transform:rotate(1deg) scale(1.01)}}@keyframes anarchyGlow{0%,100%{filter:drop-shadow(0 0 4px rgba(234,179,8,0.3))}50%{filter:drop-shadow(0 0 14px rgba(234,179,8,0.7)) drop-shadow(0 0 28px rgba(249,115,22,0.3))}}@keyframes glitchShift{0%,90%,100%{transform:translate(0)}92%{transform:translate(3px,-2px)}94%{transform:translate(-2px,1px)}96%{transform:translate(1px,2px)}98%{transform:translate(-1px,-1px)}}</style><radialGradient id="bg8" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#1a1005"/><stop offset="100%" stop-color="#020617"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg8)"/><g style="animation:chaos 8s ease-in-out infinite" opacity=".06"><text x="5" y="20" font-family="monospace" font-size="4" fill="#eab308">CHAOS</text><text x="80" y="15" font-family="monospace" font-size="4" fill="#f97316">SYSTEM</text><text x="10" y="100" font-family="monospace" font-size="4" fill="#eab308">BREACH</text><text x="75" y="95" font-family="monospace" font-size="4" fill="#f97316">FIREWALL</text><text x="30" y="110" font-family="monospace" font-size="4" fill="#eab308">DELETED</text></g><g style="animation:anarchyGlow 3s ease-in-out infinite"><circle cx="60" cy="55" r="28" fill="#0a0514" stroke="#eab308" stroke-width="1.2"/><g style="animation:glitchShift 4s steps(1) infinite"><circle cx="48" cy="48" r="6" fill="#1a1005" stroke="#eab308" stroke-width="1.5"/><circle cx="72" cy="48" r="6" fill="#1a1005" stroke="#eab308" stroke-width="1.5"/><circle cx="48" cy="48" r="2.5" fill="#eab308" opacity=".9"/><circle cx="72" cy="48" r="2.5" fill="#eab308" opacity=".9"/><circle cx="48" cy="48" r="1" fill="#fff" opacity=".8"/><circle cx="72" cy="48" r="1" fill="#fff" opacity=".8"/><path d="M52 68 L56 72 L60 68 L64 72 L68 68" fill="none" stroke="#eab308" stroke-width="1" opacity=".7"/></g><path d="M60 20 L52 35 L68 35Z" fill="none" stroke="#eab308" stroke-width="0.8" opacity=".3"/><line x1="60" y1="20" x2="60" y2="10" stroke="#eab308" stroke-width="0.5" opacity=".3"/></g></svg>`)}`,
    name: 'Chaos Agent',
  },
  {
    id: 'anime-hacker-girl',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes visorGlow{0%,100%{filter:drop-shadow(0 0 6px rgba(236,72,153,0.4))}50%{filter:drop-shadow(0 0 18px rgba(236,72,153,0.8)) drop-shadow(0 0 36px rgba(6,182,212,0.3))}}@keyframes hairFlow{0%,100%{transform:translateX(0) skewX(0deg)}50%{transform:translateX(1px) skewX(0.5deg)}}@keyframes dataStream{0%{transform:translateY(-100%)}100%{transform:translateY(130%)}}@keyframes blink{0%,90%,100%{ry:4}95%{ry:0.5}}</style><radialGradient id="bg9" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#2d1033"/><stop offset="100%" stop-color="#0a0514"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg9)"/><g opacity=".12" style="animation:dataStream 3s linear infinite" font-family="monospace" font-size="5" fill="#ec4899"><text x="8" y="10">ハッカー</text><text x="70" y="25">システム</text><text x="15" y="45">アクセス</text><text x="80" y="15">侵入</text></g><g style="animation:hairFlow 6s ease-in-out infinite"><path d="M30 30 C30 18 42 10 60 10 C78 10 90 18 90 30 L88 55 L85 42 L80 58 L75 40 L70 60 L60 45 L50 60 L45 40 L40 58 L35 42 L32 55Z" fill="#1a0a2e" stroke="#ec4899" stroke-width="0.5" opacity=".9"/><path d="M32 30 C32 20 44 12 60 12 C76 12 88 20 88 30 L86 50" fill="none" stroke="#ec4899" stroke-width="0.3" opacity=".3"/></g><g style="animation:visorGlow 3s ease-in-out infinite"><path d="M38 42 C38 36 46 32 60 32 C74 32 82 36 82 42 L82 50 C82 54 74 58 60 58 C46 58 38 54 38 50Z" fill="#0a0514" stroke="#ec4899" stroke-width="1.2" opacity=".85"/><line x1="60" y1="32" x2="60" y2="58" stroke="#ec4899" stroke-width="0.5" opacity=".3"/><ellipse cx="48" cy="46" rx="7" ry="4" fill="#ec4899" opacity=".7"/><ellipse cx="72" cy="46" rx="7" ry="4" fill="#06b6d4" opacity=".7"/><circle cx="48" cy="46" r="2" fill="#fff" opacity=".9"/><circle cx="72" cy="46" r="2" fill="#fff" opacity=".9"/><circle cx="46" cy="45" r="0.8" fill="#fff" opacity=".6"/><circle cx="70" cy="45" r="0.8" fill="#fff" opacity=".6"/></g><path d="M55 64 L58 66 L60 64 L62 66 L65 64" fill="none" stroke="#ec4899" stroke-width="0.8" opacity=".6"/><path d="M44 62 Q48 60 52 64" fill="none" stroke="#ec4899" stroke-width="0.5" opacity=".4"/><circle cx="60" cy="75" r="2" fill="#ec4899" opacity=".4"/><g opacity=".08"><text x="15" y="85" font-family="monospace" font-size="4" fill="#ec4899">NEURAL.LINK</text><text x="70" y="80" font-family="monospace" font-size="4" fill="#06b6d4">0x3F7A</text></g></svg>`)}`,
    name: 'Net Runner',
  },
  {
    id: 'cyber-samurai',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes katanaGlow{0%,100%{filter:drop-shadow(0 0 4px rgba(6,182,212,0.3))}50%{filter:drop-shadow(0 0 16px rgba(6,182,212,0.7)) drop-shadow(0 0 32px rgba(6,182,212,0.2))}}@keyframes helmetPulse{0%,100%{stroke-opacity:.6}50%{stroke-opacity:1}}@keyframes visor{0%,100%{stop-color:#06b6d4}50%{stop-color:#ef4444}}</style><radialGradient id="bg10" cx="50%" cy="40%" r="60%"><stop offset="0%" stop-color="#0a1628"/><stop offset="100%" stop-color="#020617"/></radialGradient><linearGradient id="v10" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="#06b6d4"><animate attributeName="stop-color" values="#06b6d4;#ef4444;#06b6d4" dur="4s" repeatCount="indefinite"/></stop><stop offset="100%" stop-color="#06b6d4"><animate attributeName="stop-color" values="#06b6d4;#ef4444;#06b6d4" dur="4s" repeatCount="indefinite"/></stop></linearGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg10)"/><g style="animation:katanaGlow 3s ease-in-out infinite"><path d="M85 12 L88 10 L92 14 L90 16Z" fill="#06b6d4" opacity=".8"/><line x1="88" y1="14" x2="95" y2="95" stroke="#06b6d4" stroke-width="1.5" opacity=".6"/><line x1="88" y1="14" x2="95" y2="95" stroke="#fff" stroke-width="0.3" opacity=".4"/><rect x="82" y="88" width="12" height="3" rx="1" fill="#8b5cf6" opacity=".6" transform="rotate(-8,88,90)"/></g><g style="animation:helmetPulse 3s ease-in-out infinite" fill="none" stroke="#06b6d4"><path d="M60 15 C35 15 22 32 22 50 C22 60 26 68 32 72 L32 85 C32 87 34 89 36 89 L50 89 L50 82 L60 82 L70 82 L70 89 L84 89 C86 89 88 87 88 85 L88 72 C94 68 98 60 98 50 C98 32 85 15 60 15Z" fill="#0a0514" stroke-width="1.5"/><path d="M35 35 L60 28 L85 35 L85 45 L35 45Z" fill="#111827" stroke-width="0.8" opacity=".8"/><rect x="40" y="38" width="40" height="8" rx="2" fill="url(#v10)" opacity=".8"/><line x1="50" y1="38" x2="50" y2="46" stroke="#020617" stroke-width="0.5" opacity=".4"/><line x1="60" y1="38" x2="60" y2="46" stroke="#020617" stroke-width="0.5" opacity=".4"/><line x1="70" y1="38" x2="70" y2="46" stroke="#020617" stroke-width="0.5" opacity=".4"/><path d="M50 62 L55 66 L60 62 L65 66 L70 62" stroke-width="0.8" opacity=".5"/><line x1="60" y1="52" x2="60" y2="58" stroke-width="0.5" opacity=".4"/></g><circle cx="60" cy="18" r="2" fill="#06b6d4" opacity=".5"/><circle cx="40" cy="42" r="1" fill="#06b6d4" opacity=".3"/><circle cx="80" cy="42" r="1" fill="#06b6d4" opacity=".3"/></svg>`)}`,
    name: 'Cyber Samurai',
  },
  {
    id: 'cyborg-eyes',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes cyborgScan{0%{x1:20;x2:100}50%{x1:20;x2:100}100%{x1:20;x2:100}}@keyframes cyborgPulse{0%,100%{filter:drop-shadow(0 0 6px rgba(99,102,241,0.4))}50%{filter:drop-shadow(0 0 18px rgba(99,102,241,0.8)) drop-shadow(0 0 36px rgba(6,182,212,0.3))}}@keyframes implantBlink{0%,85%,100%{opacity:.3}90%{opacity:.9}}@keyframes scanLine{0%{y:-5}100%{y:125}}</style><radialGradient id="bg11" cx="50%" cy="45%" r="55%"><stop offset="0%" stop-color="#111b33"/><stop offset="100%" stop-color="#020617"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg11)"/><g style="animation:cyborgPulse 3s ease-in-out infinite"><circle cx="60" cy="55" r="32" fill="#080c18" stroke="#6366f1" stroke-width="1.2"/><line x1="60" y1="23" x2="60" y2="10" stroke="#6366f1" stroke-width="0.8" opacity=".5"/><circle cx="60" cy="10" r="2" fill="#06b6d4" opacity=".6"/><line x1="28" y1="55" x2="15" y2="55" stroke="#6366f1" stroke-width="0.5" opacity=".3"/><line x1="92" y1="55" x2="105" y2="55" stroke="#6366f1" stroke-width="0.5" opacity=".3"/><line x1="28" y1="55" x2="15" y2="55" stroke="#6366f1" stroke-width="0.5" opacity=".3"/><line x1="42" y1="75" x2="35" y2="85" stroke="#6366f1" stroke-width="0.5" opacity=".3"/><line x1="78" y1="75" x2="85" y2="85" stroke="#6366f1" stroke-width="0.5" opacity=".3"/><circle cx="42" cy="75" r="1.5" fill="#06b6d4" opacity=".4" style="animation:implantBlink 3s ease-in-out infinite"/><circle cx="78" cy="75" r="1.5" fill="#06b6d4" opacity=".4" style="animation:implantBlink 3s ease-in-out infinite .5s"/><circle cx="15" cy="55" r="1" fill="#6366f1" opacity=".3" style="animation:implantBlink 2s ease-in-out infinite .3s"/><circle cx="105" cy="55" r="1" fill="#6366f1" opacity=".3" style="animation:implantBlink 2s ease-in-out infinite .8s"/><circle cx="44" cy="46" r="10" fill="#111827" stroke="#6366f1" stroke-width="1.5"/><circle cx="76" cy="46" r="10" fill="#111827" stroke="#6366f1" stroke-width="1.5"/><circle cx="44" cy="46" r="6" fill="#6366f1" opacity=".15"/><circle cx="76" cy="46" r="6" fill="#6366f1" opacity=".15"/><circle cx="44" cy="46" r="3.5" fill="#06b6d4" opacity=".85"/><circle cx="76" cy="46" r="3.5" fill="#06b6d4" opacity=".85"/><circle cx="44" cy="46" r="1.5" fill="#fff" opacity=".9"/><circle cx="76" cy="46" r="1.5" fill="#fff" opacity=".9"/><circle cx="42" cy="44" r="0.6" fill="#fff" opacity=".6"/><circle cx="74" cy="44" r="0.6" fill="#fff" opacity=".6"/><circle cx="46" cy="48" r="0.4" fill="#fff" opacity=".4"/><circle cx="78" cy="48" r="0.4" fill="#fff" opacity=".4"/></g><line x1="20" y1="0" x2="100" y2="0" stroke="#06b6d4" stroke-width="1" opacity=".15" style="animation:scanLine 4s linear infinite"/><g opacity=".1" font-family="monospace" font-size="4" fill="#6366f1"><text x="25" y="82">IMPLANT_v3</text><text x="65" y="82">SYNC:OK</text></g></svg>`)}`,
    name: 'Cyborg Unit',
  },
  {
    id: 'demon-hacker',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes demonFire{0%,100%{filter:drop-shadow(0 0 4px rgba(239,68,68,0.3))}50%{filter:drop-shadow(0 0 14px rgba(239,68,68,0.7)) drop-shadow(0 0 28px rgba(249,115,22,0.4))}}@keyframes hornGlow{0%,100%{stroke-opacity:.5}50%{stroke-opacity:1}}@keyframes demonGlitch{0%,88%,100%{transform:translate(0)}90%{transform:translate(2px,-1px)}92%{transform:translate(-2px,1px)}94%{transform:translate(1px,2px)}96%{transform:translate(-1px,0)}}</style><radialGradient id="bg12" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#2d0a0a"/><stop offset="100%" stop-color="#0a0208"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg12)"/><g style="animation:demonFire 3s ease-in-out infinite"><g style="animation:hornGlow 2s ease-in-out infinite" stroke="#ef4444" fill="none" stroke-width="1.5"><path d="M32 45 C28 30 22 15 18 8 C22 12 30 20 35 38"/><path d="M88 45 C92 30 98 15 102 8 C98 12 90 20 85 38"/></g><circle cx="60" cy="55" r="28" fill="#0a0208" stroke="#ef4444" stroke-width="1.2"/><g style="animation:demonGlitch 5s steps(1) infinite"><path d="M42 42 L48 38 L54 42 L50 48 L42 42Z" fill="#ef4444" opacity=".8"/><path d="M66 42 L72 38 L78 42 L74 48 L66 42Z" fill="#ef4444" opacity=".8"/><circle cx="48" cy="44" r="1.5" fill="#fff" opacity=".7"/><circle cx="72" cy="44" r="1.5" fill="#fff" opacity=".7"/></g><path d="M48 65 L52 68 L56 63 L60 68 L64 63 L68 68 L72 65" fill="none" stroke="#ef4444" stroke-width="1" opacity=".7"/><circle cx="38" cy="55" r="1" fill="#ef4444" opacity=".3"/><circle cx="82" cy="55" r="1" fill="#ef4444" opacity=".3"/><circle cx="60" cy="80" r="1.5" fill="#ef4444" opacity=".2"/></g><g opacity=".06" font-family="monospace" font-size="5" fill="#ef4444"><text x="10" y="100">D3M0N_</text><text x="75" y="95">ROOT</text></g></svg>`)}`,
    name: 'Demon Root',
  },
  {
    id: 'neon-ninja',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes ninjaGlow{0%,100%{filter:drop-shadow(0 0 4px rgba(34,211,238,0.3))}50%{filter:drop-shadow(0 0 14px rgba(34,211,238,0.7)) drop-shadow(0 0 28px rgba(139,92,246,0.3))}}@keyframes shadowPulse{0%,100%{opacity:.4}50%{opacity:.7}}@keyframes eyeTarget{0%,100%{transform:scale(1)}50%{transform:scale(1.1)}}@keyframes shurikenSpin{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}</style><radialGradient id="bg13" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#0a1a20"/><stop offset="100%" stop-color="#020617"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg13)"/><g opacity=".05"><text x="5" y="15" font-family="monospace" font-size="4" fill="#22d3ee">STEALTH</text><text x="80" y="20" font-family="monospace" font-size="4" fill="#8b5cf6">MODE</text><text x="10" y="105" font-family="monospace" font-size="4" fill="#22d3ee">ACTIVE</text><text x="75" y="100" font-family="monospace" font-size="4" fill="#8b5cf6">0xFF</text></g><g style="animation:ninjaGlow 3s ease-in-out infinite"><path d="M60 18 C38 18 24 34 24 50 C24 62 30 70 38 74 L38 82 C38 84 40 86 42 86 L78 86 C80 86 82 84 82 82 L82 74 C90 70 96 62 96 50 C96 34 82 18 60 18Z" fill="#080c14" stroke="#22d3ee" stroke-width="1"/><path d="M30 42 C30 42 42 36 60 36 C78 36 90 42 90 42 L90 52 C90 52 78 56 60 56 C42 56 30 52 30 52Z" fill="#111827" opacity=".9"/><g style="animation:eyeTarget 2s ease-in-out infinite"><ellipse cx="46" cy="48" rx="5" ry="3" fill="#22d3ee" opacity=".8"/><ellipse cx="74" cy="48" rx="5" ry="3" fill="#22d3ee" opacity=".8"/><circle cx="46" cy="48" r="1.5" fill="#fff" opacity=".9"/><circle cx="74" cy="48" r="1.5" fill="#fff" opacity=".9"/></g><path d="M52 64 L56 67 L60 64 L64 67 L68 64" fill="none" stroke="#22d3ee" stroke-width="0.8" opacity=".5"/><path d="M60 82 L60 95 M55 88 L60 82 L65 88" stroke="#22d3ee" stroke-width="0.8" opacity=".3"/></g><g style="animation:shurikenSpin 8s linear infinite;transform-origin:15px 105px" opacity=".15"><path d="M15 100 L17 105 L15 110 L13 105Z" fill="#8b5cf6"/><path d="M10 105 L15 103 L20 105 L15 107Z" fill="#8b5cf6"/></g><g style="animation:shadowPulse 2s ease-in-out infinite"><circle cx="60" cy="88" r="12" fill="#22d3ee" opacity=".04"/></g></svg>`)}`,
    name: 'Neon Shinobi',
  },
  {
    id: 'ai-overlord',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes overlordPulse{0%,100%{filter:drop-shadow(0 0 6px rgba(139,92,246,0.4))}50%{filter:drop-shadow(0 0 20px rgba(139,92,246,0.8)) drop-shadow(0 0 40px rgba(6,182,212,0.3))}}@keyframes crownFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-2px)}}@keyframes triScan{0%{y:20}100%{y:100}}@keyframes nodeExpand{0%,100%{r:1;opacity:.3}50%{r:2;opacity:.8}}</style><radialGradient id="bg14" cx="50%" cy="40%" r="55%"><stop offset="0%" stop-color="#1a0a33"/><stop offset="100%" stop-color="#020617"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg14)"/><g opacity=".08" font-family="monospace" font-size="4" fill="#8b5cf6"><text x="5" y="15">01001</text><text x="80" y="12">10110</text><text x="10" y="105">11010</text><text x="75" y="100">01101</text></g><g style="animation:overlordPulse 3s ease-in-out infinite"><g style="animation:crownFloat 3s ease-in-out infinite"><path d="M38 28 L44 18 L52 26 L60 14 L68 26 L76 18 L82 28" fill="none" stroke="#8b5cf6" stroke-width="1.5" opacity=".7"/><circle cx="44" cy="18" r="2" fill="#8b5cf6" opacity=".6"/><circle cx="60" cy="14" r="2.5" fill="#06b6d4" opacity=".8"/><circle cx="76" cy="18" r="2" fill="#8b5cf6" opacity=".6"/></g><circle cx="60" cy="56" r="30" fill="#0a0514" stroke="#8b5cf6" stroke-width="1.2"/><path d="M40 50 L40 42 L50 42 L50 50" fill="none" stroke="#8b5cf6" stroke-width="1.5"/><path d="M70 50 L70 42 L80 42 L80 50" fill="none" stroke="#8b5cf6" stroke-width="1.5"/><rect x="42" y="43" width="6" height="6" rx="1" fill="#8b5cf6" opacity=".7"/><rect x="72" y="43" width="6" height="6" rx="1" fill="#8b5cf6" opacity=".7"/><rect x="44" y="45" width="2" height="2" fill="#06b6d4" opacity=".9"/><rect x="74" y="45" width="2" height="2" fill="#06b6d4" opacity=".9"/><path d="M45 62 L50 66 L55 60 L60 66 L65 60 L70 66 L75 62" fill="none" stroke="#8b5cf6" stroke-width="1" opacity=".6"/><line x1="60" y1="50" x2="60" y2="56" stroke="#8b5cf6" stroke-width="0.5" opacity=".4"/></g><g opacity=".15" style="animation:triScan 5s linear infinite"><polygon points="60,20 80,90 40,90" fill="none" stroke="#8b5cf6" stroke-width="0.5"/></g><circle cx="30" cy="30" r="1" fill="#06b6d4" opacity=".3" style="animation:nodeExpand 2s ease-in-out infinite"/><circle cx="90" cy="30" r="1" fill="#8b5cf6" opacity=".3" style="animation:nodeExpand 2s ease-in-out infinite .5s"/><circle cx="25" cy="75" r="1" fill="#06b6d4" opacity=".3" style="animation:nodeExpand 2s ease-in-out infinite 1s"/><circle cx="95" cy="75" r="1" fill="#8b5cf6" opacity=".3" style="animation:nodeExpand 2s ease-in-out infinite 1.5s"/></svg>`)}`,
    name: 'AI Overlord',
  },
  {
    id: 'void-walker',
    url: `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120"><defs><style>@keyframes voidPulse{0%,100%{filter:drop-shadow(0 0 6px rgba(168,85,247,0.3))}50%{filter:drop-shadow(0 0 18px rgba(168,85,247,0.7)) drop-shadow(0 0 36px rgba(236,72,153,0.2))}}@keyframes voidEye{0%,100%{r:4;opacity:.7}50%{r:5;opacity:1}}@keyframes voidRipple{0%{r:5;opacity:.3;stroke-width:1}100%{r:30;opacity:0;stroke-width:0.2}}@keyframes voidFloat{0%,100%{transform:translateY(0) rotate(0deg)}50%{transform:translateY(-3px) rotate(180deg)}}</style><radialGradient id="bg15" cx="50%" cy="45%" r="60%"><stop offset="0%" stop-color="#1a0a2e"/><stop offset="50%" stop-color="#0a0520"/><stop offset="100%" stop-color="#020617"/></radialGradient></defs><rect width="120" height="120" rx="60" fill="url(#bg15)"/><g><circle cx="60" cy="55" r="5" fill="none" stroke="#a855f7" opacity=".15" style="animation:voidRipple 3s ease-out infinite"/><circle cx="60" cy="55" r="5" fill="none" stroke="#a855f7" opacity=".15" style="animation:voidRipple 3s ease-out infinite 1s"/><circle cx="60" cy="55" r="5" fill="none" stroke="#a855f7" opacity=".15" style="animation:voidRipple 3s ease-out infinite 2s"/></g><g style="animation:voidPulse 3s ease-in-out infinite"><circle cx="60" cy="55" r="30" fill="#050210" stroke="#a855f7" stroke-width="1.2"/><path d="M30 55 C30 35 42 20 60 20 C78 20 90 35 90 55 C90 75 78 90 60 90 C42 90 30 75 30 55Z" fill="none" stroke="#a855f7" stroke-width="0.3" opacity=".3"/><circle cx="48" cy="48" r="4" fill="#050210" stroke="#a855f7" stroke-width="1.5"/><circle cx="72" cy="48" r="4" fill="#050210" stroke="#a855f7" stroke-width="1.5"/><circle cx="48" cy="48" r="2" fill="#a855f7" opacity=".8" style="animation:voidEye 2s ease-in-out infinite"/><circle cx="72" cy="48" r="2" fill="#ec4899" opacity=".8" style="animation:voidEye 2s ease-in-out infinite .5s"/><circle cx="48" cy="48" r="0.8" fill="#fff" opacity=".8"/><circle cx="72" cy="48" r="0.8" fill="#fff" opacity=".8"/><path d="M52 66 Q60 72 68 66" fill="none" stroke="#a855f7" stroke-width="0.8" opacity=".5"/></g><g style="animation:voidFloat 8s ease-in-out infinite" opacity=".1"><polygon points="60,5 63,11 69,11 64,15 66,21 60,17 54,21 56,15 51,11 57,11" fill="#a855f7"/></g><g opacity=".08" font-family="monospace" font-size="4" fill="#a855f7"><text x="8" y="100">VOID://</text><text x="75" y="95">NULL</text></g></svg>`)}`,
    name: 'Void Walker',
  },
];

const themes = [
  {
    name: 'Cyberpunk Dark',
    className: 'theme-cyberpunk',
    colors: { primary: '#06b6d4', secondary: '#8b5cf6' },
  },
  {
    name: 'Midnight Azure',
    className: 'theme-azure',
    colors: { primary: '#3b82f6', secondary: '#6366f1' },
  },
  {
    name: 'Neon Matrix',
    className: 'theme-matrix',
    colors: { primary: '#10b981', secondary: '#34d399' },
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as const },
  },
};

type CloudAccount = {
  id: string;
  provider: 'aws' | 'azure' | 'gcp';
  name: string;
  accountId: string;
  synced: string;
};

export const Settings = () => {
  const [activeTab, setActiveTab] = useState('Profile');
  const [saved, setSaved] = useState(false);
  const [avatar, setAvatar] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cyberweb-settings') || '{}').avatar || animatedAvatars[0].url; } catch { return animatedAvatars[0].url; }
  });
  const [displayName, setDisplayName] = useState('Commander Jarvis');
  const [email, setEmail] = useState('admin@cloudguardian.ai');

  const [grokKey, setGrokKey] = useState('');
  const [awsKeyId, setAwsKeyId] = useState('');
  const [awsSecretKey, setAwsSecretKey] = useState('');

  const [selectedTheme, setSelectedTheme] = useState('Cyberpunk Dark');
  const [notifications, setNotifications] = useState([
    { title: 'Email Alerts', desc: 'Receive daily digests and critical alerts via email', icon: Mail, active: true },
    { title: 'Push Notifications', desc: 'Real-time alerts delivered to your browser', icon: Bell, active: true },
    { title: 'SMS Alerts', desc: 'Get text messages for Critical security incidents', icon: Smartphone, active: false },
  ]);
  const [cloudAccounts, setCloudAccounts] = useState<CloudAccount[]>([
    { id: '1', provider: 'aws', name: 'AWS Production Environment', accountId: '123456789012', synced: '2 mins ago' },
    { id: '2', provider: 'azure', name: 'Azure Corporate', accountId: '8765-4321', synced: '5 mins ago' },
  ]);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ provider: 'aws' as CloudAccount['provider'], name: '', accountId: '' });
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('cyberweb-settings');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.theme) setSelectedTheme(data.theme);
        if (data.avatar) setAvatar(data.avatar);
        if (data.displayName) setDisplayName(data.displayName);
        if (data.email) setEmail(data.email);
        if (data.notifications) setNotifications(data.notifications);
        if (data.cloudAccounts) setCloudAccounts(data.cloudAccounts);
      } catch {}
    }
  }, []);

  useEffect(() => {
    const themeData = themes.find(t => t.name === selectedTheme);
    if (themeData) {
      document.documentElement.setAttribute('data-theme', themeData.className);
    }
  }, [selectedTheme]);

  const handleSave = () => {
    const data = {
      theme: selectedTheme,
      avatar,
      displayName,
      email,
      notifications,
      cloudAccounts,
    };
    localStorage.setItem('cyberweb-settings', JSON.stringify(data));
    window.dispatchEvent(new CustomEvent('displayNameChange', { detail: displayName }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleAvatarChange = (url: string) => {
    setAvatar(url);
    window.dispatchEvent(new CustomEvent('avatarChange', { detail: url }));
  };

  const toggleNotification = (idx: number) => {
    setNotifications(prev => prev.map((n, i) => i === idx ? { ...n, active: !n.active } : n));
  };

  const addCloudAccount = () => {
    if (!newAccount.name.trim() || !newAccount.accountId.trim()) return;
    setCloudAccounts(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        provider: newAccount.provider,
        name: newAccount.name,
        accountId: newAccount.accountId,
        synced: 'Just now',
      },
    ]);
    setNewAccount({ provider: 'aws', name: '', accountId: '' });
    setShowAddAccount(false);
  };

  const removeCloudAccount = (id: string) => {
    setCloudAccounts(prev => prev.filter(a => a.id !== id));
  };

  const startEdit = (field: string, value: string) => {
    setEditingField(field);
    setEditValue(value);
  };

  const finishEdit = () => {
    if (editingField === 'displayName' && editValue.trim()) {
      setDisplayName(editValue.trim());
      window.dispatchEvent(new CustomEvent('displayNameChange', { detail: editValue.trim() }));
    }
    if (editingField === 'email' && editValue.includes('@')) setEmail(editValue.trim());
    setEditingField(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'API Keys':
        return (
          <motion.div key="api" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Grok / LLM API Key (For AI Analysis)</label>
              <div className="flex gap-4">
                <input
                  type="password"
                  value={grokKey}
                  onChange={e => setGrokKey(e.target.value)}
                  placeholder="Enter your API key..."
                  className="flex-1 bg-cyber-dark/80 border border-cyber-border rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
                />
                <button className="bg-cyber-dark border border-cyber-border hover:border-neon-cyan px-4 py-2 rounded-lg text-white transition-colors whitespace-nowrap">
                  Test Connection
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">AWS Access Key ID</label>
              <input
                type="text"
                value={awsKeyId}
                onChange={e => setAwsKeyId(e.target.value)}
                placeholder="AKIAIOSFODNN7EXAMPLE"
                className="w-full bg-cyber-dark/80 border border-cyber-border rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">AWS Secret Access Key</label>
              <input
                type="password"
                value={awsSecretKey}
                onChange={e => setAwsSecretKey(e.target.value)}
                placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
                className="w-full bg-cyber-dark/80 border border-cyber-border rounded-lg px-4 py-2 text-white placeholder-gray-600 focus:outline-none focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition-all"
              />
            </div>
          </motion.div>
        );
      case 'Theme':
        return (
          <motion.div key="theme" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {themes.map((theme) => (
                <motion.div
                  key={theme.name}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedTheme(theme.name)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedTheme === theme.name
                      ? 'border-neon-cyan bg-neon-cyan/10 shadow-[0_0_15px_rgba(6,182,212,0.2)]'
                      : 'border-cyber-border bg-cyber-dark/50 hover:border-neon-cyan/50'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Monitor className={`w-5 h-5 ${selectedTheme === theme.name ? 'text-neon-cyan' : 'text-gray-400'}`} />
                    <span className={`font-medium ${selectedTheme === theme.name ? 'text-white' : 'text-gray-400'}`}>{theme.name}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.primary }} />
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors.secondary }} />
                  </div>
                  {selectedTheme === theme.name && (
                    <div className="mt-3 flex items-center gap-1 text-xs text-neon-cyan">
                      <Check className="w-3 h-3" /> Active
                    </div>
                  )}
              </motion.div>
            ))}
            </div>
          </motion.div>
        );
      case 'Notifications':
        return (
          <motion.div key="notif" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            {notifications.map((pref, i) => {
              const Icon = pref.icon;
              return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg border border-cyber-border bg-cyber-dark/50"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded bg-cyber-dark border border-cyber-border">
                    <Icon className="w-5 h-5 text-neon-cyan" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{pref.title}</h4>
                    <p className="text-sm text-gray-400">{pref.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => toggleNotification(i)}
                  className={`w-12 h-6 rounded-full transition-colors relative ${pref.active ? 'bg-neon-cyan' : 'bg-gray-600'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${pref.active ? 'left-7' : 'left-1'}`} />
                </button>
              </motion.div>
              );
            })}
          </motion.div>
        );
      case 'Cloud Accounts':
        return (
          <motion.div key="cloud" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.01 }}
              onClick={() => setShowAddAccount(true)}
              className="w-full py-4 rounded-lg border border-dashed border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/10 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add New Cloud Account
            </motion.button>
            <AnimatePresence>
              {showAddAccount && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-lg border border-neon-cyan/30 bg-cyber-dark/80 space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-white font-medium">New Cloud Account</h4>
                      <button onClick={() => setShowAddAccount(false)} className="text-gray-400 hover:text-white transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Provider</label>
                      <select
                        value={newAccount.provider}
                        onChange={e => setNewAccount(prev => ({ ...prev, provider: e.target.value as CloudAccount['provider'] }))}
                        className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-neon-cyan"
                      >
                        <option value="aws">AWS</option>
                        <option value="azure">Azure</option>
                        <option value="gcp">GCP</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Account Name</label>
                      <input
                        type="text"
                        value={newAccount.name}
                        onChange={e => setNewAccount(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g. AWS Staging"
                        className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-neon-cyan"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Account ID</label>
                      <input
                        type="text"
                        value={newAccount.accountId}
                        onChange={e => setNewAccount(prev => ({ ...prev, accountId: e.target.value }))}
                        placeholder="e.g. 123456789012"
                        className="w-full bg-cyber-dark border border-cyber-border rounded-lg px-3 py-2 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-neon-cyan"
                      />
                    </div>
                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={addCloudAccount}
                        disabled={!newAccount.name.trim() || !newAccount.accountId.trim()}
                        className="flex-1 py-2 bg-gradient-to-r from-neon-blue to-neon-purple rounded-lg text-white text-sm font-medium disabled:opacity-50 transition-opacity"
                      >
                        Add Account
                      </button>
                      <button
                        onClick={() => setShowAddAccount(false)}
                        className="px-4 py-2 border border-cyber-border rounded-lg text-gray-400 text-sm hover:text-white transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {cloudAccounts.length === 0 && (
              <div className="text-center py-8 text-gray-500 text-sm">No cloud accounts configured yet.</div>
            )}
            {cloudAccounts.map((acct, i) => (
              <motion.div
                key={acct.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="p-4 rounded-lg border border-cyber-border bg-cyber-dark/50 flex items-center justify-between group"
              >
                <div className="flex items-center gap-4">
                  <Cloud className="w-6 h-6" style={{
                    color: acct.provider === 'aws' ? '#ff9900' : acct.provider === 'azure' ? '#0089D6' : '#EA4335',
                  }} />
                  <div>
                    <h4 className="text-white font-medium">{acct.name}</h4>
                    <p className="text-sm text-gray-400">
                      <span className="uppercase text-xs font-mono mr-2 opacity-60">{acct.provider}</span>
                      ID: {acct.accountId} • Last Synced: {acct.synced}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeCloudAccount(acct.id)}
                  className="text-gray-500 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            ))}
          </motion.div>
        );
      case 'Profile':
        return (
          <motion.div key="profile" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
            <div className="flex flex-col gap-4 mb-6">
              <label className="block text-sm font-medium text-gray-400">Select Hacker Avatar</label>
              <div className="flex gap-4 flex-wrap">
                {animatedAvatars.map((ava) => (
                  <button
                    key={ava.id}
                    onClick={() => handleAvatarChange(ava.url)}
                    className={`relative flex flex-col items-center gap-2 p-2 rounded-xl border-2 transition-all bg-cyber-dark ${
                      avatar === ava.url
                        ? 'border-neon-cyan shadow-[0_0_20px_rgba(6,182,212,0.5)] scale-110'
                        : 'border-cyber-border hover:border-neon-cyan/50 hover:scale-105'
                    }`}
                  >
                    <div className="w-16 h-16 rounded-full overflow-hidden">
                      <img src={ava.url} alt={ava.name} className="w-full h-full object-cover" />
                    </div>
                    <span className="text-[10px] text-gray-400 font-mono whitespace-nowrap">{ava.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Display Name</label>
                {editingField === 'displayName' ? (
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={finishEdit}
                    onKeyDown={e => e.key === 'Enter' && finishEdit()}
                    autoFocus
                    className="w-full bg-cyber-dark/80 border border-neon-cyan rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-neon-cyan transition-all"
                  />
                ) : (
                  <div
                    onClick={() => startEdit('displayName', displayName)}
                    className="w-full bg-cyber-dark/80 border border-cyber-border rounded-lg px-4 py-2 text-white cursor-pointer hover:border-neon-cyan/50 transition-all flex items-center justify-between group"
                  >
                    <span>{displayName}</span>
                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Click to edit</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
                {editingField === 'email' ? (
                  <input
                    type="email"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onBlur={finishEdit}
                    onKeyDown={e => e.key === 'Enter' && finishEdit()}
                    autoFocus
                    className="w-full bg-cyber-dark/80 border border-neon-cyan rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-neon-cyan transition-all"
                  />
                ) : (
                  <div
                    onClick={() => startEdit('email', email)}
                    className="w-full bg-cyber-dark/80 border border-cyber-border rounded-lg px-4 py-2 text-white cursor-pointer hover:border-neon-cyan/50 transition-all flex items-center justify-between group"
                  >
                    <span>{email}</span>
                    <span className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity">Click to edit</span>
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Role</label>
              <input type="text" value="System Administrator" disabled className="w-full bg-cyber-darker border border-cyber-border rounded-lg px-4 py-2 text-gray-500 cursor-not-allowed" />
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-5xl">
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <SettingsIcon className="text-neon-cyan w-8 h-8" />
          System Preferences
        </h1>
        <p className="text-gray-400">Manage your CLOUDCORE X configuration and integrations.</p>
      </motion.div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <motion.div variants={itemVariants} className="space-y-2">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-all ${
                activeTab === tab ? 'bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30' : 'text-gray-400 hover:bg-cyber-dark/50 border border-transparent'
              }`}
            >
              {i === 0 && <Key className="w-5 h-5" />}
              {i === 1 && <Layout className="w-5 h-5" />}
              {i === 2 && <Bell className="w-5 h-5" />}
              {i === 3 && <Cloud className="w-5 h-5" />}
              {i === 4 && <User className="w-5 h-5" />}
              {tab}
            </button>
          ))}
        </motion.div>
        <motion.div variants={itemVariants} className="md:col-span-3 space-y-6">
          <div className="bg-cyber-card border border-cyber-border rounded-xl shadow-[0_0_15px_rgba(56,189,248,0.1)] p-6 min-h-[400px] flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white mb-6 border-b border-cyber-border pb-4">{activeTab}</h2>
              <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
            </div>
            <div className="mt-8 pt-6 border-t border-cyber-border flex justify-end shrink-0">
              <motion.button
                onClick={handleSave}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${
                  saved ? 'bg-neon-green text-cyber-dark' : 'bg-neon-cyan text-cyber-dark hover:bg-neon-cyan/90'
                }`}
              >
                {saved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
                {saved ? 'Saved Successfully' : 'Save Changes'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
