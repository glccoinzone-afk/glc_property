"""Seed initial dummy data - runs once on startup if collections are empty."""
from database import users_col, properties_col, builders_col, land_projects_col
from auth import hash_password
from datetime import datetime, timezone, timedelta
import uuid
import random


PROP_IMGS = [
    'https://images.unsplash.com/photo-1655322126436-9dd898d4a636',
    'https://images.unsplash.com/photo-1686164748261-33e13eef70b6',
    'https://images.unsplash.com/photo-1721815693498-cc28507c0ba2',
    'https://images.pexels.com/photos/17499591/pexels-photo-17499591.jpeg',
    'https://images.pexels.com/photos/32031452/pexels-photo-32031452.jpeg',
    'https://images.pexels.com/photos/14998334/pexels-photo-14998334.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.pexels.com/photos/16110999/pexels-photo-16110999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940',
    'https://images.pexels.com/photos/1488267/pexels-photo-1488267.png',
    'https://images.pexels.com/photos/2476632/pexels-photo-2476632.jpeg',
    'https://images.pexels.com/photos/16573669/pexels-photo-16573669.jpeg'
]

TITLES = ['Ganga View Residency', 'Emerald Heights', 'Royal Palm Villa', 'Sunset Boulevard', 'Green Valley Estate',
          'Kosi Riverfront Tower', 'Golden Sunrise', 'Crystal Palace', 'Silver Oak Enclave', 'Palm Grove Residences',
          'The Aristocrat', 'Regal Meadows', 'Mahananda Vista', 'Bihari Paradise']
CITIES = [
    ('Kishanganj', 'Bihar', 26.10, 87.94),
    ('Purnia', 'Bihar', 25.78, 87.47),
    ('Katihar', 'Bihar', 25.53, 87.58),
    ('Bhagalpur', 'Bihar', 25.24, 86.98),
    ('Patna', 'Bihar', 25.59, 85.13),
    ('Muzaffarpur', 'Bihar', 26.12, 85.39),
    ('Darbhanga', 'Bihar', 26.15, 85.90),
    ('Gaya', 'Bihar', 24.80, 85.00),
    ('Siliguri', 'West Bengal', 26.72, 88.42),
    ('Kolkata', 'West Bengal', 22.57, 88.36),
    ('Ranchi', 'Jharkhand', 23.34, 85.31),
    ('Delhi', 'Delhi', 28.61, 77.20),
    ('Mumbai', 'Maharashtra', 19.07, 72.87),
    ('Bangalore', 'Karnataka', 12.97, 77.59)
]
LOCALITIES = ['Dharamganj', 'Bangali Lane', 'Line Bazar', 'Ward 28', 'Chakla Road', 'Ruidhasa', 'Halmara', 'Bahadurganj',
              'Kishanganj Bazar', 'Thakurbari', 'Ramzanpur', 'Belwa']


async def seed_users():
    if await users_col.count_documents({}) > 0:
        return
    now = datetime.now(timezone.utc)
    users = [
        {'id': str(uuid.uuid4()), 'name': 'Super Admin', 'email': 'admin@glcproperty.com', 'phone': '+919011037538',
         'role': 'super_admin', 'status': 'active', 'password': hash_password('admin123'), 'created_at': now},
        {'id': str(uuid.uuid4()), 'name': 'Rahul Sharma', 'email': 'agent@glcproperty.com', 'phone': '+919876543210',
         'role': 'agent', 'status': 'active', 'password': hash_password('agent123'), 'created_at': now},
        {'id': str(uuid.uuid4()), 'name': 'Priya Patel', 'email': 'user@glcproperty.com', 'phone': '+919876504321',
         'role': 'user', 'status': 'active', 'password': hash_password('user123'), 'created_at': now},
        {'id': str(uuid.uuid4()), 'name': 'Vikram Kumar', 'email': 'vikram@glcproperty.com', 'phone': '+919812345678',
         'role': 'agent', 'status': 'active', 'password': hash_password('agent123'), 'created_at': now},
        {'id': str(uuid.uuid4()), 'name': 'Neha Singh', 'email': 'neha@glcproperty.com', 'phone': '+919887766554',
         'role': 'user', 'status': 'suspended', 'password': hash_password('user123'), 'created_at': now},
        {'id': str(uuid.uuid4()), 'name': 'Arjun Rao', 'email': 'arjun@glcproperty.com', 'phone': '+918899776655',
         'role': 'agent', 'status': 'pending', 'password': hash_password('agent123'), 'created_at': now}
    ]
    await users_col.insert_many(users)
    print(f"[seed] Inserted {len(users)} users")


async def seed_properties():
    if await properties_col.count_documents({}) > 0:
        return
    now = datetime.now(timezone.utc)
    amenities_pool = ['Swimming Pool', 'Gym', 'Garden', 'Security', 'Lift', 'Club House', 'Play Area', 'Power Backup', 'Parking', 'CCTV']
    props = []
    for i in range(24):
        c = CITIES[i % len(CITIES)]
        img = PROP_IMGS[i % len(PROP_IMGS)]
        props.append({
            'id': str(uuid.uuid4()),
            'title': f"{TITLES[i % len(TITLES)]} {i + 1}",
            'description': 'A premium property offering a blend of luxury, comfort, and modern conveniences. Located in a prime area with excellent connectivity to major landmarks including markets, schools, hospitals, and transport hubs. Perfect for families seeking an elevated lifestyle in Bihar.',
            'type': ['Sale', 'Rent'][i % 2],
            'property_type': ['Apartment', 'Villa', 'Plot', 'Office', 'Bungalow'][i % 5],
            'city': c[0], 'state': c[1], 'locality': LOCALITIES[i % len(LOCALITIES)],
            'bhk': (i % 4) + 1,
            'area': 800 + i * 120,
            'area_unit': 'sq.ft',
            'price': (i % 2 == 0 and (2500000 + i * 300000)) or (18000 + i * 2500),
            'bathrooms': (i % 3) + 1,
            'parking': (i % 2) + 1,
            'furnishing': ['Fully Furnished', 'Semi Furnished', 'Unfurnished'][i % 3],
            'possession': ['Ready to Move', 'Under Construction'][i % 2],
            'amenities': random.sample(amenities_pool, 4 + (i % 4)),
            'image': img,
            'gallery': [PROP_IMGS[i % 10], PROP_IMGS[(i + 1) % 10], PROP_IMGS[(i + 2) % 10], PROP_IMGS[(i + 3) % 10]],
            'lat': c[2] + random.uniform(-0.3, 0.3),
            'lng': c[3] + random.uniform(-0.3, 0.3),
            'builder': ['GLC Developers', 'Kishanganj Homes', 'Bihar Estates', 'Kosi Realty', 'Ganga Constructions'][i % 5],
            'posted_by': ['Owner', 'Agent', 'Builder'][i % 3],
            'owner_direct': i % 4 == 0,
            'verified': i % 3 == 0,
            'featured': i % 5 == 0,
            'premium': i < 8,
            'vip': i < 4,
            'views': random.randint(50, 3000),
            'status': 'active' if i % 3 != 2 else 'pending',
            'posted_at': now - timedelta(days=(i % 28)),
            'user_id': None
        })
    await properties_col.insert_many(props)
    print(f"[seed] Inserted {len(props)} properties")


async def seed_builders():
    if await builders_col.count_documents({}) > 0:
        return
    builders = [
        {'id': str(uuid.uuid4()), 'name': 'GLC Developers', 'location': 'Dharamganj, Kishanganj', 'area': '4 Acre', 'price_per_sqft': 4500, 'image': PROP_IMGS[0], 'projects': 12, 'established': 2020, 'description': 'Premium developer in Kishanganj', 'is_vip': True, 'is_featured': True},
        {'id': str(uuid.uuid4()), 'name': 'Kosi Realty', 'location': 'Purnia, Bihar', 'area': '2 Acre', 'price_per_sqft': 3800, 'image': PROP_IMGS[1], 'projects': 8, 'established': 2015, 'description': 'Trusted realty in North Bihar', 'is_vip': False, 'is_featured': True},
        {'id': str(uuid.uuid4()), 'name': 'Kishanganj Homes', 'location': 'Kishanganj Bazar', 'area': '1 Acre', 'price_per_sqft': 4200, 'image': PROP_IMGS[2], 'projects': 15, 'established': 2012, 'description': 'Affordable homes for all', 'is_vip': False, 'is_featured': False},
        {'id': str(uuid.uuid4()), 'name': 'Bihar Estates', 'location': 'Patna, Bihar', 'area': '22 Acre', 'price_per_sqft': 5100, 'image': PROP_IMGS[3], 'projects': 20, 'established': 2005, 'description': "Bihar's leading builder", 'is_vip': True, 'is_featured': False},
        {'id': str(uuid.uuid4()), 'name': 'Ganga Constructions', 'location': 'Bhagalpur, Bihar', 'area': '4 Acre', 'price_per_sqft': 3500, 'image': PROP_IMGS[4], 'projects': 6, 'established': 2018, 'description': 'Riverside construction experts', 'is_vip': False, 'is_featured': True},
        {'id': str(uuid.uuid4()), 'name': 'Mahananda Group', 'location': 'Katihar, Bihar', 'area': '14 Acre', 'price_per_sqft': 4200, 'image': PROP_IMGS[5], 'projects': 10, 'established': 2010, 'description': 'Green township developer', 'is_vip': False, 'is_featured': False},
        {'id': str(uuid.uuid4()), 'name': 'Muzaffarpur Skyhomes', 'location': 'Muzaffarpur, Bihar', 'area': '6 Acre', 'price_per_sqft': 3900, 'image': PROP_IMGS[6], 'projects': 9, 'established': 2013, 'description': 'Modern living for Bihar', 'is_vip': False, 'is_featured': False},
        {'id': str(uuid.uuid4()), 'name': 'Ranchi Urban Creators', 'location': 'Ranchi, Jharkhand', 'area': '5 Acre', 'price_per_sqft': 4800, 'image': PROP_IMGS[7], 'projects': 14, 'established': 2008, 'description': 'Urban lifestyle projects', 'is_vip': False, 'is_featured': False}
    ]
    await builders_col.insert_many(builders)
    print(f"[seed] Inserted {len(builders)} builders")


async def seed_land():
    if await land_projects_col.count_documents({}) > 0:
        return
    lands = [
        {'id': str(uuid.uuid4()), 'name': 'Kosi Riverfront Plots', 'location': 'Kishanganj, Bihar', 'area': '3 Acre', 'price': 200000, 'image': PROP_IMGS[8], 'developer': 'GLC Developers', 'is_vip': False, 'is_featured': True},
        {'id': str(uuid.uuid4()), 'name': 'Ganga Valley Land', 'location': 'Bhagalpur, Bihar', 'area': '5 Acre', 'price': 500000, 'image': PROP_IMGS[9], 'developer': 'Ganga Constructions', 'is_vip': False, 'is_featured': True},
        {'id': str(uuid.uuid4()), 'name': 'Seven City NA Plots', 'location': 'Purnia, Bihar', 'area': '5.2 Acre', 'price': 1999999, 'image': PROP_IMGS[0], 'developer': 'Kosi Realty', 'is_vip': True, 'is_featured': False},
        {'id': str(uuid.uuid4()), 'name': 'Dharamganj Township', 'location': 'Dharamganj, Kishanganj', 'area': '8 Acre', 'price': 1625000, 'image': PROP_IMGS[1], 'developer': 'GLC Developers', 'is_vip': True, 'is_featured': True},
        {'id': str(uuid.uuid4()), 'name': 'Mahananda Farmland', 'location': 'Katihar, Bihar', 'area': '10 Acre', 'price': 399999, 'image': PROP_IMGS[2], 'developer': 'Mahananda Group', 'is_vip': False, 'is_featured': False},
        {'id': str(uuid.uuid4()), 'name': 'Kishanganj Green Estate', 'location': 'Kishanganj Bazar', 'area': '6 Acre', 'price': 2100000, 'image': PROP_IMGS[3], 'developer': 'Kishanganj Homes', 'is_vip': False, 'is_featured': False}
    ]
    await land_projects_col.insert_many(lands)
    print(f"[seed] Inserted {len(lands)} land projects")


async def seed_all():
    await seed_users()
    await seed_properties()
    await seed_builders()
    await seed_land()
