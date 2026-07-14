import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { DashboardShell, StatCard } from './DashboardShell';
import { Users, Building2, IndianRupee, Shield, CheckCircle2, XCircle, Eye, MoreVertical, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { formatINR } from '../../mock';
import { Button } from '../../components/ui/button';
import { adminAPI } from '../../api';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== 'super_admin') return;
    (async () => {
      try {
        const [s, u, p] = await Promise.all([
          adminAPI.stats(),
          adminAPI.users(),
          adminAPI.pending()
        ]);
        setStats(s.data);
        setUsers(u.data || []);
        setPending(p.data || []);
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [user]);

  if (!user || user.role !== 'super_admin') return <Navigate to="/login" replace />;

  const handleVerify = async (id, approve) => {
    try {
      await adminAPI.verify(id, approve);
      setPending(pending.filter(p => p.id !== id));
      toast.success(approve ? 'Property approved' : 'Property rejected');
    } catch (e) { toast.error('Failed'); }
  };

  const handleStatusUpdate = async (userId, status) => {
    try {
      await adminAPI.updateUserStatus(userId, status);
      setUsers(users.map(u => u.id === userId ? { ...u, status } : u));
      toast.success(`User ${status}`);
    } catch (e) { toast.error('Failed'); }
  };

  if (loading || !stats) {
    return <DashboardShell role="super_admin" title="Super Admin Console" subtitle="Loading platform data...">
      <div className="flex justify-center py-24"><Loader2 className="w-10 h-10 animate-spin" style={{ color: '#0F6B54' }} /></div>
    </DashboardShell>;
  }

  const dist = stats.distribution || {};
  const total_dist = Object.values(dist).reduce((s, v) => s + v, 0) || 1;

  return (
    <DashboardShell role="super_admin" title="Super Admin Console" subtitle="Complete platform control · GLCZONE Pvt. Ltd.">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={stats.users?.total || 0} />
        <StatCard icon={Building2} label="Active Listings" value={stats.properties?.active || 0} color="#D4A24C" />
        <StatCard icon={IndianRupee} label="Total GMV" value={formatINR(stats.gmv)} />
        <StatCard icon={AlertCircle} label="Pending Verify" value={pending.length} color="#dc2626" />
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
        {['overview', 'users', 'verification', 'reports'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-semibold capitalize transition-colors border-b-2`} style={{ borderColor: tab === t ? '#0F6B54' : 'transparent', color: tab === t ? '#0F6B54' : '#64748b' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <div className="grid lg:grid-cols-2 gap-6">
          <section className="bg-white rounded-2xl p-6 border border-slate-100">
            <h3 className="font-serif text-lg font-bold mb-4">Platform Growth (12 months)</h3>
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
            <h3 className="font-serif text-lg font-bold mb-4">Property Type Distribution</h3>
            <div className="space-y-4">
              {Object.entries(dist).map(([type, count]) => {
                const pct = ((count / total_dist) * 100);
                return (
                  <div key={type}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold">{type}</span>
                      <span className="text-slate-500">{count} · {pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: '#0F6B54' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-lg font-bold">Pending Verification Queue</h3>
              <span className="text-xs px-2.5 py-1 rounded-md font-semibold" style={{ background: '#fef3c7', color: '#92400e' }}>{pending.length} awaiting review</span>
            </div>
            {pending.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-sm">All caught up! No pending items.</div>
            ) : (
              <div className="space-y-2">
                {pending.slice(0, 6).map(p => (
                  <div key={p.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50">
                    <img src={p.image} className="w-14 h-14 rounded-lg object-cover" alt="" />
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm truncate">{p.title}</div>
                      <div className="text-xs text-slate-500">{p.locality}, {p.city} · by {p.posted_by}</div>
                    </div>
                    <div className="font-bold" style={{ color: '#0F6B54' }}>{formatINR(p.price)}</div>
                    <div className="flex gap-1">
                      <button onClick={() => handleVerify(p.id, true)} title="Approve" className="w-8 h-8 rounded-lg bg-emerald-50 hover:bg-emerald-100 flex items-center justify-center"><CheckCircle2 className="w-4 h-4" style={{ color: '#0F6B54' }} /></button>
                      <button onClick={() => handleVerify(p.id, false)} title="Reject" className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center"><XCircle className="w-4 h-4 text-red-600" /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {tab === 'users' && (
        <section className="bg-white rounded-2xl p-6 border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-serif text-lg font-bold">User Management ({users.length})</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-slate-500 uppercase">
                <tr className="border-b border-slate-200">
                  <th className="py-3">User</th>
                  <th className="py-3">Role</th>
                  <th className="py-3">Status</th>
                  <th className="py-3">Joined</th>
                  <th className="py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center text-xs">{u.name[0]}</div>
                        <div><div className="font-semibold">{u.name}</div><div className="text-xs text-slate-500">{u.email}</div></div>
                      </div>
                    </td>
                    <td className="py-3"><span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: u.role === 'agent' ? '#fef3c7' : u.role === 'super_admin' ? '#0F6B5420' : '#e0e7ff', color: u.role === 'agent' ? '#92400e' : u.role === 'super_admin' ? '#0F6B54' : '#4338ca' }}>{u.role}</span></td>
                    <td className="py-3"><span className="text-xs px-2 py-0.5 rounded font-semibold" style={{ background: u.status === 'active' ? '#dcfce7' : u.status === 'pending' ? '#fef3c7' : '#fee2e2', color: u.status === 'active' ? '#0F6B54' : u.status === 'pending' ? '#92400e' : '#dc2626' }}>{u.status}</span></td>
                    <td className="py-3 text-slate-500">{new Date(u.created_at).toLocaleDateString('en-IN')}</td>
                    <td className="py-3">
                      {u.role !== 'super_admin' && (
                        <div className="flex gap-1">
                          {u.status !== 'active' && <button onClick={() => handleStatusUpdate(u.id, 'active')} className="px-2 py-1 text-xs rounded bg-emerald-50 hover:bg-emerald-100" style={{ color: '#0F6B54' }}>Activate</button>}
                          {u.status !== 'suspended' && <button onClick={() => handleStatusUpdate(u.id, 'suspended')} className="px-2 py-1 text-xs rounded bg-red-50 hover:bg-red-100 text-red-600">Suspend</button>}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
            <div className="p-4 rounded-xl bg-emerald-50"><div className="text-xs uppercase text-emerald-700">Approved</div><div className="font-serif text-3xl font-bold" style={{ color: '#0F6B54' }}>{stats.properties?.verified || 0}</div></div>
            <div className="p-4 rounded-xl bg-amber-50"><div className="text-xs uppercase text-amber-700">Pending</div><div className="font-serif text-3xl font-bold text-amber-700">{pending.length}</div></div>
            <div className="p-4 rounded-xl bg-red-50"><div className="text-xs uppercase text-red-700">Total</div><div className="font-serif text-3xl font-bold text-red-700">{stats.properties?.total || 0}</div></div>
          </div>
          <div className="space-y-2">
            {pending.map(p => (
              <div key={p.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl">
                <img src={p.image} className="w-14 h-14 rounded object-cover" alt="" />
                <div className="flex-1">
                  <div className="font-semibold text-sm">{p.title}</div>
                  <div className="text-xs text-slate-500">{p.locality}, {p.city} · ₹{formatINR(p.price)}</div>
                </div>
                <Button size="sm" className="text-white" style={{ background: '#0F6B54' }} onClick={() => handleVerify(p.id, true)}>Approve</Button>
                <Button size="sm" variant="outline" onClick={() => handleVerify(p.id, false)}>Reject</Button>
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
