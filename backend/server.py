from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import logging
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from database import client
from seed import seed_all
from routers.auth_router import router as auth_router
from routers.properties_router import router as properties_router
from routers.builders_router import router as builders_router
from routers.user_actions_router import router as user_actions_router
from routers.admin_router import router as admin_router

app = FastAPI(title='GLC Property API', version='1.0.0')

api_router = APIRouter(prefix='/api')


@api_router.get('/')
async def root():
    return {
        'status': 'ok',
        'service': 'GLC Property API',
        'company': 'GLCZONE Private Limited',
        'address': 'Bangali Lane, Ward 28, Dharamganj, Kishanganj Bazar, Kishanganj, Bihar 855108',
        'cin': 'U68100BR2025PTC077112',
        'version': '1.0.0'
    }


@api_router.get('/health')
async def health():
    return {'status': 'healthy'}


api_router.include_router(auth_router)
api_router.include_router(properties_router)
api_router.include_router(builders_router)
api_router.include_router(user_actions_router)
api_router.include_router(admin_router)

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*']
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event('startup')
async def on_startup():
    try:
        await seed_all()
        logger.info('Seed completed')
    except Exception as e:
        logger.exception(f'Seed failed: {e}')


@app.on_event('shutdown')
async def on_shutdown():
    client.close()
