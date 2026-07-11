import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings as SettingsIcon, Key, Bell, User, Layout, Save, Check, Cloud, Monitor, Mail, Smartphone, Plus, X, Trash2 } from 'lucide-react';

const tabs = ['API Keys', 'Theme', 'Notifications', 'Cloud Accounts', 'Profile'];

const animatedAvatars = [
  { id: 'robot', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.webp', name: 'Bot AI' },
  { id: 'alien', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f47d/512.webp', name: 'Alien' },
  { id: 'ghost', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f47b/512.webp', name: 'Phantom' },
  { id: 'invader', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f47e/512.webp', name: 'Invader' },
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
  const [avatar, setAvatar] = useState(animatedAvatars[0].url);
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
              <label className="block text-sm font-medium text-gray-400">Select Animated Avatar</label>
              <div className="flex gap-4">
                {animatedAvatars.map((ava) => (
                  <button
                    key={ava.id}
                    onClick={() => handleAvatarChange(ava.url)}
                    className={`relative w-20 h-20 rounded-full border-2 transition-all p-1 bg-cyber-dark ${
                      avatar === ava.url
                        ? 'border-neon-cyan shadow-[0_0_15px_rgba(6,182,212,0.5)] scale-110'
                        : 'border-cyber-border hover:border-neon-cyan/50 hover:scale-105'
                    }`}
                  >
                    <img src={ava.url} alt={ava.name} className="w-full h-full object-contain drop-shadow-[0_0_8px_rgba(6,182,212,0.3)]" />
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
          <div className="glass-panel p-6 min-h-[400px] flex flex-col justify-between">
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
