import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardShell, StatCard } from './DashboardShell';
import { Users, Building2, IndianRupee, TrendingUp, Shield, CheckCircle2, XCircle, Eye, MoreVertical, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { PROPERTIES, BUILDERS, formatINR } from '../../mock';
import { Button } from '../../components/ui/button';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');

  if (!user || user.role !== 'super_admin') return <Navigate to="/login" replace />;

  const pendingVerification = PROPERTIES.filter(p => !p.verified).slice(0, 5);
  const users = [
    { name: 'Rahul Sharma', email: 'agent@bahubali.com', role: 'agent', status: 'active', joined: '2024-08-15', listings: 12 },
    { name: 'Priya Patel', email: 'user@bahubali.com', role: 'user', status: 'active', joined: '2024-11-02', listings: 0 },
    { name: 'Vikram Kumar', email: 'vk@builder.com', role: 'agent', status: 'active', joined: '2024-06-20', listings: 45 },
    { name: 'Neha Singh', email: 'neha@example.com', role: 'user', status: 'suspended', joined: '2025-01-10', listings: 2 },
    { name: 'Arjun Rao', email: 'arjun@example.com', role: 'agent', status: 'pending', joined: '2025-02-14', listings: 3 }
  ];

  return (
    <DashboardShell role="super_admin" title="Super Admin Console" subtitle="Complete platform control and analytics">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value="12,458" change={+8} />
        <StatCard icon={Building2} label="Active Listings" value={PROPERTIES.length + 3200} change={+15} color="#D4A24C" />
        <StatCard icon={IndianRupee} label="Monthly GMV" value="₹ 4.2 Cr" change={+22} />
        <StatCard icon={AlertCircle} label="Pending Verify" value={pendingVerification.length + 45} color="#dc2626" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
        {['overview', 'users', 'properties', 'verification', 'reports'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold capitalize transition-colors border-b-2 ${tab === t ? '' : 'border-transparent text-slate-600 hover:text-slate-900'}`} style={{ borderColor: tab === t ? '#0F6B54' : 'transparent', color: tab === t ? '#0F6B54' : undefined }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl p-6 border border-slate-100">
            <h3 className="font-serif text-lg font-bold mb-4">Platform Growth</h3>
            <div className="h-64 flex items-end gap-1.5">
              {Array.from({ length: 12 }).map((_, i) => {
                const h = 25 + i * 5 + Math.random() * 15;
                return <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full rounded-t" style={{ height: `${h * 2.5}px`, background: 'linear-gradient(180deg, #D4A24C, #0F6B54)' }} />
                  <span className="text-[10px] text-slate-500">{['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}</span>
                </div>;
              })}
            </div>
          </section>

          <section className="bg-white rounded-2xl p-6 border border-slate-100">
            <h3 className="font-serif text-lg font-bold mb-4">Property Distribution</h3>
            <div className="space-y-4">
              {[
                { label: 'Residential', pct: 55, count: '6.8K' },
                { label: 'Commercial', pct: 20, count: '2.5K' },
                { label: 'Independent', pct: 15, count: '1.9K' },
                { label: 'Industrial', pct: 6, count: '750' },
                { label: 'Agricultural', pct: 4, count: '480' }
              ].map(cat => (
                <div key={cat.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">{cat.label}</span>
                    <span className="text-slate-500">{cat.count} · {cat.pct}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${cat.pct}%`, background: '#0F6B54' }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold">Pending Verification Queue</h3>
              <span className="text-xs px-2.5 py-1 rounded-md font-semibold" style={{ background: '#fef3c7', color: '#92400e' }}>{pendingVerification.length} awaiting review</span>
            </div>
            <div className="space-y-2">
              {pendingVerification.map(p => (
                <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                  <img src={p.image} className="w-14 h-14 rounded-lg object-cover" alt="" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">{p.title}</div>
                    <div className="text-xs text-slate-500">{p.locality}, {p.city} · by {p.postedBy} · {p.postedAt}</div>
                  </div>
                  <div className="font-bold" style={{ color: '#0F6B54' }}>{formatINR(p.price)}</div>
                  <div className="flex gap-1">
                    <button className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" style={{ color: '#0F6B54' }} /></button>
                    <button className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center"><XCircle className="w-4 h-4 text-red-600" /></button>
                    <button className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center"><Eye className="w-4 h-4 text-slate-500" /></button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {tab === 'users' && (
        <section className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold">User Management</h3>
            <input placeholder="Search users..." className="px-3 py-2 border border-slate-200 rounded-lg text-sm" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-slate-500 uppercase">
                <tr className="border-b border-slate-200">
                  <th className="py-3">User</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Joined</th>
                  <th className="py-3">Listings</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.email} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center text-xs">{u.name[0]}</div>
                        <div><div className="font-semibold">{u.name}</div><div className="text-xs text-slate-500">{u.email}</div></div>
                      </div>
                    </td>
                    <td className="py-3"><span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: u.role === 'agent' ? '#fef3c7' : '#e0e7ff', color: u.role === 'agent' ? '#92400e' : '#4338ca' }}>{u.role}</span></td>
                    <td className="py-3"><span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: u.status === 'active' ? '#dcfce7' : u.status === 'pending' ? '#fef3c7' : '#fee2e2', color: u.status === 'active' ? '#0F6B54' : u.status === 'pending' ? '#92400e' : '#dc2626' }}>{u.status}</span></td>
                    <td className="py-3 text-slate-500">{u.joined}</td>
                    <td className="py-3">{u.listings}</td>
                    <td className="py-3"><button className="p-1.5 hover:bg-slate-100 rounded"><MoreVertical className="w-4 h-4" /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {tab === 'properties' && (
        <section className="bg-white rounded-2xl p-6 border border-slate-100">
          <h3 className="font-serif text-lg font-bold mb-4">All Properties ({PROPERTIES.length})</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PROPERTIES.slice(0, 9).map(p => (
              <div key={p.id} className="flex gap-3 p-3 border border-slate-100 rounded-xl hover:shadow-md transition-shadow">
                <img src={p.image} className="w-16 h-16 rounded object-cover" alt="" />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">{p.title}</div>
                  <div className="text-xs text-slate-500">{p.city}</div>
                  <div className="text-xs font-bold mt-1" style={{ color: '#0F6B54' }}>{formatINR(p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'verification' && (
        <section className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5" style={{ color: '#0F6B54' }} />
            <h3 className="font-serif text-lg font-bold">Verification Center</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 rounded-xl bg-emerald-50"><div className="text-xs uppercase text-emerald-700">Approved</div><div className="font-serif text-3xl font-bold" style={{ color: '#0F6B54' }}>1,248</div></div>
            <div className="p-4 rounded-xl bg-amber-50"><div className="text-xs uppercase text-amber-700">Pending</div><div className="font-serif text-3xl font-bold text-amber-700">{pendingVerification.length + 45}</div></div>
            <div className="p-4 rounded-xl bg-red-50"><div className="text-xs uppercase text-red-700">Rejected</div><div className="font-serif text-3xl font-bold text-red-700">28</div></div>
          </div>
          <div className="space-y-2">
            {pendingVerification.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl">
                <img src={p.image} className="w-14 h-14 rounded object-cover" alt="" />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{p.title}</div>
                  <div className="text-xs text-slate-500">Documents uploaded · RERA pending</div>
                </div>
                <Button size="sm" className="text-white" style={{ background: '#0F6B54' }}>Review</Button>
              </div>
            ))}
          </div>
        </section>
      )}

      {tab === 'reports' && (
        <section className="bg-white rounded-2xl p-6 border border-slate-100">
          <h3 className="font-serif text-lg font-bold mb-6">Platform Reports</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {['Monthly Revenue Report', 'Active Users Analysis', 'Property Views Report', 'Listing Performance', 'Agent Rankings', 'Enquiry Conversions'].map(r => (
              <div key={r} className="p-5 border border-slate-100 rounded-xl hover:shadow-md transition-all cursor-pointer">
                <TrendingUp className="w-6 h-6 mb-3" style={{ color: '#0F6B54' }} />
                <div className="font-semibold text-sm">{r}</div>
                <div className="text-xs text-slate-500 mt-1">Generated on {new Date().toLocaleDateString()}</div>
                <Button variant="outline" size="sm" className="mt-3 w-full">Download PDF</Button>
              </div>
            ))}
          </div>
        </section>
      )}
    </DashboardShell>
  );
};

export default AdminDashboard;
