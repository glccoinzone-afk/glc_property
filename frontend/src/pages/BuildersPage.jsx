import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Building2, Calendar } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BuilderCard from '../components/BuilderCard';
import { BUILDERS, LAND_PROJECTS } from '../mock';

const BuildersPage = () => {
  return (
    <div>
      <Header />

      {/* Hero */}
      <section className="relative py-20 text-white overflow-hidden" style={{ background: 'linear-gradient(135deg, #0F6B54, #094836)' }}>
        <div className="absolute inset-0 opacity-15" style={{ backgroundImage: 'url(https://images.pexels.com/photos/16110999/pexels-photo-16110999.jpeg)', backgroundSize: 'cover', mixBlendMode: 'overlay' }} />
        <div className="relative max-w-[1440px] mx-auto px-4 lg:px-8 text-center">
          <div className="text-sm font-semibold tracking-wider uppercase mb-3" style={{ color: '#E8C168' }}>Trusted by 500+ builders</div>
          <h1 className="font-serif text-4xl md:text-6xl font-bold mb-4">Top Builders & Projects in India</h1>
          <p className="text-lg text-white/85 max-w-2xl mx-auto">Explore RERA-approved projects from India's most trusted builders and land developers across 200+ cities.</p>
        </div>
      </section>

      <section className="py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-8">Featured Builders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {BUILDERS.map((b, i) => <BuilderCard key={b.id} builder={b} index={i} />)}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20" style={{ background: '#F5F1E8' }}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-8">Land Developer Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {LAND_PROJECTS.map((l, i) => <BuilderCard key={l.id} builder={{ ...l, pricePerSqft: l.price, projects: l.developer }} index={i} />)}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BuildersPage;
