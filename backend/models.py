from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional
from datetime import datetime
import uuid


def _uid():
    return str(uuid.uuid4())


# ---------------- USERS ----------------
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: Optional[str] = None
    role: str = 'user'  # user | agent | super_admin


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    role: str
    status: str = 'active'
    created_at: datetime


class AuthResponse(BaseModel):
    token: str
    user: UserOut


# ---------------- PROPERTY ----------------
class PropertyCreate(BaseModel):
    title: str
    description: Optional[str] = ''
    type: str = 'Sale'  # Sale | Rent
    property_type: str = 'Apartment'
    city: str
    locality: str
    state: str = 'Bihar'
    bhk: int = 0
    area: float = 0
    area_unit: str = 'sq.ft'
    price: float = 0
    bathrooms: int = 0
    parking: int = 0
    furnishing: str = 'Unfurnished'
    possession: str = 'Ready to Move'
    amenities: List[str] = []
    image: Optional[str] = ''
    gallery: List[str] = []
    lat: float = 26.10
    lng: float = 87.94
    builder: Optional[str] = ''
    posted_by: str = 'Owner'
    owner_direct: bool = False


class PropertyOut(PropertyCreate):
    id: str
    verified: bool = False
    featured: bool = False
    premium: bool = False
    vip: bool = False
    views: int = 0
    status: str = 'active'  # active | pending | rejected | sold
    posted_at: datetime
    user_id: Optional[str] = None


# ---------------- BUILDER ----------------
class BuilderCreate(BaseModel):
    name: str
    location: str
    area: str
    price_per_sqft: float
    image: Optional[str] = ''
    projects: int = 0
    established: int = 2010
    description: Optional[str] = ''
    is_vip: bool = False
    is_featured: bool = False


class BuilderOut(BuilderCreate):
    id: str


# ---------------- LAND ----------------
class LandProjectOut(BaseModel):
    id: str
    name: str
    location: str
    area: str
    price: float
    image: Optional[str] = ''
    developer: str
    is_vip: bool = False
    is_featured: bool = False


# ---------------- ENQUIRY ----------------
class EnquiryCreate(BaseModel):
    property_id: str
    name: str
    email: str
    phone: str
    message: Optional[str] = ''


class EnquiryOut(EnquiryCreate):
    id: str
    user_id: Optional[str] = None
    status: str = 'new'  # new | responded | scheduled
    created_at: datetime


# ---------------- SHORTLIST ----------------
class ShortlistCreate(BaseModel):
    property_id: str


# ---------------- SAVED SEARCH ----------------
class SavedSearchCreate(BaseModel):
    name: str
    filters: dict
