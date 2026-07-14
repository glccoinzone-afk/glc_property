import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { DashboardShell, StatCard } from './DashboardShell';
import { Heart, Search, MessageSquare, Bell, Home, Eye, Trash2, Bed, Ruler } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PROPERTIES, formatINR } from '../../mock';
import { Button } from '../../components/ui/button';

const UserDashboard = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;

  const shortlisted = PROPERTIES.slice(0, 4);
  const savedSearches = [
    { name: '3 BHK in Bangalore under 1.5Cr', results: 45 },
    { name: 'Villas in Goa', results: 12 },
    { name: 'Commercial spaces in Pune', results: 28 }
  ];
  const enquiries = [
    { id: 1, property: 'Sky View Residency 1', status: 'Owner Responded', when: '2 hours ago' },
    { id: 2, property: 'Emerald Heights 5', status: 'Awaiting Response', when: '1 day ago' },
    { id: 3, property: 'Royal Palm Villa 3', status: 'Scheduled Visit', when: '3 days ago' }
  ];

  return (
    <DashboardShell role="user" title={`Welcome, ${user.name}`} subtitle="Your personalized property dashboard">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Heart} label="Shortlisted" value={shortlisted.length} change={+15} />
        <StatCard icon={Search} label="Saved Searches" value={savedSearches.length} />
        <StatCard icon={MessageSquare} label="Enquiries Sent" value={enquiries.length} change={+8} color="#D4A24C" />
        <StatCard icon={Bell} label="New Alerts" value={12} color="#0E1B1F" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <section className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-xl font-bold">Shortlisted Properties</h2>
            <Link to="/properties" className="text-sm font-semibold" style={{ color: '#0F6B54' }}>Browse More</Link>
          </div>
          <div className="space-y-3">
            {shortlisted.map(p => (
              <div key={p.id} className="flex gap-4 p-3 rounded-xl hover:bg-emerald-50 transition-colors">
                <img src={p.image} className="w-24 h-20 rounded-lg object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <Link to={`/property/${p.id}`} className="font-semibold text-slate-900 hover:text-emerald-700">{p.title}</Link>
                  <div className="text-xs text-slate-500 mb-1">{p.locality}, {p.city}</div>
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="flex items-center gap-1"><Bed className="w-3 h-3" /> {p.bhk} BHK</span>
                    <span className="flex items-center gap-1"><Ruler className="w-3 h-3" /> {p.area} sq.ft</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold" style={{ color: '#0F6B54' }}>{formatINR(p.price)}</div>
                  <div className="flex gap-1 mt-2">
                    <button className="p-1.5 rounded hover:bg-white"><Eye className="w-4 h-4 text-slate-500" /></button>
                    <button className="p-1.5 rounded hover:bg-white"><Trash2 className="w-4 h-4 text-red-500" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl p-6 border border-slate-100">
          <h2 className="font-serif text-xl font-bold mb-4">Saved Searches</h2>
          <div className="space-y-3">
            {savedSearches.map(s => (
              <div key={s.name} className="p-3 rounded-xl bg-slate-50">
                <div className="font-semibold text-sm text-slate-800">{s.name}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs" style={{ color: '#0F6B54' }}>{s.results} new results</span>
                  <Link to="/properties" className="text-xs font-semibold underline" style={{ color: '#0F6B54' }}>View</Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100">
          <h2 className="font-serif text-xl font-bold mb-4">Recent Enquiries</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-slate-500 uppercase">
                <tr className="border-b border-slate-200">
                  <th className="py-3">Property</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Timestamp</th>
                  <th className="py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.map(e => (
                  <tr key={e.id} className="border-b border-slate-100">
                    <td className="py-3 font-semibold text-slate-800">{e.property}</td>
                    <td className="py-3"><span className="px-2.5 py-1 rounded-md text-xs font-semibold" style={{ background: e.status === 'Owner Responded' ? '#dcfce7' : e.status === 'Scheduled Visit' ? '#fef3c7' : '#f1f5f9', color: e.status === 'Owner Responded' ? '#0F6B54' : e.status === 'Scheduled Visit' ? '#92400e' : '#64748b' }}>{e.status}</span></td>
                    <td className="py-3 text-slate-500">{e.when}</td>
                    <td className="py-3"><Button size="sm" variant="outline">View</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
};

export default UserDashboard;
