// Static UI mock data for menus, service cards, categories, etc.
// Live property/builder data comes from backend.

export const CITIES = [
  'Kishanganj', 'Purnia', 'Katihar', 'Bhagalpur', 'Patna', 'Muzaffarpur', 'Darbhanga', 'Gaya',
  'Siliguri', 'Kolkata', 'Ranchi', 'Delhi', 'Mumbai', 'Bangalore'
];

export const MEGA_MENU = [
  { label: 'Residential', items: ['New Flats', 'Resale Flats', 'Paying Guests', 'Duplex House', 'Under Construction'] },
  { label: 'Independent', items: ['Bungalows', 'Luxury Bungalows', 'Row House', 'Farm House', 'Pent House', 'Villas'] },
  { label: 'Industrial', items: ['Industrial Land', 'Industrial Shed'] },
  { label: 'Commercial', items: ['Commercial Shop', 'Commercial Land', 'Commercial Office', 'Showrooms', 'Co-Working Space', 'GoDowns', 'Virtual Shops'] },
  { label: 'Agricultural', items: ['Agriculture Land', 'Plotting Land', 'NA Plotting'] },
  { label: 'Auction', items: ['Auction Property'] }
];

export const STATS = [
  { value: 50000, suffix: 'K+', label: 'Properties', divide: 1000 },
  { value: 200, suffix: '+', label: 'Cities' },
  { value: 10000, suffix: 'K+', label: 'Happy Clients', divide: 1000 },
  { value: 500, suffix: '+', label: 'Builders' }
];

export const SERVICE_CARDS = [
  { title: 'Owners Properties', desc: 'Showcase your properties to potential buyers', icon: 'Home' },
  { title: 'Broker / Dealers', desc: 'Access properties through trusted brokers', icon: 'Users' },
  { title: 'Channel Partners', desc: 'Expand your real estate network', icon: 'Network' },
  { title: 'Top Builders Bihar', desc: "Explore Bihar's leading builder projects", icon: 'Building2' },
  { title: 'Land Developers', desc: 'Discover top land development opportunities', icon: 'TreePine' }
];

export const PREMIUM_CATEGORIES = [
  { name: 'Hospitals', icon: 'Cross' },
  { name: 'Schools/Colleges', icon: 'GraduationCap' },
  { name: 'Resorts & Hotels', icon: 'Hotel' },
  { name: 'Palace', icon: 'Crown' },
  { name: 'Island', icon: 'Palmtree' },
  { name: 'Petrol Pump', icon: 'Fuel' },
  { name: 'NGOs', icon: 'Heart' },
  { name: 'Restaurant & Bar', icon: 'UtensilsCrossed' },
  { name: 'MSME Companies', icon: 'Factory' },
  { name: 'Gift Property', icon: 'Gift' },
  { name: 'NRI Investors', icon: 'Globe' },
  { name: 'Joint Ventures', icon: 'Handshake' },
  { name: 'Financial Funders', icon: 'Banknote' },
  { name: 'Litigation Properties', icon: 'Scale' },
  { name: 'Redevelopment', icon: 'Hammer' }
];

export const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1645207825163-4e231ee2d707?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwzfHxjaXR5JTIwc2t5bGluZSUyMGluZGlhfGVufDB8fHx8MTc4MjExOTU2NXww&ixlib=rb-4.1.0&q=85',
  'https://images.unsplash.com/photo-1704853241465-3c65c2c90533?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHw0fHxjaXR5JTIwc2t5bGluZSUyMGluZGlhfGVufDB8fHx8MTc4MjExOTU2NXww&ixlib=rb-4.1.0&q=85',
  'https://images.pexels.com/photos/36171603/pexels-photo-36171603.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.pexels.com/photos/11505497/pexels-photo-11505497.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
  'https://images.unsplash.com/photo-1648197685224-18c96a8d116d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzd8MHwxfHNlYXJjaHwyfHxjaXR5JTIwc2t5bGluZSUyMGluZGlhfGVufDB8fHx8MTc4MjExOTU2NXww&ixlib=rb-4.1.0&q=85'
];

export const CONNECTOR_SERVICES = [
  { name: 'Land Surveyors', icon: 'MapPin' },
  { name: 'Liasoning Works', icon: 'FileCheck' },
  { name: 'Architecture', icon: 'Compass' },
  { name: 'Civil Engineers', icon: 'HardHat' },
  { name: 'Building Materials', icon: 'Package' },
  { name: 'Automation & CCTV', icon: 'Camera' },
  { name: 'JCB/Crane Service', icon: 'Truck' },
  { name: 'Solar Panels', icon: 'Sun' },
  { name: 'Granite/Tiles', icon: 'Grid3x3' },
  { name: 'Electrician Works', icon: 'Zap' },
  { name: 'Plumbing Works', icon: 'Wrench' },
  { name: 'Painting Works', icon: 'Paintbrush' },
  { name: 'Interior Designer', icon: 'Sofa' },
  { name: 'Advocate', icon: 'Gavel' },
  { name: 'Rent Agreement', icon: 'FileText' },
  { name: 'Elevators', icon: 'ArrowUpDown' },
  { name: 'Packers & Movers', icon: 'Boxes' },
  { name: 'Loan World', icon: 'Landmark' },
  { name: 'Fire Security', icon: 'Flame' },
  { name: 'Chartered Accountant', icon: 'Calculator' },
  { name: 'Gardening', icon: 'Leaf' },
  { name: 'VASTU Consultant', icon: 'Star' },
  { name: 'Real Estate Broker', icon: 'Briefcase' },
  { name: 'Society Redevelopment', icon: 'RefreshCw' }
];

export const POPULAR_SEARCHES = {
  sale: ['Kishanganj', 'Purnia', 'Katihar', 'Bhagalpur', 'Patna', 'Muzaffarpur', 'Darbhanga', 'Gaya', 'Siliguri', 'Kolkata', 'Ranchi', 'Delhi'],
  rent: ['Kishanganj', 'Purnia', 'Katihar', 'Bhagalpur', 'Patna', 'Muzaffarpur', 'Darbhanga', 'Gaya', 'Siliguri', 'Kolkata', 'Ranchi', 'Delhi'],
  projects: ['Kishanganj', 'Purnia', 'Katihar', 'Bhagalpur', 'Patna', 'Muzaffarpur', 'Darbhanga', 'Gaya', 'Siliguri', 'Kolkata', 'Ranchi', 'Delhi'],
  agents: ['Kishanganj', 'Purnia', 'Katihar', 'Bhagalpur', 'Patna', 'Muzaffarpur', 'Darbhanga', 'Gaya', 'Siliguri', 'Kolkata', 'Ranchi', 'Delhi']
};

export const BUDGET_OPTIONS = [
  { label: '5 Lacs', value: 500000 },
  { label: '10 Lacs', value: 1000000 },
  { label: '25 Lacs', value: 2500000 },
  { label: '50 Lacs', value: 5000000 },
  { label: '1 Crore', value: 10000000 },
  { label: '2 Crore', value: 20000000 },
  { label: '5 Crore', value: 50000000 },
  { label: '10 Crore', value: 100000000 },
  { label: '100 Crore', value: 1000000000 }
];

export const formatINR = (amount) => {
  if (!amount && amount !== 0) return 'N/A';
  if (amount >= 10000000) return `₹ ${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹ ${(amount / 100000).toFixed(2)} L`;
  if (amount >= 1000) return `₹ ${(amount / 1000).toFixed(1)}K`;
  return `₹ ${amount}`;
};

export const COMPANY = {
  name: 'GLC Property',
  parent: 'GLCZONE Private Limited',
  cin: 'U68100BR2025PTC077112',
  address: 'Bangali Lane, Ward 28, Dharamganj, Kishanganj Bazar, Kishanganj, Bihar 855108',
  city: 'Kishanganj',
  state: 'Bihar',
  pincode: '855108',
  phone: '+91 9011037538',
  email: 'info@glcproperty.com'
};
