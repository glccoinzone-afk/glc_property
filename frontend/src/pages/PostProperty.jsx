import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '../components/ui/button';
import { Home, Upload, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../context/AuthContext';

const PostProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    purpose: 'Sale', propertyType: 'Apartment', title: '', city: '', locality: '', bhk: '2', area: '', price: '', description: '', furnishing: 'Semi Furnished', possession: 'Ready to Move'
  });

  if (!user) {
    return (
      <div>
        <Header />
        <div className="max-w-2xl mx-auto text-center py-24 px-4">
          <Home className="w-16 h-16 mx-auto mb-4" style={{ color: '#0F6B54' }} />
          <h1 className="font-serif text-3xl font-bold mb-3">Sign in to post your property</h1>
          <p className="text-slate-600 mb-6">Reach thousands of verified buyers and renters across India.</p>
          <Button className="text-white" style={{ background: '#0F6B54' }} onClick={() => navigate('/login')}>Sign In to Continue</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const submit = () => {
    toast.success('Property posted successfully! Redirecting to dashboard...');
    setTimeout(() => navigate(user.role === 'agent' ? '/dashboard/agent' : '/dashboard/user'), 1500);
  };

  const steps = ['Basic Info', 'Location & Area', 'Pricing & Photos', 'Review'];

  return (
    <div>
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-2">Post Your Property</h1>
        <p className="text-slate-600 mb-8">Free listing. Reach millions of buyers.</p>

        {/* Stepper */}
        <div className="flex items-center justify-between mb-10">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${step > i + 1 ? 'text-white' : step === i + 1 ? 'text-white' : 'bg-slate-100 text-slate-400'}`} style={{ background: step > i + 1 ? '#0F6B54' : step === i + 1 ? '#D4A24C' : undefined, color: step > i + 1 || step === i + 1 ? (step > i + 1 ? 'white' : '#0E1B1F') : undefined }}>
                {step > i + 1 ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
              </div>
              <div className="ml-2 hidden md:block">
                <div className="text-xs font-semibold text-slate-700">{s}</div>
              </div>
              {i < steps.length - 1 && <div className="flex-1 h-0.5 mx-3" style={{ background: step > i + 1 ? '#0F6B54' : '#e2e8f0' }} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-8">
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-bold">Tell us about your property</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormRow label="I want to">
                  <select value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className="input">
                    <option>Sale</option><option>Rent</option>
                  </select>
                </FormRow>
                <FormRow label="Property Type">
                  <select value={form.propertyType} onChange={e => setForm({ ...form, propertyType: e.target.value })} className="input">
                    <option>Apartment</option><option>Villa</option><option>Plot</option><option>Office</option><option>Bungalow</option>
                  </select>
                </FormRow>
              </div>
              <FormRow label="Property Title"><input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Spacious 3BHK in Koramangala" className="input" /></FormRow>
              <FormRow label="Description"><textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4} placeholder="Describe your property..." className="input" /></FormRow>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-bold">Where is your property?</h2>
              <div className="grid grid-cols-2 gap-4">
                <FormRow label="City"><input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} placeholder="Bangalore" className="input" /></FormRow>
                <FormRow label="Locality"><input value={form.locality} onChange={e => setForm({ ...form, locality: e.target.value })} placeholder="Koramangala" className="input" /></FormRow>
                <FormRow label="BHK"><select value={form.bhk} onChange={e => setForm({ ...form, bhk: e.target.value })} className="input">{['1', '2', '3', '4', '5+'].map(b => <option key={b}>{b}</option>)}</select></FormRow>
                <FormRow label="Area (sq.ft)"><input type="number" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="1200" className="input" /></FormRow>
                <FormRow label="Furnishing"><select value={form.furnishing} onChange={e => setForm({ ...form, furnishing: e.target.value })} className="input">{['Fully Furnished', 'Semi Furnished', 'Unfurnished'].map(f => <option key={f}>{f}</option>)}</select></FormRow>
                <FormRow label="Possession"><select value={form.possession} onChange={e => setForm({ ...form, possession: e.target.value })} className="input">{['Ready to Move', 'Under Construction'].map(f => <option key={f}>{f}</option>)}</select></FormRow>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-serif text-2xl font-bold">Pricing & Photos</h2>
              <FormRow label="Expected Price (₹)"><input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="5000000" className="input" /></FormRow>
              <FormRow label="Upload Photos">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-emerald-400 transition-colors cursor-pointer">
                  <Upload className="w-10 h-10 mx-auto mb-2" style={{ color: '#0F6B54' }} />
                  <div className="font-semibold">Drop images here or click to browse</div>
                  <div className="text-xs text-slate-500 mt-1">Add up to 20 photos (JPG, PNG)</div>
                </div>
              </FormRow>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h2 className="font-serif text-2xl font-bold">Review Your Listing</h2>
              <dl className="grid grid-cols-2 gap-4 bg-slate-50 rounded-xl p-6">
                {Object.entries(form).map(([k, v]) => v && (
                  <div key={k}>
                    <dt className="text-xs text-slate-500 uppercase">{k}</dt>
                    <dd className="font-semibold">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
            <Button variant="outline" disabled={step === 1} onClick={() => setStep(s => s - 1)}>Previous</Button>
            {step < 4 ? (
              <Button className="text-white" style={{ background: '#0F6B54' }} onClick={() => setStep(s => s + 1)}>Next Step</Button>
            ) : (
              <Button className="text-white" style={{ background: '#0F6B54' }} onClick={submit}>Submit Property</Button>
            )}
          </div>
        </div>
      </div>
      <style>{`.input { width: 100%; padding: 0.7rem 0.9rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 0.75rem; font-size: 0.875rem; }
      .input:focus { outline: none; border-color: #0F6B54; box-shadow: 0 0 0 3px rgba(15,107,84,0.1); }`}</style>
      <Footer />
    </div>
  );
};

const FormRow = ({ label, children }) => (
  <div>
    <label className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1.5 block">{label}</label>
    {children}
  </div>
);

export default PostProperty;
