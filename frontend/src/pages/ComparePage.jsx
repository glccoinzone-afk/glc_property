import React from 'react';
import { Link } from 'react-router-dom';
import { X, Home, ArrowLeft, CheckCircle2, MinusCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useCompare } from '../context/CompareContext';
import { formatINR } from '../mock';
import { Button } from '../components/ui/button';

const ComparePage = () => {
  const { items, remove, clear } = useCompare();

  if (items.length === 0) {
    return (
      <div>
        <Header />
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
          <div className="w-20 h-20 rounded-2xl bg-emerald-50 mx-auto mb-6 flex items-center justify-center">
            <Home className="w-10 h-10" style={{ color: '#0F6B54' }} />
          </div>
          <h1 className="font-serif text-3xl font-bold text-slate-900 mb-3">Compare Properties</h1>
          <p className="text-slate-600 mb-8">Add up to 4 properties to compare their details side-by-side.</p>
          <Link to="/properties"><Button className="text-white" style={{ background: '#0F6B54' }}>Browse Properties</Button></Link>
        </div>
        <Footer />
      </div>
    );
  }

  const rows = [
    { label: 'Price', key: p => formatINR(p.price) },
    { label: 'Type', key: p => p.type },
    { label: 'Property Type', key: p => p.propertyType || p.property_type },
    { label: 'City', key: p => p.city },
    { label: 'Locality', key: p => p.locality },
    { label: 'BHK', key: p => `${p.bhk} BHK` },
    { label: 'Area', key: p => `${p.area} ${p.areaUnit || p.area_unit || 'sq.ft'}` },
    { label: 'Bathrooms', key: p => p.bathrooms },
    { label: 'Parking', key: p => p.parking },
    { label: 'Furnishing', key: p => p.furnishing },
    { label: 'Possession', key: p => p.possession },
    { label: 'Verified', key: p => p.verified },
    { label: 'Owner Direct', key: p => p.ownerDirect ?? p.owner_direct },
    { label: 'Builder', key: p => p.builder },
    { label: 'Amenities', key: p => p.amenities }
  ];

  return (
    <div>
      <Header />
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <Link to="/properties" className="flex items-center gap-1 text-sm text-slate-600 hover:text-emerald-700 mb-2"><ArrowLeft className="w-4 h-4" /> Back</Link>
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900">Property Comparison</h1>
            <p className="text-slate-600 mt-1">Comparing {items.length} of 4 properties</p>
          </div>
          <Button variant="outline" onClick={clear}>Clear All</Button>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr>
                <th className="p-4 text-left text-xs uppercase tracking-wider text-slate-500 font-semibold bg-slate-50" style={{ width: 200 }}>Feature</th>
                {items.map(p => (
                  <th key={p.id} className="p-4 text-left bg-slate-50 min-w-[240px]">
                    <div className="relative">
                      <button onClick={() => remove(p.id)} className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center"><X className="w-3.5 h-3.5" /></button>
                      <img src={p.image} alt="" className="w-full h-32 object-cover rounded-lg mb-3" />
                      <Link to={`/property/${p.id}`} className="font-serif font-bold text-slate-900 hover:text-emerald-700 block">{p.title}</Link>
                      <div className="text-xs text-slate-500">{p.locality}, {p.city}</div>
                    </div>
                  </th>
                ))}
                {Array.from({ length: 4 - items.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="p-4 bg-slate-50 min-w-[240px]">
                    <Link to="/properties" className="block h-32 rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-400 flex items-center justify-center text-slate-400 hover:text-emerald-600">+ Add Property</Link>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(row => (
                <tr key={row.label} className="border-t border-slate-100">
                  <td className="p-4 text-sm font-semibold text-slate-700">{row.label}</td>
                  {items.map(p => {
                    const val = row.key(p);
                    return (
                      <td key={p.id} className="p-4 text-sm text-slate-700">
                        {typeof val === 'boolean' ? (val ? <CheckCircle2 className="w-5 h-5" style={{ color: '#0F6B54' }} /> : <MinusCircle className="w-5 h-5 text-slate-300" />)
                          : Array.isArray(val) ? val.join(', ') : val}
                      </td>
                    );
                  })}
                  {Array.from({ length: 4 - items.length }).map((_, i) => <td key={i} className="p-4 text-slate-300">-</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ComparePage;
