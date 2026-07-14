import React, { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calculator, IndianRupee, Percent, Calendar, PieChart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Slider } from '../components/ui/slider';
import { formatINR } from '../mock';

const EMICalculator = () => {
  const location = useLocation();
  const initialPrice = location.state?.price || 5000000;

  const [amount, setAmount] = useState(initialPrice);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const { emi, totalInterest, totalPayable } = useMemo(() => {
    const p = amount;
    const r = rate / 12 / 100;
    const n = tenure * 12;
    const emiVal = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const total = emiVal * n;
    return { emi: emiVal, totalInterest: total - p, totalPayable: total };
  }, [amount, rate, tenure]);

  const interestPct = ((totalInterest / totalPayable) * 100) || 0;
  const principalPct = 100 - interestPct;

  return (
    <div>
      <Header />
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg" style={{ background: '#0F6B54' }}>
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-slate-900 mb-3">Home Loan EMI Calculator</h1>
          <p className="text-slate-600 max-w-2xl mx-auto">Plan your home purchase smartly with instant EMI calculation, interest breakdown & amortization insights.</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-3xl border border-slate-200 p-8">
            <h2 className="font-serif text-2xl font-bold mb-6">Loan Details</h2>

            <SliderField icon={IndianRupee} label="Loan Amount" value={formatINR(amount)} sliderVal={[amount]} min={100000} max={200000000} step={100000} onChange={v => setAmount(v[0])} />
            <SliderField icon={Percent} label="Interest Rate (Annual)" value={`${rate}%`} sliderVal={[rate]} min={5} max={20} step={0.1} onChange={v => setRate(v[0])} />
            <SliderField icon={Calendar} label="Tenure (Years)" value={`${tenure} years`} sliderVal={[tenure]} min={1} max={30} step={1} onChange={v => setTenure(v[0])} />

            <div className="mt-8 grid grid-cols-3 gap-4">
              <QuickPreset label="5L" onClick={() => setAmount(500000)} />
              <QuickPreset label="25L" onClick={() => setAmount(2500000)} />
              <QuickPreset label="1 Cr" onClick={() => setAmount(10000000)} />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="rounded-3xl p-8 text-white" style={{ background: 'linear-gradient(135deg, #0F6B54, #094836)' }}>
            <h2 className="font-serif text-2xl font-bold mb-2">Your Monthly EMI</h2>
            <div className="font-serif text-5xl md:text-6xl font-bold mb-6" style={{ color: '#E8C168' }}>{formatINR(emi)}</div>

            <div className="space-y-3 mb-8">
              <StatRow label="Principal Amount" value={formatINR(amount)} />
              <StatRow label="Total Interest" value={formatINR(totalInterest)} />
              <StatRow label="Total Payable" value={formatINR(totalPayable)} accent />
            </div>

            {/* Donut chart */}
            <div className="flex items-center gap-6">
              <div className="relative w-40 h-40 shrink-0">
                <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                  <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.15)" strokeWidth="14" fill="none" />
                  <circle cx="50" cy="50" r="40" stroke="#E8C168" strokeWidth="14" fill="none" strokeDasharray={`${(interestPct / 100) * 251.3} 251.3`} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xs uppercase opacity-70">Interest</div>
                  <div className="font-bold text-lg">{interestPct.toFixed(1)}%</div>
                </div>
              </div>
              <div className="space-y-3">
                <Legend color="#E8C168" label="Interest" value={`${interestPct.toFixed(1)}%`} />
                <Legend color="rgba(255,255,255,0.25)" label="Principal" value={`${principalPct.toFixed(1)}%`} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Amortization snippet */}
        <div className="mt-8 bg-white rounded-3xl border border-slate-200 p-8">
          <h2 className="font-serif text-2xl font-bold mb-4">Year-wise Payment Schedule</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-slate-200">
                  <th className="py-3 px-4 font-semibold text-slate-600">Year</th>
                  <th className="py-3 px-4 font-semibold text-slate-600">Principal</th>
                  <th className="py-3 px-4 font-semibold text-slate-600">Interest</th>
                  <th className="py-3 px-4 font-semibold text-slate-600">Balance</th>
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: Math.min(tenure, 10) }).map((_, i) => {
                  const year = i + 1;
                  const yearlyPay = emi * 12;
                  const balance = amount * Math.pow(1 + rate / 100, year) - yearlyPay * ((Math.pow(1 + rate / 100, year) - 1) / (rate / 100));
                  const principal = yearlyPay * 0.3 + i * (yearlyPay * 0.05);
                  const interest = yearlyPay - principal;
                  return (
                    <tr key={year} className="border-b border-slate-100 hover:bg-emerald-50/30">
                      <td className="py-3 px-4 font-semibold">{year}</td>
                      <td className="py-3 px-4">{formatINR(Math.max(principal, 0))}</td>
                      <td className="py-3 px-4">{formatINR(Math.max(interest, 0))}</td>
                      <td className="py-3 px-4">{formatINR(Math.max(balance, 0))}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const SliderField = ({ icon: Icon, label, value, sliderVal, onChange, min, max, step }) => (
  <div className="mb-6">
    <div className="flex items-center justify-between mb-2">
      <label className="flex items-center gap-2 text-sm font-semibold text-slate-700"><Icon className="w-4 h-4" style={{ color: '#0F6B54' }} /> {label}</label>
      <span className="font-bold text-lg" style={{ color: '#0F6B54' }}>{value}</span>
    </div>
    <Slider min={min} max={max} step={step} value={sliderVal} onValueChange={onChange} />
    <div className="flex justify-between text-[10px] text-slate-400 mt-1">
      <span>{min}</span><span>{max}</span>
    </div>
  </div>
);

const QuickPreset = ({ label, onClick }) => (
  <button onClick={onClick} className="px-4 py-2 bg-emerald-50 hover:bg-emerald-100 rounded-lg text-sm font-semibold transition-colors" style={{ color: '#0F6B54' }}>{label}</button>
);

const StatRow = ({ label, value, accent }) => (
  <div className={`flex items-center justify-between py-2 ${accent ? 'border-t border-white/20 pt-3 mt-2' : ''}`}>
    <span className="opacity-80 text-sm">{label}</span>
    <span className={`font-bold ${accent ? 'text-xl' : ''}`} style={{ color: accent ? '#E8C168' : 'white' }}>{value}</span>
  </div>
);

const Legend = ({ color, label, value }) => (
  <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded" style={{ background: color }} />
    <span className="text-sm opacity-85">{label} · <span className="font-semibold">{value}</span></span>
  </div>
);

export default EMICalculator;
