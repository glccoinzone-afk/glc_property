import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import { ServiceCardsSection, PremiumCategoriesSection, SectionHeading } from '../components/HomeSections';
import PropertyCard from '../components/PropertyCard';
import BuilderCard from '../components/BuilderCard';
import { ConnectorServices, NewsletterSection, PopularSearches, CTABanner } from '../components/BottomSections';
import { propertiesAPI, buildersAPI } from '../api';

const HomePage = () => {
  const [premium, setPremium] = useState([]);
  const [recent, setRecent] = useState([]);
  const [builders, setBuilders] = useState([]);
  const [land, setLand] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [premiumRes, recentRes, buildersRes, landRes] = await Promise.all([
          propertiesAPI.list({ premium: true, limit: 8 }),
          propertiesAPI.list({ limit: 10, sort: 'newest' }),
          buildersAPI.list({ limit: 8 }),
          buildersAPI.land({ limit: 6 })
        ]);
        setPremium(premiumRes.data.items || []);
        setRecent(recentRes.data.items || []);
        setBuilders(buildersRes.data || []);
        setLand(landRes.data || []);
      } catch (e) {
        console.error('Failed to load home data', e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const vipBuilders = builders.filter(b => b.is_vip).slice(0, 2);
  const featuredBuilders = builders.filter(b => b.is_featured).slice(0, 2);
  const vipLand = land.filter(l => l.is_vip).slice(0, 2);
  const featuredLand = land.filter(l => l.is_featured).slice(0, 2);

  return (
    <div>
      <Header />
      <Hero />
      <StatsSection />
      <ServiceCardsSection />
      <PremiumCategoriesSection />

      <Section eyebrow="Handpicked For You" title="Premium Properties in Bihar & India" to="/properties">
        {loading ? <SkeletonRow /> : <Grid>{premium.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}</Grid>}
      </Section>

      <Section eyebrow="Latest Listings" title="Top Recent Properties" to="/properties" bg>
        {loading ? <SkeletonRow /> : <Grid cols={5}>{recent.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}</Grid>}
      </Section>

      <Section eyebrow="Builder Showcase" title="Gorgeous Builder Projects" to="/builders">
        {loading ? <SkeletonRow /> : <Grid>{builders.map((b, i) => <BuilderCard key={b.id} builder={b} index={i} />)}</Grid>}
      </Section>

      {featuredBuilders.length > 0 && (
        <Section eyebrow="⭐ Featured" title="Featured Builder Projects" subtitle="Exceptional investment opportunities from our trusted builders" to="/builders" bg>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredBuilders.map((b, i) => <BuilderCard key={b.id} builder={b} index={i} tag="Featured" />)}
          </div>
        </Section>
      )}

      {vipBuilders.length > 0 && (
        <Section eyebrow="👑 VIP Exclusive" title="VIP Builder Projects" subtitle="Exclusive projects from our premium VIP Builders" to="/builders">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vipBuilders.map((b, i) => <BuilderCard key={b.id} builder={b} index={i} tag="VIP" />)}
          </div>
        </Section>
      )}

      <Section eyebrow="Land Opportunities" title="Land Developer Projects" to="/properties" bg>
        {loading ? <SkeletonRow /> : <Grid>{land.slice(0, 4).map((b, i) => <BuilderCard key={b.id} builder={{ ...b, projects: b.developer }} index={i} />)}</Grid>}
      </Section>

      {featuredLand.length > 0 && (
        <Section eyebrow="⭐ Featured" title="Featured Land Developer Projects" subtitle="Exceptional opportunities from our trusted land developers" to="/properties">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredLand.map((b, i) => <BuilderCard key={b.id} builder={{ ...b, projects: b.developer }} index={i} tag="Featured" />)}
          </div>
        </Section>
      )}

      {vipLand.length > 0 && (
        <Section eyebrow="👑 VIP Exclusive" title="VIP Land Projects" subtitle="Exclusive land projects from our VIP developers" to="/properties" bg>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vipLand.map((b, i) => <BuilderCard key={b.id} builder={{ ...b, projects: b.developer }} index={i} tag="VIP" />)}
          </div>
        </Section>
      )}

      <CTABanner />
      <ConnectorServices />
      <NewsletterSection />
      <PopularSearches />

      <Footer />
    </div>
  );
};

const Section = ({ eyebrow, title, subtitle, to = '/properties', bg = false, children }) => (
  <section className={`py-16 md:py-20 ${bg ? '' : ''}`} style={bg ? { background: '#F5F1E8' } : {}}>
    <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
      <SectionHeading eyebrow={eyebrow} title={title} subtitle={subtitle} action={<ViewAllLink to={to} />} />
      {children}
    </div>
  </section>
);

const Grid = ({ children, cols = 4 }) => (
  <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${cols} gap-6`}>
    {children}
  </div>
);

const SkeletonRow = () => (
  <div className="flex items-center justify-center py-16">
    <Loader2 className="w-8 h-8 animate-spin" style={{ color: '#0F6B54' }} />
  </div>
);

const ViewAllLink = ({ to, text = 'View All' }) => (
  <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-lg border-2 hover:bg-emerald-50 transition-colors" style={{ borderColor: '#0F6B54', color: '#0F6B54' }}>
    {text} <ChevronRight className="w-4 h-4" />
  </Link>
);

export default HomePage;
