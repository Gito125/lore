'use client';

import { useState, useEffect } from 'react';

interface UserSettings {
  theme: string;
  serendipityLevel: number;
  notifications: boolean;
}

export function SettingsClient({ initialSettings }: { initialSettings: UserSettings | null }) {
  const [settings, setSettings] = useState<UserSettings>(initialSettings || {
    theme: 'midnight',
    serendipityLevel: 30,
    notifications: true
  });
  const [saving, setSaving] = useState(false);

  // Apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  const updateSetting = async (key: keyof UserSettings, value: string | number | boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    setSaving(true);
    
    try {
      await fetch('/api/user/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: value })
      });
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <h2 className="text-sm font-mono text-(--text-muted) uppercase tracking-widest border-b border-(--border) pb-2">Appearance</h2>
        <div className="p-4 rounded-xl border border-(--border) bg-[rgba(255,255,255,0.01)] flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <p className="text-(--text-primary) font-medium">Theme</p>
            <p className="text-(--text-secondary) text-sm">Select your preferred visual style</p>
          </div>
          <select 
            value={settings.theme}
            onChange={(e) => updateSetting('theme', e.target.value)}
            disabled={saving}
            className="bg-[rgba(255,255,255,0.05)] border border-(--border) rounded-lg px-3 py-2 text-sm text-(--text-primary) outline-none focus:border-(--accent) cursor-pointer"
          >
            <option value="midnight">Midnight (Default)</option>
            <option value="obsidian">Obsidian</option>
            <option value="parchment">Parchment</option>
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-mono text-(--text-muted) uppercase tracking-widest border-b border-(--border) pb-2">Algorithm</h2>
        <div className="p-4 rounded-xl border border-(--border) bg-[rgba(255,255,255,0.01)] flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-(--text-primary) font-medium">Serendipity Level</p>
              <p className="text-(--text-secondary) text-sm">How often to show unexpected topics</p>
            </div>
            <span className="text-sm font-mono text-(--accent)">{settings.serendipityLevel}%</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={settings.serendipityLevel}
            onChange={(e) => updateSetting('serendipityLevel', parseInt(e.target.value))}
            disabled={saving}
            className="w-full accent-(--accent) cursor-pointer" 
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-mono text-(--text-muted) uppercase tracking-widest border-b border-(--border) pb-2">Notifications</h2>
        <div className="p-4 rounded-xl border border-(--border) bg-[rgba(255,255,255,0.01)] flex items-center justify-between">
          <div>
            <p className="text-(--text-primary) font-medium">Weekly Digest</p>
            <p className="text-(--text-secondary) text-sm">Receive a weekly summary of your reading journey</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer"
              checked={settings.notifications}
              onChange={(e) => updateSetting('notifications', e.target.checked)}
              disabled={saving}
            />
            <div className="w-11 h-6 bg-[rgba(255,255,255,0.1)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-(--accent)"></div>
          </label>
        </div>
      </section>
    </div>
  );
}
