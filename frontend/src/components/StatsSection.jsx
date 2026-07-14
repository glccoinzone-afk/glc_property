import React from 'react';
import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import { STATS } from '../mock';

const StatsSection = () => {
  return (
    <section className="relative -mt-14 z-20">
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 rounded-2xl bg-white shadow-xl border border-emerald-100 p-6 md:p-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="text-center relative"
            >
              {i !== 0 && <div className="absolute left-0 top-1/4 bottom-1/4 w-px bg-emerald-100 hidden md:block" />}
              <div className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold mb-1" style={{ color: '#0F6B54' }}>
                <CountUp end={stat.divide ? stat.value / stat.divide : stat.value} duration={2.5} enableScrollSpy scrollSpyOnce />{stat.suffix}
              </div>
              <div className="text-sm md:text-base text-slate-600 font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
