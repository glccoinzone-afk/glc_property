import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Ruler, BadgeCheck, Home, Camera, Heart, Scale } from 'lucide-react';
import { formatINR } from '../mock';
import { useCompare } from '../context/CompareContext';
import { toast } from 'sonner';

const PropertyCard = ({ property, index = 0, size = 'default' }) => {
  const { add, items } = useCompare();
  const inCompare = items.find(i => i.id === property.id);

  const handleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) return toast.info('Already in compare');
    add(property);
    toast.success('Added to compare');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.08 }}
      className="card-lift bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm h-full flex flex-col"
    >
      <Link to={`/property/${property.id}`} className="block relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={property.image} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <span className="px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wider text-white uppercase" style={{ background: property.type === 'Sale' ? '#0F6B54' : '#D4A24C', color: property.type === 'Sale' ? 'white' : '#0E1B1F' }}>
            {property.type === 'Sale' ? 'For Sale' : 'For Rent'}
          </span>
          {property.vip && <span className="px-2.5 py-1 rounded-md text-[10px] font-bold text-slate-900" style={{ background: '#D4A24C' }}>👑 VIP</span>}
          {property.premium && !property.vip && <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-white/95 text-slate-900">Premium</span>}
        </div>

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {property.verified && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold text-white" style={{ background: '#0F6B54' }}>
              <BadgeCheck className="w-3 h-3" /> Verified
            </span>
          )}
          {property.ownerDirect && (
            <span className="flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold bg-red-500 text-white">
              No Broker
            </span>
          )}
        </div>

        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white text-xs">
          <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/50 backdrop-blur-sm">
            <Camera className="w-3 h-3" /> {property.gallery?.length || 3}
          </span>
        </div>

        <button onClick={handleCompare} className="absolute bottom-3 right-3 w-9 h-9 rounded-full bg-white/95 flex items-center justify-center hover:bg-white transition-colors">
          <Scale className="w-4 h-4" style={{ color: inCompare ? '#D4A24C' : '#0F6B54' }} />
        </button>
      </Link>

      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-start justify-between gap-2 mb-1.5">
          <h3 className="font-semibold text-slate-900 leading-tight line-clamp-1">
            <Link to={`/property/${property.id}`} className="hover:text-emerald-700">{property.title}</Link>
          </h3>
        </div>

        <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{property.locality}, {property.city}</span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-600 mb-3">
          {property.bhk > 0 && (
            <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" /> {property.bhk} BHK</span>
          )}
          <span className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> {property.area} {property.areaUnit}</span>
          <span className="flex items-center gap-1"><Home className="w-3.5 h-3.5" /> {property.propertyType}</span>
        </div>

        <div className="flex items-end justify-between mt-auto pt-3 border-t border-slate-100">
          <div>
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Price</div>
            <div className="font-bold text-lg" style={{ color: '#0F6B54' }}>{formatINR(property.price)}</div>
          </div>
          <Link to={`/property/${property.id}`} className="text-xs font-semibold px-3 py-2 rounded-lg transition-colors" style={{ background: '#0F6B54', color: 'white' }}>
            View Details
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default PropertyCard;
