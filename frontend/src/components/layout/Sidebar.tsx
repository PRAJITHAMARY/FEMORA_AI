import React from 'react';
import { Logo } from '../common/Logo';
import {
  Home,
  LayoutDashboard,
  Calendar,
  Activity,
  Heart,
  Sparkles,
  Bot,
  BookOpen,
  FileText,
  History,
  User,
  LogOut,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, onLogout }) => {
  const navItems = [
    { id: 'landing', label: 'Home', icon: Home, badge: null },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'cycle', label: 'Cycle', icon: Calendar, badge: '🩸' },
    { id: 'symptoms', label: 'Symptoms', icon: Activity, badge: '📝' },
    { id: 'lifestyle', label: 'Wellness', icon: Heart, badge: '🌿' },
    { id: 'insights', label: 'Insights', icon: Sparkles, badge: '✨' },
    { id: 'chat', label: 'Femora AI', icon: Bot, badge: '🌸' },
    { id: 'knowledge', label: 'Knowledge', icon: BookOpen, badge: '📚' },
    { id: 'summary', label: 'Health Summary', icon: FileText, badge: '📄' },
    { id: 'history', label: 'History', icon: History, badge: '💬' },
    { id: 'profile', label: 'My Profile', icon: User, badge: null },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[#EDE3E0] bg-[#FFF9F5] h-screen sticky top-0 p-6 overflow-y-auto">
      {/* Brand Logo */}
      <div className="mb-8 pl-2" onClick={() => setActiveTab('dashboard')}>
        <Logo size="md" />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1.5">
        <div className="text-[11px] font-semibold tracking-wider text-[#766D70] uppercase px-3 mb-2">
          Wellness Hub
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-medium transition-all ${
                isActive
                  ? 'bg-gradient-to-r from-[#E8B4B8]/20 to-[#C9B8D9]/20 text-[#403A3D] font-semibold border border-[#E8B4B8]/40 shadow-2xs'
                  : 'text-[#766D70] hover:text-[#403A3D] hover:bg-white/70'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E8B4B8]' : 'text-[#766D70]'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && <span className="text-xs">{item.badge}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom Safety & Logout Widget */}
      <div className="mt-8 pt-4 border-t border-[#EDE3E0] space-y-3">
        <div className="bg-white/80 border border-[#EDE3E0] rounded-2xl p-3 text-[11px] text-[#766D70] space-y-1">
          <div className="flex items-center gap-1.5 text-[#403A3D] font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-[#B8C9B3]" />
            <span>Private & Encrypted</span>
          </div>
          <p className="text-[10px] text-[#766D70]/80">Your health data is isolated & non-diagnostic.</p>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-medium text-[#766D70] hover:text-red-500 hover:bg-red-50/50 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
