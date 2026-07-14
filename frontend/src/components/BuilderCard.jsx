import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Building2, ChevronRight } from 'lucide-react';
import { formatINR } from '../mock';

const BuilderCard = ({ builder, index = 0, tag = null }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-50px' }}
    transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
    className="card-lift group bg-white rounded-2xl overflow-hidden border border-emerald-100 shadow-sm"
  >
    <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
      <img src={builder.image} alt={builder.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {tag && (
        <span className="absolute top-3 left-3 px-3 py-1 rounded-md text-[10px] font-bold text-slate-900" style={{ background: '#D4A24C' }}>{tag}</span>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        <h3 className="font-serif text-xl font-bold mb-1">{builder.name}</h3>
        <div className="flex items-center gap-1 text-xs text-white/85">
          <MapPin className="w-3.5 h-3.5" /> {builder.location}
        </div>
      </div>
    </div>

    <div className="p-4 grid grid-cols-3 gap-2 text-center border-t border-emerald-50">
      <div>
        <div className="text-[10px] text-slate-500 uppercase">Area</div>
        <div className="font-bold text-sm text-slate-900">{builder.area}</div>
      </div>
      <div className="border-x border-emerald-50">
        <div className="text-[10px] text-slate-500 uppercase">Rate/sqft</div>
        <div className="font-bold text-sm" style={{ color: '#0F6B54' }}>{formatINR(builder.pricePerSqft)}</div>
      </div>
      <div>
        <div className="text-[10px] text-slate-500 uppercase">Projects</div>
        <div className="font-bold text-sm text-slate-900">{builder.projects}</div>
      </div>
    </div>

    <Link to="/builders" className="flex items-center justify-center gap-1 py-3 text-sm font-semibold border-t border-emerald-50 hover:bg-emerald-50 transition-colors" style={{ color: '#0F6B54' }}>
      View Details <ChevronRight className="w-4 h-4" />
    </Link>
  </motion.div>
);

export default BuilderCard;
