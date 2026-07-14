from fastapi import APIRouter, Depends, HTTPException, Query
from typing import Optional
from database import users_col, properties_col, enquiries_col, builders_col
from auth import require_role

router = APIRouter(prefix='/admin', tags=['admin'])

admin_only = require_role('super_admin')


def clean(d):
    if d: d.pop('_id', None); d.pop('password', None)
    return d


@router.get('/stats')
async def stats(user=Depends(admin_only)):
    total_users = await users_col.count_documents({})
    active_users = await users_col.count_documents({'status': 'active'})
    total_properties = await properties_col.count_documents({})
    active_properties = await properties_col.count_documents({'status': 'active'})
    pending_properties = await properties_col.count_documents({'status': 'pending'})
    verified_properties = await properties_col.count_documents({'verified': True})
    total_enquiries = await enquiries_col.count_documents({})
    total_builders = await builders_col.count_documents({})

    # Property type distribution
    pipeline = [{'$group': {'_id': '$property_type', 'count': {'$sum': 1}}}]
    dist = {d['_id']: d['count'] async for d in properties_col.aggregate(pipeline)}

    # Total GMV (sum of prices for Sale properties)
    pipeline_gmv = [{'$match': {'type': 'Sale'}}, {'$group': {'_id': None, 'sum': {'$sum': '$price'}}}]
    gmv_arr = [d async for d in properties_col.aggregate(pipeline_gmv)]
    gmv = gmv_arr[0]['sum'] if gmv_arr else 0

    return {
        'users': {'total': total_users, 'active': active_users},
        'properties': {'total': total_properties, 'active': active_properties, 'pending': pending_properties, 'verified': verified_properties},
        'enquiries': total_enquiries,
        'builders': total_builders,
        'gmv': gmv,
        'distribution': dist
    }


@router.get('/users')
async def list_users(role: Optional[str] = None, status: Optional[str] = None, search: Optional[str] = None, user=Depends(admin_only)):
    q = {}
    if role: q['role'] = role
    if status: q['status'] = status
    if search:
        q['$or'] = [{'name': {'$regex': search, '$options': 'i'}}, {'email': {'$regex': search, '$options': 'i'}}]
    cursor = users_col.find(q).sort([('created_at', -1)])
    return [clean(d) async for d in cursor]


@router.patch('/users/{user_id}/status')
async def update_user_status(user_id: str, status: str, user=Depends(admin_only)):
    if status not in ('active', 'suspended', 'pending'):
        raise HTTPException(status_code=400, detail='Invalid status')
    await users_col.update_one({'id': user_id}, {'$set': {'status': status}})
    doc = await users_col.find_one({'id': user_id})
    return clean(doc)


@router.get('/properties/pending')
async def pending_properties(user=Depends(admin_only)):
    cursor = properties_col.find({'$or': [{'verified': False}, {'status': 'pending'}]}).sort([('posted_at', -1)]).limit(50)
    return [clean(d) async for d in cursor]


@router.patch('/properties/{prop_id}/verify')
async def verify_property(prop_id: str, approve: bool = True, user=Depends(admin_only)):
    updates = {'verified': True, 'status': 'active'} if approve else {'status': 'rejected'}
    await properties_col.update_one({'id': prop_id}, {'$set': updates})
    doc = await properties_col.find_one({'id': prop_id})
    if doc: doc.pop('_id', None)
    return doc


@router.patch('/properties/{prop_id}/flag')
async def flag_property(prop_id: str, flag: str, value: bool = True, user=Depends(admin_only)):
    if flag not in ('featured', 'premium', 'vip', 'verified'):
        raise HTTPException(status_code=400, detail='Invalid flag')
    await properties_col.update_one({'id': prop_id}, {'$set': {flag: value}})
    doc = await properties_col.find_one({'id': prop_id})
    if doc: doc.pop('_id', None)
    return doc


@router.get('/enquiries')
async def list_all_enquiries(user=Depends(admin_only)):
    cursor = enquiries_col.find({}).sort([('created_at', -1)]).limit(100)
    return [{**d, '_id': None} for d in [clean(x) async for x in cursor]]
