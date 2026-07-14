import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Bed, Bath, Car, Ruler, BadgeCheck, Phone, Heart, Share2, Calculator, MessageSquare, Home, CheckCircle2, ArrowLeft } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { PROPERTIES, formatINR } from '../mock';
import { Button } from '../components/ui/button';
import { toast } from 'sonner';
import { useCompare } from '../context/CompareContext';

const PropertyDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = PROPERTIES.find(p => p.id === id) || PROPERTIES[0];
  const [activeImg, setActiveImg] = useState(0);
  const { add } = useCompare();

  return (
    <div>
      <Header />
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-slate-600 hover:text-emerald-700 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </button>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Gallery */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl overflow-hidden aspect-video bg-slate-100 mb-3 relative">
              <img src={property.gallery[activeImg]} alt={property.title} className="w-full h-full object-cover" />
              {property.verified && <span className="absolute top-4 left-4 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white" style={{ background: '#0F6B54' }}><BadgeCheck className="w-4 h-4" /> Verified Listing</span>}
            </motion.div>
            <div className="grid grid-cols-4 gap-3 mb-8">
              {property.gallery.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${activeImg === i ? 'border-emerald-600 scale-95' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </button>
              ))}
            </div>

            {/* Title */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-2">{property.title}</h1>
                <div className="flex items-center gap-1 text-slate-600"><MapPin className="w-4 h-4" /> {property.locality}, {property.city}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => toast.success('Added to shortlist')} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-red-50 flex items-center justify-center"><Heart className="w-5 h-5 text-red-500" /></button>
                <button onClick={() => toast.success('Link copied')} className="w-10 h-10 rounded-full bg-slate-100 hover:bg-emerald-50 flex items-center justify-center"><Share2 className="w-5 h-5" style={{ color: '#0F6B54' }} /></button>
              </div>
            </div>

            {/* Key info grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-slate-200 mb-8">
              <Info icon={Bed} label={`${property.bhk} BHK`} value="Bedrooms" />
              <Info icon={Bath} label={`${property.bathrooms}`} value="Bathrooms" />
              <Info icon={Ruler} label={`${property.area} ${property.areaUnit}`} value="Area" />
              <Info icon={Car} label={`${property.parking}`} value="Parking" />
            </div>

            {/* Description */}
            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-3">About this property</h2>
              <p className="text-slate-700 leading-relaxed">{property.description}</p>
            </section>

            {/* Amenities */}
            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {property.amenities.map(a => (
                  <div key={a} className="flex items-center gap-2 text-sm text-slate-700 bg-emerald-50 rounded-lg px-3 py-2.5">
                    <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: '#0F6B54' }} /> {a}
                  </div>
                ))}
              </div>
            </section>

            {/* Details table */}
            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">Property Details</h2>
              <dl className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 bg-white p-6 rounded-2xl border border-slate-200">
                {[
                  ['Type', property.propertyType],
                  ['Furnishing', property.furnishing],
                  ['Possession', property.possession],
                  ['Posted By', property.postedBy],
                  ['Builder', property.builder],
                  ['Listed', property.postedAt]
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-slate-500 uppercase tracking-wider mb-1">{k}</dt>
                    <dd className="font-semibold text-slate-800">{v}</dd>
                  </div>
                ))}
              </dl>
            </section>

            {/* Location placeholder */}
            <section className="mb-8">
              <h2 className="font-serif text-2xl font-bold text-slate-900 mb-4">Location</h2>
              <div className="aspect-video rounded-2xl overflow-hidden bg-emerald-50 border border-emerald-100 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #0F6B54 0 2px, transparent 2px 20px), repeating-linear-gradient(-45deg, #0F6B54 0 2px, transparent 2px 20px)' }} />
                <div className="relative text-center">
                  <MapPin className="w-12 h-12 mx-auto mb-2" style={{ color: '#0F6B54' }} />
                  <div className="font-semibold">{property.locality}, {property.city}</div>
                  <div className="text-xs text-slate-500">Lat {property.lat.toFixed(3)}, Lng {property.lng.toFixed(3)}</div>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sticky top-24">
              <div className="mb-4">
                <div className="text-xs uppercase text-slate-500 tracking-wider mb-1">Price</div>
                <div className="font-serif text-4xl font-bold" style={{ color: '#0F6B54' }}>{formatINR(property.price)}</div>
                <div className="text-xs text-slate-500 mt-1">₹ {(property.price / property.area).toFixed(0)} / {property.areaUnit}</div>
              </div>

              <div className="flex flex-col gap-2 mb-4">
                <Button className="w-full text-white font-semibold gap-2" style={{ background: '#0F6B54' }} onClick={() => toast.success('Contacting owner...')}>
                  <Phone className="w-4 h-4" /> Contact Owner
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={() => toast.success('Interest sent')}>
                  <MessageSquare className="w-4 h-4" /> Send Enquiry
                </Button>
                <Button variant="ghost" className="w-full gap-2" onClick={() => { add(property); toast.success('Added to compare'); }}>
                  <Home className="w-4 h-4" /> Add to Compare
                </Button>
                <Link to="/emi-calculator" state={{ price: property.price }}>
                  <Button variant="ghost" className="w-full gap-2"><Calculator className="w-4 h-4" /> Calculate EMI</Button>
                </Link>
              </div>

              <div className="pt-4 border-t border-slate-200">
                <div className="text-xs uppercase text-slate-500 mb-2">Listed by</div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold" style={{ background: '#0F6B54' }}>{property.postedBy[0]}</div>
                  <div>
                    <div className="font-semibold text-slate-800">{property.builder}</div>
                    <div className="text-xs text-slate-500">{property.postedBy} · {property.postedAt}</div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
};

const Info = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-3">
    <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center">
      <Icon className="w-5 h-5" style={{ color: '#0F6B54' }} />
    </div>
    <div>
      <div className="font-bold text-slate-900">{label}</div>
      <div className="text-xs text-slate-500 uppercase tracking-wider">{value}</div>
    </div>
  </div>
);

export default PropertyDetail;
