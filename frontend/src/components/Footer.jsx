import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="text-white mt-24" style={{ background: '#0B1F1A' }}>
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-16 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-serif text-xl" style={{ background: '#0F6B54' }}>B</div>
            <div>
              <div className="font-serif text-xl font-bold text-white">Bahubali</div>
              <div className="text-[10px] tracking-[0.2em] text-emerald-300/70 uppercase">Property</div>
            </div>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed mb-5 max-w-md">
            India's trusted real estate platform. Find your dream property across residential, commercial, and agricultural categories with verified listings.
          </p>
          <div className="flex gap-3">
            {[Facebook, Twitter, Instagram, Linkedin, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h4>
          <ul className="space-y-2.5 text-sm text-slate-300">
            <li><Link to="/" className="hover:text-brand-gold" style={{ transition: 'color .2s' }}>About Us</Link></li>
            <li><a href="#" className="hover:text-brand-gold">Careers</a></li>
            <li><a href="#" className="hover:text-brand-gold">Blog</a></li>
            <li><a href="#" className="hover:text-brand-gold">Contact</a></li>
            <li><a href="#" className="hover:text-brand-gold">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Discover</h4>
          <ul className="space-y-2.5 text-sm text-slate-300">
            <li><Link to="/properties" className="hover:text-brand-gold">Buy Property</Link></li>
            <li><Link to="/properties?type=Rent" className="hover:text-brand-gold">Rent Property</Link></li>
            <li><Link to="/builders" className="hover:text-brand-gold">Top Builders</Link></li>
            <li><Link to="/emi-calculator" className="hover:text-brand-gold">EMI Calculator</Link></li>
            <li><Link to="/map-search" className="hover:text-brand-gold">Map Search</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
          <ul className="space-y-3 text-sm text-slate-300">
            <li className="flex items-start gap-2"><Phone className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#D4A24C' }} /><span>+91 9011037538</span></li>
            <li className="flex items-start gap-2"><Mail className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#D4A24C' }} /><span>info@bahubaliproperty.com</span></li>
            <li className="flex items-start gap-2"><MapPin className="w-4 h-4 mt-0.5 shrink-0" style={{ color: '#D4A24C' }} /><span>Pune, Maharashtra, India</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-5 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
          <div>© {new Date().getFullYear()} Bahubali Property. All rights reserved.</div>
          <div className="flex gap-6 mt-3 md:mt-0">
            <a href="#" className="hover:text-white">Terms of Service</a>
            <a href="#" className="hover:text-white">Sitemap</a>
            <a href="#" className="hover:text-white">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
