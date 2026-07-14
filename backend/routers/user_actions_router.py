from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import uuid
from database import enquiries_col, shortlists_col, saved_searches_col, properties_col
from models import EnquiryCreate, ShortlistCreate, SavedSearchCreate
from auth import get_current_user, get_optional_user

router = APIRouter(tags=['user-actions'])


def clean(d):
    if d: d.pop('_id', None)
    return d


# -------- ENQUIRIES --------
@router.post('/enquiries')
async def create_enquiry(body: EnquiryCreate, user=Depends(get_optional_user)):
    prop = await properties_col.find_one({'id': body.property_id})
    if not prop:
        raise HTTPException(status_code=404, detail='Property not found')
    doc = body.dict()
    doc.update({
        'id': str(uuid.uuid4()),
        'property_id': body.property_id,
        'property_title': prop.get('title'),
        'user_id': user['id'] if user else None,
        'status': 'new',
        'created_at': datetime.now(timezone.utc)
    })
    await enquiries_col.insert_one(doc)
    return clean(doc)


@router.get('/enquiries/mine')
async def my_enquiries(user=Depends(get_current_user)):
    cursor = enquiries_col.find({'user_id': user['id']}).sort([('created_at', -1)])
    return [clean(d) async for d in cursor]


@router.get('/enquiries/for-agent')
async def enquiries_for_agent(user=Depends(get_current_user)):
    # Get all property IDs posted by this agent
    my_props = properties_col.find({'user_id': user['id']}, {'id': 1})
    prop_ids = [p['id'] async for p in my_props]
    cursor = enquiries_col.find({'property_id': {'$in': prop_ids}}).sort([('created_at', -1)])
    return [clean(d) async for d in cursor]


# -------- SHORTLIST --------
@router.post('/shortlist')
async def add_shortlist(body: ShortlistCreate, user=Depends(get_current_user)):
    existing = await shortlists_col.find_one({'user_id': user['id'], 'property_id': body.property_id})
    if existing:
        return {'ok': True, 'message': 'Already shortlisted'}
    doc = {'id': str(uuid.uuid4()), 'user_id': user['id'], 'property_id': body.property_id, 'created_at': datetime.now(timezone.utc)}
    await shortlists_col.insert_one(doc)
    return clean(doc)


@router.delete('/shortlist/{prop_id}')
async def remove_shortlist(prop_id: str, user=Depends(get_current_user)):
    await shortlists_col.delete_one({'user_id': user['id'], 'property_id': prop_id})
    return {'ok': True}


@router.get('/shortlist/mine')
async def my_shortlist(user=Depends(get_current_user)):
    cursor = shortlists_col.find({'user_id': user['id']})
    shortlisted = [clean(d) async for d in cursor]
    # Fetch full properties
    prop_ids = [s['property_id'] for s in shortlisted]
    props = properties_col.find({'id': {'$in': prop_ids}})
    result = [clean(p) async for p in props]
    return result


# -------- SAVED SEARCH --------
@router.post('/saved-searches')
async def save_search(body: SavedSearchCreate, user=Depends(get_current_user)):
    doc = body.dict()
    doc.update({'id': str(uuid.uuid4()), 'user_id': user['id'], 'created_at': datetime.now(timezone.utc)})
    await saved_searches_col.insert_one(doc)
    return clean(doc)


@router.get('/saved-searches/mine')
async def my_saved_searches(user=Depends(get_current_user)):
    cursor = saved_searches_col.find({'user_id': user['id']}).sort([('created_at', -1)])
    return [clean(d) async for d in cursor]


@router.delete('/saved-searches/{search_id}')
async def delete_saved_search(search_id: str, user=Depends(get_current_user)):
    await saved_searches_col.delete_one({'id': search_id, 'user_id': user['id']})
    return {'ok': True}
