import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Search, X, Home } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PROPERTIES, formatINR } from '../mock';
import { Button } from '../components/ui/button';

const MapSearchPage = () => {
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');

  const properties = useMemo(() => {
    if (!search) return PROPERTIES;
    return PROPERTIES.filter(p => p.city.toLowerCase().includes(search.toLowerCase()) || p.locality.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  // Simple mapping: normalize lat/lng to viewport %
  const project = (lat, lng) => {
    const x = ((lng - 68) / (98 - 68)) * 100;
    const y = ((36 - lat) / (36 - 8)) * 100;
    return { x: Math.max(3, Math.min(97, x)), y: Math.max(5, Math.min(95, y)) };
  };

  return (
    <div>
      <Header />
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-2">Map-Based Property Search</h1>
        <p className="text-slate-600 mb-6">Explore properties across India geographically. Click on any pin to see details.</p>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search city or locality..." className="w-full md:w-96 pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500" />
        </div>

        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          {/* Stylised map */}
          <div className="relative aspect-[4/3] lg:aspect-auto lg:h-[calc(100vh-260px)] rounded-3xl overflow-hidden border border-emerald-100" style={{ background: 'linear-gradient(135deg, #E8F4F0 0%, #F5F1E8 100%)' }}>
            {/* India outline SVG */}
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-30">
              <path d="M 20 15 Q 15 20 18 30 L 12 45 L 18 60 Q 25 70 30 80 L 45 92 L 55 88 L 65 78 L 72 65 L 80 55 L 85 40 L 82 25 L 70 18 L 55 12 L 40 10 Z" fill="none" stroke="#0F6B54" strokeWidth="0.5" />
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={i} x1={i * 5} y1="0" x2={i * 5} y2="100" stroke="#0F6B54" strokeWidth="0.05" />
              ))}
              {Array.from({ length: 20 }).map((_, i) => (
                <line key={i} x1="0" y1={i * 5} x2="100" y2={i * 5} stroke="#0F6B54" strokeWidth="0.05" />
              ))}
            </svg>

            {/* Pins */}
            {properties.map(p => {
              const { x, y } = project(p.lat, p.lng);
              const active = selected?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  className="absolute -translate-x-1/2 -translate-y-full transition-all hover:scale-110"
                  style={{ left: `${x}%`, top: `${y}%`, zIndex: active ? 20 : 10 }}
                >
                  <div className="relative">
                    <div className="px-2.5 py-1 rounded-full text-[11px] font-bold shadow-lg whitespace-nowrap" style={{ background: active ? '#D4A24C' : '#0F6B54', color: active ? '#0E1B1F' : 'white' }}>
                      {formatINR(p.price)}
                    </div>
                    <div className="w-2 h-2 rounded-full mx-auto -mt-0.5" style={{ background: active ? '#D4A24C' : '#0F6B54' }} />
                  </div>
                </button>
              );
            })}

            <div className="absolute bottom-4 left-4 bg-white/95 rounded-lg px-3 py-2 text-xs text-slate-600 backdrop-blur-sm border border-emerald-100">
              Showing {properties.length} properties across India
            </div>
          </div>

          {/* Selected property panel */}
          <aside className="bg-white rounded-3xl border border-slate-200 p-6 h-fit sticky top-24">
            {selected ? (
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="text-xs uppercase tracking-wider text-slate-500">Selected Property</div>
                  <button onClick={() => setSelected(null)}><X className="w-4 h-4 text-slate-400" /></button>
                </div>
                <div className="aspect-video rounded-xl overflow-hidden mb-4">
                  <img src={selected.image} alt="" className="w-full h-full object-cover" />
                </div>
                <h3 className="font-serif text-xl font-bold text-slate-900">{selected.title}</h3>
                <div className="flex items-center gap-1 text-sm text-slate-500 mt-1 mb-3"><MapPin className="w-3.5 h-3.5" /> {selected.locality}, {selected.city}</div>
                <div className="font-bold text-2xl mb-4" style={{ color: '#0F6B54' }}>{formatINR(selected.price)}</div>
                <div className="grid grid-cols-3 gap-2 text-center mb-4 pb-4 border-b border-slate-100">
                  <div><div className="text-lg font-bold">{selected.bhk}</div><div className="text-[10px] uppercase text-slate-500">BHK</div></div>
                  <div><div className="text-lg font-bold">{selected.area}</div><div className="text-[10px] uppercase text-slate-500">Sq.Ft</div></div>
                  <div><div className="text-lg font-bold">{selected.bathrooms}</div><div className="text-[10px] uppercase text-slate-500">Bath</div></div>
                </div>
                <Link to={`/property/${selected.id}`}>
                  <Button className="w-full text-white" style={{ background: '#0F6B54' }}>View Full Details</Button>
                </Link>
              </div>
            ) : (
              <div className="text-center py-8">
                <Home className="w-12 h-12 mx-auto mb-3" style={{ color: '#0F6B54' }} />
                <h3 className="font-semibold text-slate-800 mb-1">Click a pin to view details</h3>
                <p className="text-sm text-slate-500">{properties.length} properties are shown on the map. Zoom in by hovering over city clusters.</p>
              </div>
            )}
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MapSearchPage;
