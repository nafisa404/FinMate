from fastapi import APIRouter
from app.api.v1.endpoints import auth, transactions, investments, subscriptions, learning, users, analytics

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(transactions.router, prefix="/transactions", tags=["transactions"])
api_router.include_router(investments.router, prefix="/investments", tags=["investments"])
api_router.include_router(subscriptions.router, prefix="/subscriptions", tags=["subscriptions"])
api_router.include_router(learning.router, prefix="/learning", tags=["learning"])
api_router.include_router(analytics.router, prefix="/analytics", tags=["analytics"]) 