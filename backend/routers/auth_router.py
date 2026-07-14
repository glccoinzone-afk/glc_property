from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime, timezone
import uuid
from database import users_col
from models import UserRegister, UserLogin, AuthResponse, UserOut
from auth import hash_password, verify_password, create_token, get_current_user

router = APIRouter(prefix='/auth', tags=['auth'])


@router.post('/register', response_model=AuthResponse)
async def register(body: UserRegister):
    existing = await users_col.find_one({'email': body.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail='Email already registered')
    if body.role not in ('user', 'agent'):
        body.role = 'user'  # Cannot self-register as admin

    now = datetime.now(timezone.utc)
    user_id = str(uuid.uuid4())
    doc = {
        'id': user_id,
        'name': body.name,
        'email': body.email.lower(),
        'phone': body.phone or '',
        'role': body.role,
        'status': 'active',
        'password': hash_password(body.password),
        'created_at': now
    }
    await users_col.insert_one(doc)
    token = create_token(user_id, doc['email'], doc['role'])
    doc.pop('password')
    return {'token': token, 'user': UserOut(**doc)}


@router.post('/login', response_model=AuthResponse)
async def login(body: UserLogin):
    user = await users_col.find_one({'email': body.email.lower()})
    if not user or not verify_password(body.password, user['password']):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    if user.get('status') == 'suspended':
        raise HTTPException(status_code=403, detail='Account suspended')
    token = create_token(user['id'], user['email'], user['role'])
    user.pop('password', None)
    user.pop('_id', None)
    return {'token': token, 'user': UserOut(**user)}


@router.get('/me', response_model=UserOut)
async def me(user: dict = Depends(get_current_user)):
    user.pop('_id', None)
    return UserOut(**user)
