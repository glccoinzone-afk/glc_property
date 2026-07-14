import React, { useEffect, useState } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { DashboardShell, StatCard } from './DashboardShell';
import { Building2, Users, TrendingUp, Eye, Star, Phone, PlusCircle, Edit, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../mock';
import { Button } from '../../components/ui/button';
import { propertiesAPI, userActionsAPI } from '../../api';

const AgentDashboard = () => {
  const { user } = useAuth();
  const [myListings, setMyListings] = useState([]);
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const [p, e] = await Promise.all([
          propertiesAPI.mine(),
          userActionsAPI.agentEnquiries()
        ]);
        setMyListings(p.data || []);
        setLeads(e.data || []);
      } catch (err) { console.error(err); }
      setLoading(false);
    })();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  const totalViews = myListings.reduce((s, p) => s + (p.views || 0), 0);
  const conversion = leads.length && myListings.length ? ((leads.length / (totalViews || 1)) * 100).toFixed(1) : '0.0';

  return (
    <DashboardShell role="agent" title={`Agent Console · ${user.name}`} subtitle="Manage your listings, leads, and conversions">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Building2} label="Active Listings" value={myListings.length} />
        <StatCard icon={Eye} label="Total Views" value={totalViews.toLocaleString()} color="#D4A24C" />
        <StatCard icon={Users} label="Fresh Leads" value={leads.length} />
        <StatCard icon={TrendingUp} label="Conversion" value={`${conversion}%`} color="#0E1B1F" />
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin" style={{ color: '#0F6B54' }} /></div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-serif text-xl font-bold">My Listings</h2>
              <Link to="/post-property"><Button size="sm" className="text-white gap-1" style={{ background: '#0F6B54' }}><PlusCircle className="w-4 h-4" /> Add New</Button></Link>
            </div>
            {myListings.length === 0 ? (
              <div className="text-center py-10">
                <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-slate-500 mb-3">You haven't posted any listings yet.</p>
                <Link to="/post-property"><Button className="text-white" style={{ background: '#0F6B54' }}>Post Your First Property</Button></Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="text-left text-xs text-slate-500 uppercase">
                    <tr className="border-b border-slate-200">
                      <th className="py-3">Property</th>
                      <th className="py-3">Price</th>
                      <th className="py-3">Views</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myListings.map(p => (
                      <tr key={p.id} className="border-b border-slate-100 hover:bg-emerald-50/30">
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <img src={p.image} className="w-12 h-12 rounded-lg object-cover" alt="" />
                            <div>
                              <Link to={`/property/${p.id}`} className="font-semibold text-slate-800 hover:text-emerald-700">{p.title}</Link>
                              <div className="text-xs text-slate-500">{p.city}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-semibold" style={{ color: '#0F6B54' }}>{formatINR(p.price)}</td>
                        <td className="py-3">{p.views || 0}</td>
                        <td className="py-3"><span className="px-2 py-1 rounded-md text-xs font-semibold" style={{ background: p.status === 'active' ? '#dcfce7' : '#fef3c7', color: p.status === 'active' ? '#0F6B54' : '#92400e' }}>{p.status}</span></td>
                        <td className="py-3">
                          <Button size="sm" variant="outline" className="gap-1"><Edit className="w-3.5 h-3.5" /> Edit</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="font-serif text-xl font-bold mb-4">Fresh Leads</h2>
            {leads.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">No leads yet.</div>
            ) : (
              <div className="space-y-3">
                {leads.map((l, i) => (
                  <div key={l.id} className="p-3 rounded-xl border border-slate-100 relative">
                    {i === 0 && <span className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: '#fee2e2', color: '#dc2626' }}><Star className="w-3 h-3 fill-current" /> HOT</span>}
                    <div className="font-semibold text-sm">{l.name}</div>
                    <div className="text-xs text-slate-500 mb-2">Interested in {l.property_title || l.property_id}</div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">{new Date(l.created_at).toLocaleDateString('en-IN')}</span>
                      <a href={`tel:${l.phone}`} className="flex items-center gap-1 font-semibold" style={{ color: '#0F6B54' }}><Phone className="w-3 h-3" /> Call</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="lg:col-span-3 bg-white rounded-2xl p-6 border border-slate-100">
            <h2 className="font-serif text-xl font-bold mb-4">Performance (Last 30 days)</h2>
            <div className="h-56 flex items-end gap-2">
              {Array.from({ length: 30 }).map((_, i) => {
                const h = 30 + Math.random() * 70;
                return <div key={i} className="flex-1 rounded-t transition-all hover:opacity-80" style={{ height: `${h}%`, background: i > 24 ? '#D4A24C' : '#0F6B54' }} title={`Day ${i + 1}`} />;
              })}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-slate-500">
              <span>Day 1</span><span>Day 15</span><span>Today</span>
            </div>
          </section>
        </div>
      )}
    </DashboardShell>
  );
};

export default AgentDashboard;
