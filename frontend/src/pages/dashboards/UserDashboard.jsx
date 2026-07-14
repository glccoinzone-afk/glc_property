import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { DashboardShell, StatCard } from './DashboardShell';
import { Heart, Search, MessageSquare, Bell, Eye, Trash2, Bed, Ruler, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../mock';
import { Button } from '../../components/ui/button';
import { userActionsAPI } from '../../api';
import { toast } from 'sonner';

const UserDashboard = () => {
  const { user } = useAuth();
  const [shortlisted, setShortlisted] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [savedSearches, setSavedSearches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [s, e, ss] = await Promise.all([
          userActionsAPI.myShortlist(),
          userActionsAPI.myEnquiries(),
          userActionsAPI.mySavedSearches()
        ]);
        setShortlisted(s.data || []);
        setEnquiries(e.data || []);
        setSavedSearches(ss.data || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    })();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const removeShortlist = async (id) => {
    try {
      await userActionsAPI.removeShortlist(id);
      setShortlisted(shortlisted.filter(p => p.id !== id));
      toast.success('Removed');
    } catch (e) { toast.error('Failed'); }
  };

  return (
    <DashboardShell role="user" title={`Welcome, ${user.name}`} subtitle="Your personalized property dashboard">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Heart} label="Shortlisted" value={shortlisted.length} />
        <StatCard icon={Search} label="Saved Searches" value={savedSearches.length} />
        <StatCard icon={MessageSquare} label="Enquiries Sent" value={enquiries.length} color="#D4A24C" />
        <StatCard icon={Bell} label="New Alerts" value={12} color="#0E1B1F" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#0F6B54' }} /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold">Shortlisted Properties</h2>
              <Link to="/properties" className="text-sm font-semibold" style={{ color: '#0F6B54' }}>Browse More</Link>
            </div>
            {shortlisted.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Heart className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p>No shortlisted properties yet.</p>
                <Link to="/properties" className="text-sm font-semibold mt-2 inline-block" style={{ color: '#0F6B54' }}>Start browsing →</Link>
              </div>
            ) : (
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
                        <Link to={`/property/${p.id}`} className="p-1.5 rounded hover:bg-white"><Eye className="w-4 h-4 text-slate-500" /></Link>
                        <button onClick={() => removeShortlist(p.id)} className="p-1.5 rounded hover:bg-white"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="font-serif text-xl font-bold mb-4">Saved Searches</h2>
            {savedSearches.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No saved searches yet.</div>
            ) : (
              <div className="space-y-3">
                {savedSearches.map(s => (
                  <div key={s.id} className="p-3 rounded-xl bg-slate-50">
                    <div className="font-semibold text-sm text-slate-800">{s.name}</div>
                    <div className="flex items-center justify-between mt-2">
                      <Link to="/properties" className="text-xs font-semibold underline" style={{ color: '#0F6B54' }}>View Results</Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="font-serif text-xl font-bold mb-4">Recent Enquiries</h2>
            {enquiries.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No enquiries yet. Contact property owners directly to start conversations.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-slate-500 uppercase">
                    <tr className="border-b border-slate-200">
                      <th className="py-3">Property</th>
                      <th className="py-3">Message</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Sent</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map(e => (
                      <tr key={e.id} className="border-b border-slate-100">
                        <td className="py-3 font-semibold text-slate-800">{e.property_title || e.property_id}</td>
                        <td className="py-3 text-slate-600 truncate max-w-xs">{e.message}</td>
                        <td className="py-3"><span className="px-2.5 py-1 rounded-md text-xs font-semibold" style={{ background: '#dcfce7', color: '#0F6B54' }}>{e.status}</span></td>
                        <td className="py-3 text-slate-500">{new Date(e.created_at).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      )}
    </DashboardShell>
  );
};

export default UserDashboard;
