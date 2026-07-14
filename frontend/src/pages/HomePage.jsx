import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import StatsSection from '../components/StatsSection';
import { ServiceCardsSection, PremiumCategoriesSection, SectionHeading } from '../components/HomeSections';
import PropertyCard from '../components/PropertyCard';
import BuilderCard from '../components/BuilderCard';
import { ConnectorServices, NewsletterSection, PopularSearches, CTABanner } from '../components/BottomSections';
import { PROPERTIES, BUILDERS, LAND_PROJECTS } from '../mock';

const HomePage = () => {
  const premiumProps = PROPERTIES.filter(p => p.premium).slice(0, 8);
  const recentProps = PROPERTIES.slice(0, 10);
  const featuredBuilders = BUILDERS.slice(0, 8);
  const vipBuilders = BUILDERS.slice(0, 2);
  const featuredLand = LAND_PROJECTS.slice(0, 2);
  const vipLand = LAND_PROJECTS.slice(2, 4);

  return (
    <div>
      <Header />
      <Hero />
      <StatsSection />
      <ServiceCardsSection />
      <PremiumCategoriesSection />

      {/* Premium properties */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <SectionHeading
            eyebrow="Handpicked For You"
            title="Premium Properties in India"
            action={<ViewAllLink to="/properties" />}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {premiumProps.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Recent properties */}
      <section className="py-16 md:py-20" style={{ background: '#F5F1E8' }}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="Latest Listings" title="Top Recent Properties" action={<ViewAllLink to="/properties" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {recentProps.map((p, i) => <PropertyCard key={p.id} property={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* Gorgeous Builder Projects */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="Builder Showcase" title="Gorgeous Builder Projects" action={<ViewAllLink to="/builders" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredBuilders.map((b, i) => <BuilderCard key={b.id} builder={b} index={i} />)}
          </div>
        </div>
      </section>

      {/* Featured Builder Projects */}
      <section className="py-16 md:py-20" style={{ background: '#F5F1E8' }}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="⭐ Featured" title="Featured Builder Projects" subtitle="Exceptional investment opportunities from our trusted builders" action={<ViewAllLink to="/builders" text="View All Projects" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BUILDERS.slice(0, 2).map((b, i) => <BuilderCard key={b.id} builder={b} index={i} tag="Featured" />)}
          </div>
        </div>
      </section>

      {/* VIP Builder Projects */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="👑 VIP Exclusive" title="VIP Builder Projects" subtitle="Exclusive projects from our premium VIP Builders" action={<ViewAllLink to="/builders" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vipBuilders.map((b, i) => <BuilderCard key={b.id} builder={b} index={i} tag="VIP" />)}
          </div>
        </div>
      </section>

      {/* Land developer projects */}
      <section className="py-16 md:py-20" style={{ background: '#F5F1E8' }}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="Land Opportunities" title="Land Developer Projects" action={<ViewAllLink to="/properties" />} />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {LAND_PROJECTS.slice(0, 4).map((b, i) => <BuilderCard key={b.id} builder={{ ...b, pricePerSqft: b.price, projects: b.developer }} index={i} />)}
          </div>
        </div>
      </section>

      {/* Featured land */}
      <section className="py-16 md:py-20">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="⭐ Featured" title="Featured Land Developer Projects" subtitle="Exceptional opportunities from our trusted land developers" action={<ViewAllLink to="/properties" text="View All Projects" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {featuredLand.map((b, i) => <BuilderCard key={b.id} builder={{ ...b, pricePerSqft: b.price, projects: b.developer }} index={i} tag="Featured" />)}
          </div>
        </div>
      </section>

      {/* VIP land */}
      <section className="py-16 md:py-20" style={{ background: '#F5F1E8' }}>
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <SectionHeading eyebrow="👑 VIP Exclusive" title="VIP Land Projects" subtitle="Exclusive land projects from our VIP developers" action={<ViewAllLink to="/properties" />} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vipLand.map((b, i) => <BuilderCard key={b.id} builder={{ ...b, pricePerSqft: b.price, projects: b.developer }} index={i} tag="VIP" />)}
          </div>
        </div>
      </section>

      <CTABanner />
      <ConnectorServices />
      <NewsletterSection />
      <PopularSearches />

      <Footer />
    </div>
  );
};

const ViewAllLink = ({ to, text = 'View All' }) => (
  <Link to={to} className="inline-flex items-center gap-1 text-sm font-semibold px-4 py-2 rounded-lg border-2 hover:bg-emerald-50 transition-colors" style={{ borderColor: '#0F6B54', color: '#0F6B54' }}>
    {text} <ChevronRight className="w-4 h-4" />
  </Link>
);

export default HomePage;
