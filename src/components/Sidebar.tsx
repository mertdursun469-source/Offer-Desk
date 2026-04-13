'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import AppLogo from '@/components/ui/AppLogo';
import {
  Inbox,
  FileText,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Settings,
  BarChart2,
} from 'lucide-react';
import Icon from '@/components/ui/AppIcon';


interface SidebarProps {
  currentPath: string;
}

const navItems = [
  {
    key: 'nav-inbox',
    href: '/request-inbox',
    icon: Inbox,
    label: 'Request Inbox',
    badge: 4,
    group: 'main',
  },
  {
    key: 'nav-offer',
    href: '/offer-builder',
    icon: FileText,
    label: 'Offer Builder',
    badge: null,
    group: 'main',
  },
  {
    key: 'nav-rooms',
    href: '/room-type-management',
    icon: BedDouble,
    label: 'Room Types',
    badge: null,
    group: 'main',
  },
  {
    key: 'nav-analytics',
    href: '/analytics',
    icon: BarChart2,
    label: 'Analytics',
    badge: null,
    group: 'main',
  },
];

export default function Sidebar({ currentPath }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className="relative flex flex-col shrink-0 transition-all duration-300 ease-in-out scrollbar-thin overflow-y-auto"
      style={{
        width: collapsed ? 64 : 240,
        backgroundColor: '#2D2438',
        borderRight: '1px solid rgba(92, 74, 110, 0.3)',
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center px-4 py-5 shrink-0"
        style={{
          borderBottom: '1px solid rgba(92, 74, 110, 0.2)',
          minHeight: 64,
        }}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <AppLogo size={32} />
          {!collapsed && (
            <div className="overflow-hidden whitespace-nowrap">
              <span
                className="font-display text-lg font-semibold tracking-wide"
                style={{ color: '#FFFFFF' }}
              >
                OfferDesk
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Collapse Toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-16 z-10 flex items-center justify-center w-6 h-6 rounded-full transition-all duration-150 hover:scale-110"
        style={{
          backgroundColor: '#2D2438',
          border: '1px solid rgba(92, 74, 110, 0.4)',
          color: '#8A7A6A',
        }}
        aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <ChevronRight size={12} />
        ) : (
          <ChevronLeft size={12} />
        )}
      </button>

      {/* Nav Items */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {!collapsed && (
          <p
            className="section-label px-3 pb-2"
            style={{ color: 'rgba(201, 169, 110, 0.6)' }}
          >
            Navigation
          </p>
        )}
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.href || currentPath.startsWith(item.href + '/');
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative ${
                isActive ? 'active' : ''
              }`}
              style={{
                backgroundColor: isActive
                  ? 'rgba(92, 74, 110, 0.25)'
                  : 'transparent',
                color: isActive ? '#DFC08A' : '#9A8A7A',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    'rgba(92, 74, 110, 0.12)';
                  (e.currentTarget as HTMLElement).style.color = '#C9A96E';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.backgroundColor =
                    'transparent';
                  (e.currentTarget as HTMLElement).style.color = '#9A8A7A';
                }
              }}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge !== null && (
                    <span
                      className="flex items-center justify-center w-5 h-5 rounded-full text-xs font-semibold tabular-nums"
                      style={{
                        backgroundColor: '#C9A96E',
                        color: '#2D2438',
                        fontSize: 10,
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {/* Tooltip for collapsed state */}
              {collapsed && (
                <div
                  className="absolute left-full ml-2 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50"
                  style={{
                    backgroundColor: '#2D2438',
                    color: '#DFC08A',
                    border: '1px solid rgba(92, 74, 110, 0.4)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  }}
                >
                  {item.label}
                  {item.badge !== null && (
                    <span
                      className="ml-1.5 px-1.5 py-0.5 rounded-full text-xs"
                      style={{ backgroundColor: '#C9A96E', color: '#2D2438' }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings */}
      <div
        className="px-2 py-4 space-y-1"
        style={{ borderTop: '1px solid rgba(92, 74, 110, 0.2)' }}
      >
        <Link
          href="/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group relative"
          style={{ color: '#9A8A7A' }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(92, 74, 110, 0.12)';
            (e.currentTarget as HTMLElement).style.color = '#C9A96E';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
            (e.currentTarget as HTMLElement).style.color = '#9A8A7A';
          }}
        >
          <Settings size={18} className="shrink-0" />
          {!collapsed && <span>Settings</span>}
          {collapsed && (
            <div
              className="absolute left-full ml-2 px-2.5 py-1.5 rounded-md text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-150 z-50"
              style={{
                backgroundColor: '#2D2438',
                color: '#DFC08A',
                border: '1px solid rgba(92, 74, 110, 0.4)',
              }}
            >
              Settings
            </div>
          )}
        </Link>

        {/* User */}
        {!collapsed && (
          <div
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg mt-1"
            style={{ backgroundColor: 'rgba(92, 74, 110, 0.12)' }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
              style={{ backgroundColor: '#C9A96E', color: '#2D2438' }}
            >
              AK
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-semibold truncate" style={{ color: '#DFC08A' }}>
                Ayşe Kaya
              </p>
              <p className="text-xs truncate" style={{ color: '#6A5A4A' }}>
                Reservations Manager
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center px-3 py-2">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{ backgroundColor: '#C9A96E', color: '#2D2438' }}
            >
              AK
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}