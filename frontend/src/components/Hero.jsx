import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HERO_IMAGES } from '../mock';
import SearchBar from './SearchBar';
import { CheckCircle2, Shield, Award } from 'lucide-react';

const Hero = () => {
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setImgIdx(i => (i + 1) % HERO_IMAGES.length), 5500);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '92vh' }}>
      {/* Rotating background images (Ken Burns) */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={imgIdx}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1.15 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.4 }, scale: { duration: 8, ease: 'linear' } }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGES[imgIdx]})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(9,72,54,0.9) 0%, rgba(15,107,84,0.75) 45%, rgba(11,31,26,0.85) 100%)' }} />
        <div className="absolute inset-0 noise-overlay" />
      </div>

      {/* Animated parallax skyline SVG */}
      <div className="absolute inset-x-0 bottom-0 pointer-events-none">
        <SkylineSVG />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-[1440px] mx-auto px-4 lg:px-8 pt-16 lg:pt-24 pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm text-xs font-medium text-white/95 mb-6">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#D4A24C' }} />
            India's Trusted Real Estate Platform · A GLCZONE Initiative
          </div>

          <h1 className="font-serif text-white text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
            Find Your <em className="not-italic" style={{ color: '#E8C168' }}>Dream</em>
            <br />Property in Bihar & Beyond
          </h1>
          <p className="text-lg md:text-xl text-white/85 mb-8 max-w-2xl leading-relaxed">
            Premium residential, commercial, and agricultural properties across Kishanganj, Bihar and 200+ cities in India. Curated by GLC Property.
          </p>

          <div className="flex flex-wrap gap-6 mb-10">
            {[
              { icon: CheckCircle2, text: 'Verified Listings' },
              { icon: Shield, text: 'Zero Brokerage Options' },
              { icon: Award, text: '500+ Trusted Builders' }
            ].map(({ icon: Icon, text }, i) => (
              <motion.div
                key={text}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.15 }}
                className="flex items-center gap-2 text-white/90 text-sm font-medium"
              >
                <Icon className="w-5 h-5" style={{ color: '#D4A24C' }} />
                {text}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <SearchBar />
        </motion.div>
      </div>

      {/* Image indicator dots */}
      <div className="absolute bottom-8 right-8 z-10 flex gap-2">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => setImgIdx(i)}
            className="h-1.5 rounded-full transition-all"
            style={{ width: i === imgIdx ? 28 : 8, background: i === imgIdx ? '#D4A24C' : 'rgba(255,255,255,0.5)' }}
          />
        ))}
      </div>
    </section>
  );
};

const SkylineSVG = () => (
  <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="w-full h-40 md:h-56">
    <defs>
      <linearGradient id="bldg" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0%" stopColor="#0F6B54" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#051510" stopOpacity="1" />
      </linearGradient>
    </defs>
    {/* Back layer buildings */}
    <g opacity="0.55">
      <rect x="0" y="110" width="70" height="90" fill="url(#bldg)" />
      <rect x="80" y="80" width="55" height="120" fill="url(#bldg)" />
      <rect x="145" y="95" width="90" height="105" fill="url(#bldg)" />
      <rect x="245" y="70" width="60" height="130" fill="url(#bldg)" />
      <rect x="315" y="105" width="75" height="95" fill="url(#bldg)" />
      <rect x="400" y="85" width="50" height="115" fill="url(#bldg)" />
      <rect x="460" y="100" width="85" height="100" fill="url(#bldg)" />
      <rect x="555" y="75" width="70" height="125" fill="url(#bldg)" />
      <rect x="635" y="95" width="55" height="105" fill="url(#bldg)" />
      <rect x="700" y="110" width="80" height="90" fill="url(#bldg)" />
      <rect x="790" y="80" width="65" height="120" fill="url(#bldg)" />
      <rect x="865" y="100" width="90" height="100" fill="url(#bldg)" />
      <rect x="965" y="70" width="55" height="130" fill="url(#bldg)" />
      <rect x="1030" y="105" width="85" height="95" fill="url(#bldg)" />
      <rect x="1125" y="85" width="70" height="115" fill="url(#bldg)" />
      <rect x="1205" y="100" width="55" height="100" fill="url(#bldg)" />
      <rect x="1270" y="75" width="90" height="125" fill="url(#bldg)" />
      <rect x="1370" y="95" width="70" height="105" fill="url(#bldg)" />
    </g>
    {/* Front layer - animated float */}
    <g className="animate-float">
      <rect x="20" y="130" width="80" height="70" fill="#051510" />
      <rect x="110" y="105" width="60" height="95" fill="#0B1F1A" />
      <rect x="180" y="120" width="100" height="80" fill="#051510" />
      <rect x="290" y="95" width="70" height="105" fill="#0B1F1A" />
      <rect x="370" y="115" width="85" height="85" fill="#051510" />
      <rect x="465" y="90" width="55" height="110" fill="#0B1F1A" />
      <rect x="530" y="125" width="95" height="75" fill="#051510" />
      <rect x="635" y="100" width="70" height="100" fill="#0B1F1A" />
      <rect x="715" y="130" width="80" height="70" fill="#051510" />
      <rect x="805" y="105" width="90" height="95" fill="#0B1F1A" />
      <rect x="905" y="120" width="65" height="80" fill="#051510" />
      <rect x="980" y="95" width="85" height="105" fill="#0B1F1A" />
      <rect x="1075" y="125" width="75" height="75" fill="#051510" />
      <rect x="1160" y="100" width="90" height="100" fill="#0B1F1A" />
      <rect x="1260" y="120" width="70" height="80" fill="#051510" />
      <rect x="1340" y="105" width="90" height="95" fill="#0B1F1A" />
      {/* Windows */}
      {Array.from({ length: 60 }).map((_, i) => (
        <rect key={i} x={30 + (i * 24) % 1400} y={140 + (i % 3) * 12} width="3" height="3" fill="#D4A24C" opacity={0.7 + (i % 3) * 0.1} />
      ))}
    </g>
  </svg>
);

export default Hero;
