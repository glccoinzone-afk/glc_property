import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid3x3, List, Map, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import { PROPERTIES, CITIES, BUDGET_OPTIONS } from '../mock';
import { Button } from '../components/ui/button';
import { Slider } from '../components/ui/slider';
import { Checkbox } from '../components/ui/checkbox';

const PropertyListing = () => {
  const [params, setParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState('grid');

  const [city, setCity] = useState(params.get('city') || '');
  const [propertyType, setPropertyType] = useState(params.get('propertyType') || '');
  const [bhk, setBhk] = useState(params.get('bhk') || '');
  const [purpose, setPurpose] = useState(params.get('purpose') || '');
  const [furnishing, setFurnishing] = useState(params.get('furnishing') || '');
  const [priceRange, setPriceRange] = useState([0, 200000000]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [ownerOnly, setOwnerOnly] = useState(false);
  const [amenities, setAmenities] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');

  const filtered = useMemo(() => {
    let list = [...PROPERTIES];
    if (city) list = list.filter(p => p.city.toLowerCase().includes(city.toLowerCase()));
    if (propertyType) list = list.filter(p => p.propertyType.toLowerCase() === propertyType.toLowerCase());
    if (bhk) list = list.filter(p => `${p.bhk} BHK` === bhk);
    if (purpose === 'RENT') list = list.filter(p => p.type === 'Rent');
    if (purpose === 'BUY') list = list.filter(p => p.type === 'Sale');
    if (furnishing) list = list.filter(p => p.furnishing === furnishing);
    if (verifiedOnly) list = list.filter(p => p.verified);
    if (ownerOnly) list = list.filter(p => p.ownerDirect);
    list = list.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (amenities.length > 0) list = list.filter(p => amenities.every(a => p.amenities.includes(a)));
    if (sortBy === 'price-low') list.sort((a, b) => a.price - b.price);
    if (sortBy === 'price-high') list.sort((a, b) => b.price - a.price);
    if (sortBy === 'area-large') list.sort((a, b) => b.area - a.area);
    return list;
  }, [city, propertyType, bhk, purpose, furnishing, verifiedOnly, ownerOnly, priceRange, amenities, sortBy]);

  const toggleAmenity = (a) => setAmenities(amenities.includes(a) ? amenities.filter(x => x !== a) : [...amenities, a]);

  const ALL_AMENITIES = ['Swimming Pool', 'Gym', 'Garden', 'Security', 'Lift', 'Club House', 'Play Area', 'Power Backup'];
  const PROP_TYPES = ['Apartment', 'Villa', 'Plot', 'Office', 'Bungalow'];
  const BHK = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'];

  const FilterPanel = () => (
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Purpose</h4>
        <div className="grid grid-cols-2 gap-2">
          {['BUY', 'RENT'].map(t => (
            <button key={t} onClick={() => setPurpose(purpose === t ? '' : t)} className={`px-3 py-2 text-sm rounded-lg border font-medium transition-colors ${purpose === t ? 'text-white border-transparent' : 'text-slate-700 border-slate-200 hover:border-emerald-300'}`} style={{ background: purpose === t ? '#0F6B54' : 'white' }}>{t}</button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">City</h4>
        <select value={city} onChange={e => setCity(e.target.value)} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
          <option value="">All Cities</option>
          {CITIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Property Type</h4>
        <div className="flex flex-wrap gap-2">
          {PROP_TYPES.map(t => (
            <button key={t} onClick={() => setPropertyType(propertyType === t ? '' : t)} className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${propertyType === t ? 'text-white border-transparent' : 'text-slate-700 border-slate-200 hover:border-emerald-300'}`} style={{ background: propertyType === t ? '#0F6B54' : 'white' }}>{t}</button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">BHK</h4>
        <div className="flex flex-wrap gap-2">
          {BHK.map(t => (
            <button key={t} onClick={() => setBhk(bhk === t ? '' : t)} className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${bhk === t ? 'text-white border-transparent' : 'text-slate-700 border-slate-200 hover:border-emerald-300'}`} style={{ background: bhk === t ? '#0F6B54' : 'white' }}>{t}</button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Budget: ₹{(priceRange[0] / 100000).toFixed(0)}L - ₹{(priceRange[1] / 10000000).toFixed(1)}Cr</h4>
        <Slider min={0} max={200000000} step={500000} value={priceRange} onValueChange={setPriceRange} className="my-4" />
      </div>

      <div>
        <h4 className="font-semibold text-slate-900 mb-3 text-sm uppercase tracking-wider">Amenities</h4>
        <div className="space-y-2">
          {ALL_AMENITIES.map(a => (
            <label key={a} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
              <Checkbox checked={amenities.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
              {a}
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <Checkbox checked={verifiedOnly} onCheckedChange={setVerifiedOnly} />
          Verified Only
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <Checkbox checked={ownerOnly} onCheckedChange={setOwnerOnly} />
          No Broker (Owner Direct)
        </label>
      </div>
    </div>
  );

  return (
    <div>
      <Header />
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900">Properties in India</h1>
            <p className="text-slate-600 mt-1">{filtered.length} results found</p>
          </div>
          <div className="flex items-center gap-2">
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="px-3 py-2 border border-slate-200 rounded-lg text-sm bg-white">
              <option value="relevance">Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="area-large">Largest Area</option>
            </select>
            <Link to="/map-search"><Button variant="outline" className="gap-2"><Map className="w-4 h-4" /> Map</Button></Link>
            <Button variant="outline" className="lg:hidden gap-2" onClick={() => setShowFilters(true)}><SlidersHorizontal className="w-4 h-4" /> Filters</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
          <aside className="hidden lg:block bg-white rounded-2xl border border-slate-200 p-6 h-fit sticky top-24">
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-slate-100">
              <Filter className="w-5 h-5" style={{ color: '#0F6B54' }} />
              <h3 className="font-serif text-lg font-bold">Filters</h3>
            </div>
            <FilterPanel />
          </aside>

          <main>
            {filtered.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl">
                <p className="text-slate-500">No properties match your filters. Try adjusting the search.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filtered.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden" onClick={() => setShowFilters(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-md bg-white overflow-y-auto p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif text-xl font-bold">Filters</h3>
              <button onClick={() => setShowFilters(false)}><X className="w-6 h-6" /></button>
            </div>
            <FilterPanel />
            <Button className="w-full mt-6 text-white" style={{ background: '#0F6B54' }} onClick={() => setShowFilters(false)}>Apply Filters</Button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PropertyListing;
