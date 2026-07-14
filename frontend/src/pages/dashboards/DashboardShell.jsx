import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Home, Heart, Search, User, Bell, MessageSquare, LogOut, Settings, Building2, Users, Shield, PlusCircle, BarChart3, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DashboardShell = ({ children, title, subtitle, role }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();

  const menus = {
    user: [
      { icon: Home, label: 'Overview', path: '/dashboard/user' },
      { icon: Heart, label: 'Shortlisted', path: '/dashboard/user' },
      { icon: Search, label: 'Saved Searches', path: '/dashboard/user' },
      { icon: MessageSquare, label: 'Enquiries', path: '/dashboard/user' },
      { icon: PlusCircle, label: 'Post Property', path: '/post-property' }
    ],
    agent: [
      { icon: BarChart3, label: 'Overview', path: '/dashboard/agent' },
      { icon: Building2, label: 'My Listings', path: '/dashboard/agent' },
      { icon: Users, label: 'Leads', path: '/dashboard/agent' },
      { icon: MessageSquare, label: 'Enquiries', path: '/dashboard/agent' },
      { icon: PlusCircle, label: 'Post Property', path: '/post-property' }
    ],
    super_admin: [
      { icon: BarChart3, label: 'Overview', path: '/dashboard/admin' },
      { icon: Users, label: 'Users', path: '/dashboard/admin' },
      { icon: Building2, label: 'Properties', path: '/dashboard/admin' },
      { icon: Shield, label: 'Verification', path: '/dashboard/admin' },
      { icon: FileText, label: 'Reports', path: '/dashboard/admin' },
      { icon: Settings, label: 'Settings', path: '/dashboard/admin' }
    ]
  };

  const menu = menus[role] || menus.user;
  const roleColor = { user: '#0F6B54', agent: '#D4A24C', super_admin: '#0E1B1F' }[role];

  return (
    <div className="min-h-screen flex" style={{ background: '#F5F1E8' }}>
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col">
        <Link to="/" className="p-6 flex items-center gap-3 border-b border-slate-100">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-serif text-xl shadow-lg" style={{ background: '#0F6B54' }}>B</div>
          <div>
            <div className="font-serif text-xl font-bold" style={{ color: '#0F6B54' }}>Bahubali</div>
            <div className="text-[10px] tracking-[0.2em] text-slate-500 uppercase">Property</div>
          </div>
        </Link>

        <div className="p-4 flex-1">
          <div className="px-3 py-3 mb-4 rounded-xl" style={{ background: '#F5F1E8' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ background: roleColor, color: role === 'agent' ? '#0E1B1F' : 'white' }}>
                {user?.name?.[0] || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm truncate">{user?.name}</div>
                <div className="text-[11px] text-slate-500 capitalize">{role?.replace('_', ' ')}</div>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {menu.map((item, i) => (
              <button key={item.label} onClick={() => navigate(item.path)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-left transition-colors ${i === 0 ? 'text-white' : 'text-slate-700 hover:bg-emerald-50'}`} style={{ background: i === 0 ? '#0F6B54' : 'transparent' }}>
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100">
          <button onClick={() => { logout(); navigate('/'); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-hidden">
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="font-serif text-2xl font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-sm text-slate-600">{subtitle}</p>}
          </div>
          <div className="flex items-center gap-2">
            <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full" style={{ background: '#D4A24C' }} />
            </button>
            <Link to="/" className="px-4 py-2 rounded-lg text-sm font-semibold text-white" style={{ background: '#0F6B54' }}>Back to Site</Link>
          </div>
        </header>
        <div className="p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export const StatCard = ({ icon: Icon, label, value, change, color = '#0F6B54' }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-100">
    <div className="flex items-start justify-between mb-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${color}15` }}>
        <Icon className="w-5 h-5" style={{ color }} />
      </div>
      {change && <span className="text-xs font-semibold" style={{ color: change > 0 ? '#0F6B54' : '#dc2626' }}>{change > 0 ? '+' : ''}{change}%</span>}
    </div>
    <div className="font-serif text-3xl font-bold text-slate-900">{value}</div>
    <div className="text-sm text-slate-500 mt-1">{label}</div>
  </div>
);
