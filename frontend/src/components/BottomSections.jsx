import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { CONNECTOR_SERVICES, POPULAR_SEARCHES } from '../mock';
import { SectionHeading } from './HomeSections';
import { Button } from './ui/button';

export const ConnectorServices = () => (
  <section className="py-16 md:py-24" style={{ background: '#F5F1E8' }}>
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
      <SectionHeading eyebrow="Professional Services" title="Connector Smartwork Services" subtitle="Connect with expert professionals for all your construction and property needs" />
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {CONNECTOR_SERVICES.map((s, i) => {
          const Icon = Icons[s.icon] || Icons.Wrench;
          return (
            <motion.a
              key={s.name}
              href="#"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.03 }}
              className="group bg-white rounded-xl p-4 flex flex-col items-center gap-2 border border-transparent hover:border-emerald-200 hover:shadow-md transition-all"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Icon className="w-5 h-5" style={{ color: '#0F6B54' }} />
              </div>
              <div className="text-xs text-center text-slate-700 font-medium leading-tight">{s.name}</div>
            </motion.a>
          );
        })}
      </div>
    </div>
  </section>
);

export const NewsletterSection = () => (
  <section className="py-16 md:py-20">
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl overflow-hidden p-10 md:p-14 text-white"
        style={{ background: 'linear-gradient(135deg, #0F6B54 0%, #094836 100%)' }}
      >
        <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full opacity-10" style={{ background: '#D4A24C' }} />
        <div className="absolute -bottom-32 -left-16 w-96 h-96 rounded-full opacity-10" style={{ background: '#D4A24C' }} />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="text-sm font-semibold tracking-wider uppercase mb-3" style={{ color: '#E8C168' }}>Stay Updated</div>
            <h3 className="font-serif text-3xl md:text-4xl font-bold mb-3">Get Property Alerts in Your Inbox</h3>
            <p className="text-white/85 leading-relaxed">New listings, price drops, and market insights — delivered weekly. No spam.</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed successfully!'); }} className="flex gap-2">
            <input type="email" required placeholder="you@example.com" className="flex-1 px-4 py-3 rounded-xl bg-white/95 text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
            <Button type="submit" className="font-semibold text-slate-900 px-6" style={{ background: '#D4A24C' }}>Subscribe</Button>
          </form>
        </div>
      </motion.div>
    </div>
  </section>
);

export const PopularSearches = () => {
  const iconMap = { sale: Icons.Home, rent: Icons.Key, projects: Icons.Building2, agents: Icons.UserCircle };
  const labelMap = { sale: 'Property for Sale', rent: 'Property for Rent', projects: 'New Projects', agents: 'Property Agents' };

  return (
    <section className="py-16 md:py-20" style={{ background: '#F5F1E8' }}>
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <SectionHeading title="Popular Searches" subtitle="Browse properties, projects and agents across India's top real estate markets." />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.entries(POPULAR_SEARCHES).map(([key, cities]) => {
            const Icon = iconMap[key];
            return (
              <div key={key} className="bg-white rounded-2xl p-6 border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#0F6B54' }}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900">{labelMap[key]}</h4>
                </div>
                <ul className="space-y-2">
                  {cities.map(c => (
                    <li key={c}>
                      <Link to="/properties" className="text-sm text-slate-600 hover:text-emerald-700 transition-colors">
                        {labelMap[key]} in {c}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export const CTABanner = () => (
  <section className="py-16 md:py-20">
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
      <div className="relative rounded-3xl overflow-hidden py-16 px-8 md:px-14 text-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(https://images.pexels.com/photos/16110999/pexels-photo-16110999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940)` }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(9,72,54,0.9), rgba(11,31,26,0.9))' }} />
        <div className="relative text-white">
          <h2 className="font-serif text-3xl md:text-5xl font-bold mb-4">Find Your Dream Property Today</h2>
          <p className="text-lg md:text-xl text-white/85 max-w-2xl mx-auto mb-8">Explore our exclusive selection of luxury homes and premier real estate across India</p>
          <Link to="/properties">
            <Button size="lg" className="font-semibold px-8 text-slate-900 shadow-xl" style={{ background: '#D4A24C' }}>Get Started Now</Button>
          </Link>
        </div>
      </div>
    </div>
  </section>
);
