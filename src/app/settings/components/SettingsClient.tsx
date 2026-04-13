'use client';
import React, { useState } from 'react';
import {
  Settings,
  Bell,
  User,
  Shield,
  CheckCircle,
  ChevronRight,
  Globe,
  Building2,
  Palette,
} from 'lucide-react';

interface ToggleProps {
  enabled: boolean;
  onChange: (val: boolean) => void;
}

function Toggle({ enabled, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none"
      style={{ backgroundColor: enabled ? '#C9A96E' : 'rgba(92, 74, 110, 0.25)' }}
      aria-pressed={enabled}
    >
      <span
        className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200"
        style={{ transform: enabled ? 'translateX(24px)' : 'translateX(4px)' }}
      />
    </button>
  );
}

interface SectionCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

function SectionCard({ title, description, icon, children }: SectionCardProps) {
  return (
    <div
      className="rounded-xl p-6"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid rgba(92, 74, 110, 0.15)',
        boxShadow: '0 1px 4px rgba(45, 36, 56, 0.06)',
      }}
    >
      <div className="flex items-start gap-3 mb-5">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
          style={{ backgroundColor: 'rgba(201, 169, 110, 0.12)' }}
        >
          {icon}
        </div>
        <div>
          <h2 className="text-base font-semibold" style={{ color: '#2D2438' }}>
            {title}
          </h2>
          {description && (
            <p className="text-sm mt-0.5" style={{ color: '#6A5A4A' }}>
              {description}
            </p>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SettingsClient() {
  const [notifications, setNotifications] = useState({
    newRequest: true,
    offerSent: true,
    offerOpened: false,
    dailyDigest: true,
    weeklyReport: false,
  });

  const [general, setGeneral] = useState({
    hotelName: 'Grand Palace Hotel',
    currency: 'EUR',
    language: 'tr',
    timezone: 'Europe/Istanbul',
  });

  const [saved, setSaved] = useState(false);

  const handleSaveGeneral = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen p-6 md:p-8" style={{ backgroundColor: '#F5F0E8' }}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Settings size={20} style={{ color: '#C9A96E' }} />
          <h1 className="text-2xl font-bold" style={{ color: '#2D2438', fontFamily: 'Georgia, serif' }}>
            Settings
          </h1>
        </div>
        <p className="text-sm" style={{ color: '#6A5A4A' }}>
          Manage your account, integrations, and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl">

        {/* Notifications */}
        <SectionCard
          title="Notifications"
          description="Choose which events trigger email or in-app notifications."
          icon={<Bell size={18} style={{ color: '#C9A96E' }} />}
        >
          <div className="space-y-3">
            {[
              { key: 'newRequest', label: 'New reservation request received' },
              { key: 'offerSent', label: 'Offer successfully sent' },
              { key: 'offerOpened', label: 'Offer opened by guest' },
              { key: 'dailyDigest', label: 'Daily inbox digest' },
              { key: 'weeklyReport', label: 'Weekly performance report' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-1">
                <span className="text-sm" style={{ color: '#4A3A2A' }}>{item.label}</span>
                <Toggle
                  enabled={notifications[item.key as keyof typeof notifications]}
                  onChange={(val) =>
                    setNotifications((prev) => ({ ...prev, [item.key]: val }))
                  }
                />
              </div>
            ))}
          </div>
        </SectionCard>

        {/* General / Hotel Info */}
        <SectionCard
          title="Hotel Information"
          description="Basic details used in offer templates and communications."
          icon={<Building2 size={18} style={{ color: '#C9A96E' }} />}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A5A4A' }}>
                Hotel Name
              </label>
              <input
                type="text"
                value={general.hotelName}
                onChange={(e) => setGeneral((p) => ({ ...p, hotelName: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none transition-all"
                style={{
                  backgroundColor: '#F5F0E8',
                  border: '1px solid rgba(92, 74, 110, 0.2)',
                  color: '#2D2438',
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A5A4A' }}>
                  Currency
                </label>
                <select
                  value={general.currency}
                  onChange={(e) => setGeneral((p) => ({ ...p, currency: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    backgroundColor: '#F5F0E8',
                    border: '1px solid rgba(92, 74, 110, 0.2)',
                    color: '#2D2438',
                  }}
                >
                  <option value="EUR">EUR €</option>
                  <option value="USD">USD $</option>
                  <option value="TRY">TRY ₺</option>
                  <option value="GBP">GBP £</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A5A4A' }}>
                  Language
                </label>
                <select
                  value={general.language}
                  onChange={(e) => setGeneral((p) => ({ ...p, language: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                  style={{
                    backgroundColor: '#F5F0E8',
                    border: '1px solid rgba(92, 74, 110, 0.2)',
                    color: '#2D2438',
                  }}
                >
                  <option value="tr">Türkçe</option>
                  <option value="en">English</option>
                  <option value="de">Deutsch</option>
                  <option value="fr">Français</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: '#6A5A4A' }}>
                Timezone
              </label>
              <select
                value={general.timezone}
                onChange={(e) => setGeneral((p) => ({ ...p, timezone: e.target.value }))}
                className="w-full px-3 py-2 rounded-lg text-sm outline-none"
                style={{
                  backgroundColor: '#F5F0E8',
                  border: '1px solid rgba(92, 74, 110, 0.2)',
                  color: '#2D2438',
                }}
              >
                <option value="Europe/Istanbul">Europe/Istanbul (UTC+3)</option>
                <option value="Europe/London">Europe/London (UTC+0)</option>
                <option value="Europe/Berlin">Europe/Berlin (UTC+1)</option>
                <option value="America/New_York">America/New_York (UTC-5)</option>
              </select>
            </div>
            <button
              onClick={handleSaveGeneral}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 hover:opacity-90"
              style={{ backgroundColor: '#5C4A6E', color: '#FFFFFF' }}
            >
              {saved ? <CheckCircle size={15} /> : <Shield size={15} />}
              {saved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </SectionCard>

        {/* Account */}
        <SectionCard
          title="Account"
          description="Manage your profile and security settings."
          icon={<User size={18} style={{ color: '#C9A96E' }} />}
        >
          <div className="space-y-2">
            {[
              { label: 'Edit Profile', icon: <User size={15} /> },
              { label: 'Change Password', icon: <Shield size={15} /> },
              { label: 'Appearance & Theme', icon: <Palette size={15} /> },
              { label: 'Language & Region', icon: <Globe size={15} /> },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group"
                style={{ color: '#4A3A2A' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(92, 74, 110, 0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
                }}
              >
                <div className="flex items-center gap-2.5">
                  <span style={{ color: '#9A8A7A' }}>{item.icon}</span>
                  {item.label}
                </div>
                <ChevronRight size={14} style={{ color: '#9A8A7A' }} />
              </button>
            ))}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
