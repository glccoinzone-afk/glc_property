import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Home, Shield, User, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [role, setRole] = useState('user');

  const handleLogin = (e) => {
    e.preventDefault();
    const res = login(email, password);
    if (res.success) {
      toast.success(`Welcome back, ${res.user.name}!`);
      const path = res.user.role === 'super_admin' ? '/dashboard/admin' : res.user.role === 'agent' ? '/dashboard/agent' : '/dashboard/user';
      navigate(path);
    } else {
      toast.error(res.error);
    }
  };

  const quickFill = (r) => {
    if (r === 'super_admin') { setEmail('admin@bahubali.com'); setPassword('admin123'); }
    if (r === 'agent') { setEmail('agent@bahubali.com'); setPassword('agent123'); }
    if (r === 'user') { setEmail('user@bahubali.com'); setPassword('user123'); }
  };

  const roles = [
    { id: 'user', label: 'User / Buyer', icon: User },
    { id: 'agent', label: 'Agent / Broker', icon: Building2 },
    { id: 'super_admin', label: 'Super Admin', icon: Shield }
  ];

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left visual */}
      <div className="hidden lg:flex relative overflow-hidden text-white p-12 flex-col justify-between" style={{ background: 'linear-gradient(135deg, #0F6B54, #094836)' }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1645207825163-4e231ee2d707)', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay' }} />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center font-serif text-xl">B</div>
            <div>
              <div className="font-serif text-xl font-bold">Bahubali</div>
              <div className="text-[10px] tracking-[0.2em] uppercase opacity-80">Property</div>
            </div>
          </Link>
        </div>
        <div className="relative z-10">
          <h2 className="font-serif text-4xl xl:text-5xl font-bold leading-tight mb-4">Welcome back to India's trusted <em style={{ color: '#E8C168' }}>real estate</em> platform.</h2>
          <p className="text-white/85 max-w-lg">Access your dashboard to manage listings, shortlisted properties, enquiries, and personalized recommendations across 200+ cities.</p>
        </div>
        <div className="relative z-10 flex gap-6 text-sm">
          <div><div className="font-serif text-3xl font-bold" style={{ color: '#E8C168' }}>50K+</div><div className="opacity-80">Properties</div></div>
          <div><div className="font-serif text-3xl font-bold" style={{ color: '#E8C168' }}>200+</div><div className="opacity-80">Cities</div></div>
          <div><div className="font-serif text-3xl font-bold" style={{ color: '#E8C168' }}>500+</div><div className="opacity-80">Builders</div></div>
        </div>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="lg:hidden flex justify-center mb-8">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-serif text-xl" style={{ background: '#0F6B54' }}>B</div>
              <div><div className="font-serif text-xl font-bold brand-emerald" style={{ color: '#0F6B54' }}>Bahubali</div></div>
            </Link>
          </div>
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-2">Sign In</h1>
          <p className="text-slate-600 mb-6">Enter your credentials to access your account.</p>

          <div className="grid grid-cols-3 gap-2 mb-6">
            {roles.map(r => (
              <button key={r.id} type="button" onClick={() => { setRole(r.id); quickFill(r.id); }} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors ${role === r.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'}`}>
                <r.icon className="w-5 h-5" style={{ color: role === r.id ? '#0F6B54' : '#64748b' }} />
                <span className="text-[11px] font-semibold text-center leading-tight text-slate-700">{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1.5 block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
            </div>
            <div>
              <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full pl-9 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2"><span className="text-slate-400">{showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</span></button>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-slate-600">
                <input type="checkbox" className="rounded" /> Remember me
              </label>
              <a href="#" className="font-semibold" style={{ color: '#0F6B54' }}>Forgot Password?</a>
            </div>
            <Button type="submit" className="w-full text-white font-semibold py-6" style={{ background: '#0F6B54' }}>Sign In</Button>
          </form>

          <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs">
            <div className="font-semibold text-amber-900 mb-1">Demo Credentials (click role above to auto-fill):</div>
            <div className="text-amber-800 space-y-0.5">
              <div>Admin: admin@bahubali.com / admin123</div>
              <div>Agent: agent@bahubali.com / agent123</div>
              <div>User: user@bahubali.com / user123</div>
            </div>
          </div>

          <p className="text-sm text-slate-600 mt-6 text-center">
            Don't have an account? <Link to="/register" className="font-semibold" style={{ color: '#0F6B54' }}>Create one</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
