import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Phone, ChevronDown, User, LogOut, LayoutDashboard, Scale, Home, Search } from 'lucide-react';
import { MEGA_MENU } from '../mock';
import { useAuth } from '../context/AuthContext';
import { useCompare } from '../context/CompareContext';
import { Button } from './ui/button';

const Header = () => {
  const [open, setOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [userMenu, setUserMenu] = useState(false);
  const { user, logout } = useAuth();
  const { items: compareItems } = useCompare();
  const navigate = useNavigate();

  const dashboardPath = user?.role === 'super_admin' ? '/dashboard/admin' : user?.role === 'agent' ? '/dashboard/agent' : '/dashboard/user';

  return (
    <>
      {/* Top strip */}
      <div className="bg-brand-emerald-dark text-white text-xs overflow-hidden hidden md:block" style={{ background: '#094836' }}>
        <div className="flex whitespace-nowrap animate-marquee py-2">
          {[0, 1].map(i => (
            <div key={i} className="flex shrink-0 gap-16 pr-16">
              <span>🏠 Advertising, Marketing, Sales, Branding &amp; Promotion solely on bahubaliproperty.com</span>
              <span>🏢 New Listings Added Daily</span>
              <span>📞 +91 9011037538</span>
              <span>✉️ info@bahubaliproperty.com</span>
            </div>
          ))}
        </div>
      </div>

      <header className="sticky top-0 z-50 glass border-b border-emerald-900/10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-xl bg-brand-emerald flex items-center justify-center text-white font-serif text-xl shadow-lg group-hover:scale-105 transition-transform" style={{ background: '#0F6B54' }}>
                B
              </div>
              <div className="leading-tight">
                <div className="font-serif text-xl font-bold brand-emerald" style={{ color: '#0F6B54' }}>Bahubali</div>
                <div className="text-[10px] tracking-[0.2em] text-slate-500 uppercase">Property</div>
              </div>
            </Link>

            {/* Desktop menu */}
            <nav className="hidden lg:flex items-center gap-1">
              {MEGA_MENU.map((menu) => (
                <div
                  key={menu.label}
                  className="relative"
                  onMouseEnter={() => setActiveMenu(menu.label)}
                  onMouseLeave={() => setActiveMenu(null)}
                >
                  <button className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-brand-emerald flex items-center gap-1 transition-colors" style={{ color: activeMenu === menu.label ? '#0F6B54' : undefined }}>
                    {menu.label} <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  {activeMenu === menu.label && (
                    <div className="absolute top-full left-0 pt-2 z-50">
                      <div className="bg-white rounded-xl shadow-2xl border border-emerald-100 py-2 min-w-[240px] animate-fade-up">
                        {menu.items.map(item => (
                          <Link
                            key={item}
                            to={`/properties?type=${encodeURIComponent(item)}`}
                            className="block px-4 py-2.5 text-sm text-slate-700 hover:bg-emerald-50 hover:text-brand-emerald transition-colors"
                          >
                            {item}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2 lg:gap-3">
              <Link to="/compare" className="relative hidden md:flex items-center gap-1.5 px-3 py-2 text-sm text-slate-700 hover:text-brand-emerald transition-colors">
                <Scale className="w-4 h-4" />
                <span>Compare</span>
                {compareItems.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-gold text-slate-900 text-[10px] font-bold flex items-center justify-center" style={{ background: '#D4A24C' }}>
                    {compareItems.length}
                  </span>
                )}
              </Link>

              <a href="tel:+919011037538" className="hidden xl:flex items-center gap-1.5 text-sm font-medium text-slate-700">
                <Phone className="w-4 h-4 brand-emerald" style={{ color: '#0F6B54' }} /> +91 9011037538
              </a>

              {user ? (
                <div className="relative">
                  <button onClick={() => setUserMenu(!userMenu)} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 transition-colors">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ background: '#0F6B54' }}>
                      {user.name?.[0] || 'U'}
                    </div>
                    <span className="text-sm font-medium text-slate-800 hidden md:inline">{user.name?.split(' ')[0]}</span>
                  </button>
                  {userMenu && (
                    <div className="absolute right-0 top-full mt-2 bg-white rounded-xl shadow-2xl border border-emerald-100 py-2 min-w-[220px] z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <div className="font-semibold text-slate-800">{user.name}</div>
                        <div className="text-xs text-slate-500 capitalize">{user.role.replace('_', ' ')}</div>
                      </div>
                      <button onClick={() => { navigate(dashboardPath); setUserMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-emerald-50">
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                      </button>
                      <button onClick={() => { navigate('/post-property'); setUserMenu(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-emerald-50">
                        <Home className="w-4 h-4" /> Post Property
                      </button>
                      <button onClick={() => { logout(); setUserMenu(false); navigate('/'); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="text-slate-700 hidden md:inline-flex hover:text-brand-emerald hover:bg-emerald-50">Sign In</Button>
                  </Link>
                  <Link to="/post-property">
                    <Button className="text-slate-900 font-semibold shadow-md hover:shadow-lg" style={{ background: '#D4A24C' }}>Post Property</Button>
                  </Link>
                </>
              )}

              <button className="lg:hidden p-2" onClick={() => setOpen(!open)}>
                {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="lg:hidden bg-white border-t border-slate-200 max-h-[70vh] overflow-y-auto">
            {MEGA_MENU.map(menu => (
              <div key={menu.label} className="border-b border-slate-100">
                <div className="px-4 py-3 font-semibold text-slate-800 bg-slate-50">{menu.label}</div>
                {menu.items.map(i => (
                  <Link key={i} to={`/properties?type=${encodeURIComponent(i)}`} onClick={() => setOpen(false)} className="block px-6 py-2 text-sm text-slate-600 hover:bg-emerald-50">{i}</Link>
                ))}
              </div>
            ))}
            <div className="p-4 flex gap-2">
              <Link to="/login" className="flex-1"><Button variant="outline" className="w-full">Sign In</Button></Link>
              <Link to="/compare" className="flex-1"><Button variant="outline" className="w-full">Compare ({compareItems.length})</Button></Link>
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
