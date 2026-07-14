import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import * as Icons from 'lucide-react';
import { SERVICE_CARDS, PREMIUM_CATEGORIES } from '../mock';

export const ServiceCardsSection = () => (
  <section className="py-16 md:py-20 bg-brand-cream" style={{ background: '#F5F1E8' }}>
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {SERVICE_CARDS.map((s, i) => {
          const Icon = Icons[s.icon] || Icons.Home;
          return (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Link to="/properties" className="card-lift block bg-white rounded-2xl p-6 border border-emerald-100 h-full">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #0F6B54, #094836)' }}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">{s.desc}</p>
                <div className="flex items-center text-sm font-semibold gap-1" style={{ color: '#0F6B54' }}>
                  Explore <Icons.ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export const PremiumCategoriesSection = () => (
  <section className="py-16 md:py-24">
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
      <SectionHeading eyebrow="✦ Exclusive Listings" title="Premium Exclusive Properties" subtitle="Extraordinary investment opportunities crafted for visionary investors across India" />

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-4">
        {PREMIUM_CATEGORIES.map((cat, i) => {
          const Icon = Icons[cat.icon] || Icons.Star;
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 8) * 0.05 }}
            >
              <Link to="/properties" className="group flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-emerald-50 transition-colors">
                <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-emerald-100 flex items-center justify-center group-hover:scale-110 group-hover:shadow-lg transition-all">
                  <Icon className="w-7 h-7" style={{ color: '#0F6B54' }} />
                </div>
                <span className="text-xs md:text-sm text-center text-slate-700 font-medium leading-tight">{cat.name}</span>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </div>
  </section>
);

export const SectionHeading = ({ eyebrow, title, subtitle, action }) => (
  <div className="mb-10 md:mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
    <div>
      {eyebrow && <div className="text-sm font-semibold tracking-wider uppercase mb-2" style={{ color: '#D4A24C' }}>{eyebrow}</div>}
      <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">{title}</h2>
      {subtitle && <p className="text-slate-600 mt-3 max-w-2xl leading-relaxed">{subtitle}</p>}
    </div>
    {action}
  </div>
);

export default ServiceCardsSection;
