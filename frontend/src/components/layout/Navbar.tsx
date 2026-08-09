import { Logo } from '../common/Logo';
import { Sparkles } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isLoggedIn: boolean;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout?: () => void;
  userName?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLoggedIn,
  onOpenAuth,
  userName = 'Elena',
}) => {
  const publicNavLinks = [
    { id: 'landing', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how-it-works', label: 'How It Works' },
    { id: 'knowledge', label: 'Knowledge Hub' },
    { id: 'chat', label: 'Femora AI' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F5]/90 backdrop-blur-md border-b border-[#EDE3E0] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div onClick={() => setActiveTab(isLoggedIn ? 'dashboard' : 'landing')}>
          <Logo size="md" />
        </div>

        {/* Public Nav Links (When viewing Landing Page or Not Logged In) */}
        {!isLoggedIn && (
          <nav className="hidden md:flex items-center gap-8">
            {publicNavLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                className={`text-sm font-medium transition-colors ${
                  activeTab === link.id ? 'text-[#403A3D] font-semibold border-b-2 border-[#E8B4B8] pb-1' : 'text-[#766D70] hover:text-[#403A3D]'
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>
        )}

        {/* Right CTA / Auth Controls */}
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-[#E8B4B8] text-white shadow-xs'
                    : 'bg-[#FFFFFF] border border-[#EDE3E0] text-[#403A3D] hover:bg-[#FFF9F5]'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('profile')}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-white border border-[#EDE3E0] hover:border-[#E8B4B8] transition-all text-xs font-medium text-[#403A3D]"
              >
                <div className="w-6 h-6 rounded-full bg-[#C9B8D9]/40 flex items-center justify-center text-xs text-[#403A3D] font-bold">
                  {userName.charAt(0)}
                </div>
                <span className="hidden md:inline">{userName}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 rounded-full text-xs font-medium text-[#403A3D] hover:bg-white/60 border border-transparent hover:border-[#EDE3E0] transition-all"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-[#E8B4B8] to-[#C9B8D9] hover:opacity-95 shadow-sm transition-all transform active:scale-95"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
