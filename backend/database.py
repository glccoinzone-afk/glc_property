import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(Path(__file__).parent / '.env')

MONGO_URL = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
DB_NAME = os.environ.get('DB_NAME', 'glc_property')

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Collections
users_col = db.users
properties_col = db.properties
builders_col = db.builders
land_projects_col = db.land_projects
enquiries_col = db.enquiries
shortlists_col = db.shortlists
saved_searches_col = db.saved_searches
