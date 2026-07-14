from fastapi import APIRouter, Depends
from database import builders_col, land_projects_col

router = APIRouter(tags=['builders'])


def clean(d):
    if d: d.pop('_id', None)
    return d


@router.get('/builders')
async def list_builders(vip: bool = None, featured: bool = None, limit: int = 50):
    q = {}
    if vip is not None: q['is_vip'] = vip
    if featured is not None: q['is_featured'] = featured
    cursor = builders_col.find(q).limit(limit)
    return [clean(d) async for d in cursor]


@router.get('/land-projects')
async def list_land(vip: bool = None, featured: bool = None, limit: int = 50):
    q = {}
    if vip is not None: q['is_vip'] = vip
    if featured is not None: q['is_featured'] = featured
    cursor = land_projects_col.find(q).limit(limit)
    return [clean(d) async for d in cursor]
