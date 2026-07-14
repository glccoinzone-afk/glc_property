from fastapi import APIRouter, HTTPException, Depends, Query
from datetime import datetime, timezone
from typing import Optional, List
import uuid
from database import properties_col, users_col
from models import PropertyCreate, PropertyOut
from auth import get_current_user, get_optional_user, require_role

router = APIRouter(prefix='/properties', tags=['properties'])


def clean(doc):
    if doc:
        doc.pop('_id', None)
    return doc


@router.get('')
async def list_properties(
    city: Optional[str] = None,
    property_type: Optional[str] = None,
    bhk: Optional[int] = None,
    type: Optional[str] = None,  # Sale / Rent
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    furnishing: Optional[str] = None,
    possession: Optional[str] = None,
    verified_only: bool = False,
    owner_only: bool = False,
    premium: Optional[bool] = None,
    vip: Optional[bool] = None,
    featured: Optional[bool] = None,
    sort: str = 'relevance',
    limit: int = 50,
    skip: int = 0
):
    q = {'status': 'active'}
    if city:
        q['city'] = {'$regex': city, '$options': 'i'}
    if property_type:
        q['property_type'] = property_type
    if bhk is not None:
        q['bhk'] = bhk
    if type:
        q['type'] = type
    if furnishing:
        q['furnishing'] = furnishing
    if possession:
        q['possession'] = possession
    if verified_only:
        q['verified'] = True
    if owner_only:
        q['owner_direct'] = True
    if premium is not None:
        q['premium'] = premium
    if vip is not None:
        q['vip'] = vip
    if featured is not None:
        q['featured'] = featured
    if min_price is not None or max_price is not None:
        price_q = {}
        if min_price is not None:
            price_q['$gte'] = min_price
        if max_price is not None:
            price_q['$lte'] = max_price
        q['price'] = price_q

    sort_map = {
        'price-low': [('price', 1)],
        'price-high': [('price', -1)],
        'area-large': [('area', -1)],
        'newest': [('posted_at', -1)]
    }
    cursor = properties_col.find(q).sort(sort_map.get(sort, [('posted_at', -1)])).skip(skip).limit(limit)
    items = [clean(d) async for d in cursor]
    total = await properties_col.count_documents(q)
    return {'items': items, 'total': total}


@router.get('/{prop_id}')
async def get_property(prop_id: str):
    doc = await properties_col.find_one({'id': prop_id})
    if not doc:
        raise HTTPException(status_code=404, detail='Property not found')
    # increment views
    await properties_col.update_one({'id': prop_id}, {'$inc': {'views': 1}})
    return clean(doc)


@router.post('')
async def create_property(body: PropertyCreate, user: dict = Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    doc = body.dict()
    doc.update({
        'id': str(uuid.uuid4()),
        'verified': False,
        'featured': False,
        'premium': False,
        'vip': False,
        'views': 0,
        'status': 'pending',
        'posted_at': now,
        'user_id': user['id']
    })
    await properties_col.insert_one(doc)
    return clean(doc)


@router.put('/{prop_id}')
async def update_property(prop_id: str, body: PropertyCreate, user: dict = Depends(get_current_user)):
    existing = await properties_col.find_one({'id': prop_id})
    if not existing:
        raise HTTPException(status_code=404, detail='Not found')
    if user['role'] != 'super_admin' and existing.get('user_id') != user['id']:
        raise HTTPException(status_code=403, detail='Not allowed')
    updates = body.dict()
    await properties_col.update_one({'id': prop_id}, {'$set': updates})
    doc = await properties_col.find_one({'id': prop_id})
    return clean(doc)


@router.delete('/{prop_id}')
async def delete_property(prop_id: str, user: dict = Depends(get_current_user)):
    existing = await properties_col.find_one({'id': prop_id})
    if not existing:
        raise HTTPException(status_code=404, detail='Not found')
    if user['role'] != 'super_admin' and existing.get('user_id') != user['id']:
        raise HTTPException(status_code=403, detail='Not allowed')
    await properties_col.delete_one({'id': prop_id})
    return {'ok': True}


@router.get('/mine/list')
async def my_properties(user: dict = Depends(get_current_user)):
    cursor = properties_col.find({'user_id': user['id']}).sort([('posted_at', -1)])
    return [clean(d) async for d in cursor]
