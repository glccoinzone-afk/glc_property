import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { BUDGET_OPTIONS, CITIES } from '../mock';

const PURPOSE_TABS = ['BUY', 'RENT', 'RESIDENTIAL', 'INDEPENDENT', 'INDUSTRIAL', 'COMMERCIAL'];
const PROP_TYPES = ['New Flats', 'Resale Flats', 'Paying Guests', 'Duplex House', 'Villas', 'Bungalows', 'Plot', 'Office'];
const BHK_TYPES = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];
const FURNISHING = ['Fully Furnished', 'Semi Furnished', 'Unfurnished'];
const POSSESSION = ['Ready to Move', 'Under Construction'];

const SearchBar = () => {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState('BUY');
  const [city, setCity] = useState('');
  const [propType, setPropType] = useState('');
  const [budgetFrom, setBudgetFrom] = useState('');
  const [budgetTo, setBudgetTo] = useState('');
  const [bhk, setBhk] = useState('');
  const [furnishing, setFurnishing] = useState('');
  const [possession, setPossession] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (purpose) params.set('purpose', purpose);
    if (city) params.set('city', city);
    if (propType) params.set('propertyType', propType);
    if (budgetFrom) params.set('budgetFrom', budgetFrom);
    if (budgetTo) params.set('budgetTo', budgetTo);
    if (bhk) params.set('bhk', bhk);
    if (furnishing) params.set('furnishing', furnishing);
    if (possession) params.set('possession', possession);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="rounded-2xl bg-white shadow-2xl border border-emerald-100 overflow-hidden">
      {/* Purpose tabs */}
      <div className="flex flex-wrap gap-0 border-b border-slate-100 bg-slate-50/60">
        {PURPOSE_TABS.map(t => (
          <button
            key={t}
            onClick={() => setPurpose(t)}
            className={`px-5 py-3.5 text-xs md:text-sm font-semibold tracking-wide transition-colors relative ${purpose === t ? 'text-white' : 'text-slate-600 hover:text-emerald-800'}`}
            style={{ background: purpose === t ? '#0F6B54' : 'transparent' }}
          >
            {t}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* City */}
        <div className="lg:col-span-2">
          <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5 block">Location</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              list="cities"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Search city, locality, project..."
              className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
            <datalist id="cities">
              {CITIES.map(c => <option key={c} value={c} />)}
            </datalist>
          </div>
        </div>

        <Select label="Property Type" value={propType} onChange={setPropType} options={['Any', ...PROP_TYPES]} />
        <Select label="BHK" value={bhk} onChange={setBhk} options={['Any', ...BHK_TYPES]} />

        <Select label="Budget From" value={budgetFrom} onChange={setBudgetFrom} options={['Any', ...BUDGET_OPTIONS.map(o => o.label)]} />
        <Select label="Budget To" value={budgetTo} onChange={setBudgetTo} options={['Any', ...BUDGET_OPTIONS.map(o => o.label)]} />
        <Select label="Furnishing" value={furnishing} onChange={setFurnishing} options={['Any', ...FURNISHING]} />
        <Select label="Possession" value={possession} onChange={setPossession} options={['Any', ...POSSESSION]} />

        <div className="md:col-span-2 lg:col-span-4 flex justify-end pt-2">
          <Button type="submit" size="lg" className="font-semibold shadow-lg hover:shadow-xl text-white gap-2 min-w-[180px]" style={{ background: '#0F6B54' }}>
            <Search className="w-4 h-4" /> Search Properties
          </Button>
        </div>
      </form>
    </div>
  );
};

const Select = ({ label, value, onChange, options }) => (
  <div>
    <label className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-1.5 block">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value === 'Any' ? '' : e.target.value)} className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500">
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

export default SearchBar;
