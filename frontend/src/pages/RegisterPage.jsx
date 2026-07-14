import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Shield, Building2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form.name, form.email, form.password, form.role, form.phone);
    if (res.success) {
      toast.success('Account created successfully!');
      const path = form.role === 'agent' ? '/dashboard/agent' : '/dashboard/user';
      navigate(path);
    } else {
      toast.error(res.error);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex relative overflow-hidden text-white p-12 flex-col justify-between" style={{ background: 'linear-gradient(135deg, #094836, #0F6B54)' }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'url(https://images.pexels.com/photos/36171603/pexels-photo-36171603.jpeg)', backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay' }} />
        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur flex items-center justify-center font-bold text-sm tracking-tight">GLC</div>
            <div><div className="font-serif text-xl font-bold">GLC Property</div><div className="text-[10px] tracking-[0.2em] uppercase opacity-80">by GLCZONE</div></div>
          </Link>
        </div>
        <div className="relative z-10">
          <h2 className="font-serif text-4xl xl:text-5xl font-bold leading-tight mb-4">Join <em style={{ color: '#E8C168' }}>10,000+</em> happy home owners across India.</h2>
          <p className="text-white/85 max-w-lg">Create your free account to save searches, get personalized alerts, connect with verified agents, and post your own properties.</p>
        </div>
        <div className="relative z-10"></div>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-2">Create Account</h1>
          <p className="text-slate-600 mb-6">Get started in less than a minute.</p>

          <div className="grid grid-cols-2 gap-2 mb-6">
            {[{ id: 'user', label: 'I am a Buyer / Renter', icon: User }, { id: 'agent', label: 'I am an Agent / Broker', icon: Building2 }].map(r => (
              <button key={r.id} type="button" onClick={() => setForm({ ...form, role: r.id })} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors ${form.role === r.id ? 'border-emerald-600 bg-emerald-50' : 'border-slate-200'}`}>
                <r.icon className="w-5 h-5" style={{ color: form.role === r.id ? '#0F6B54' : '#64748b' }} />
                <span className="text-xs font-semibold text-slate-700">{r.label}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field icon={User} label="Full Name" type="text" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="Ravi Kumar" required />
            <Field icon={Mail} label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="you@example.com" required />
            <Field icon={Phone} label="Phone" type="tel" value={form.phone} onChange={v => setForm({ ...form, phone: v })} placeholder="+91 98765 43210" required />
            <Field icon={Lock} label="Password" type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} placeholder="Minimum 8 characters" required />

            <label className="flex items-start gap-2 text-xs text-slate-600">
              <input type="checkbox" required className="mt-0.5" />
              <span>I agree to GLC Property's <a href="#" className="underline">Terms of Service</a> and <a href="#" className="underline">Privacy Policy</a>.</span>
            </label>

            <Button type="submit" className="w-full text-white font-semibold py-6" style={{ background: '#0F6B54' }}>Create Account</Button>
          </form>

          <p className="text-sm text-slate-600 mt-6 text-center">
            Already have an account? <Link to="/login" className="font-semibold" style={{ color: '#0F6B54' }}>Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const Field = ({ icon: Icon, label, type, value, onChange, placeholder, required }) => (
  <div>
    <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1.5 block">{label}</label>
    <div className="relative">
      <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" />
    </div>
  </div>
);

export default RegisterPage;
