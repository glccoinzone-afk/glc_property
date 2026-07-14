import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const Hero = () => {
  const [city, setCity] = useState('');
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const submit = (e) => {
    e.preventDefault();
    const q = new URLSearchParams();
    if (city) q.set('city', city);
    navigate(`/properties?${q.toString()}`);
  };

  return (
    <section className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 40px)', minHeight: 620 }}>
      {/* Video background */}
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        poster="https://images.unsplash.com/photo-1645207825163-4e231ee2d707?w=1920"
      >
        <source src="/assets/heroVideo.mp4" type="video/mp4" />
      </video>

      {/* Light adjust overlay: subtle emerald tint + darker gradient at bottom for text readability */}
      <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(9,72,54,0.35) 0%, rgba(9,72,54,0.15) 40%, rgba(11,31,26,0.55) 100%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.35) 100%)' }} />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-white text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-4 drop-shadow-2xl"
        >
          Find Your <span style={{ color: '#E8C168' }}>Dream</span> Home
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.15 }}
          className="text-white/95 text-lg md:text-xl mb-10 max-w-2xl drop-shadow-lg"
        >
          GLC Property is the perfect place for your next dream house in Kishanganj, Bihar & beyond.
        </motion.p>

        {/* Pill search bar */}
        <motion.form
          onSubmit={submit}
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-2xl"
        >
          <div className="relative flex items-center bg-white rounded-full shadow-2xl overflow-hidden pl-6 pr-1.5 py-1.5">
            <input
              type="text"
              value={city}
              onChange={e => setCity(e.target.value)}
              placeholder="Enter city, locality or project…"
              className="flex-1 bg-transparent border-0 outline-none py-3 text-slate-800 placeholder:text-slate-400 text-base"
              list="hero-cities"
            />
            <datalist id="hero-cities">
              {['Kishanganj', 'Purnia', 'Katihar', 'Bhagalpur', 'Patna', 'Muzaffarpur', 'Darbhanga', 'Gaya', 'Delhi', 'Mumbai', 'Bangalore'].map(c => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <button
              type="submit"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center shrink-0 shadow-lg hover:scale-105 active:scale-95 transition-transform"
              style={{ background: '#0F6B54' }}
              aria-label="Search"
            >
              <Search className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Quick chips */}
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {['Kishanganj', 'Patna', 'Purnia', 'Bhagalpur', 'Katihar'].map(c => (
              <button
                key={c}
                type="button"
                onClick={() => { setCity(c); navigate(`/properties?city=${encodeURIComponent(c)}`); }}
                className="px-4 py-1.5 rounded-full text-xs font-medium text-white bg-white/15 backdrop-blur-md border border-white/25 hover:bg-white/25 transition-colors"
              >
                {c}
              </button>
            ))}
          </div>
        </motion.form>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/70 text-xs tracking-widest uppercase flex flex-col items-center gap-2"
      >
        <span>Scroll</span>
        <div className="w-px h-8 bg-white/40 animate-pulse" />
      </motion.div>
    </section>
  );
};

export default Hero;
