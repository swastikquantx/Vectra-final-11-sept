import os
import uuid
import time
import jwt
from datetime import datetime, timedelta
from typing import Optional, Dict, List
from fastapi import FastAPI, HTTPException, Depends, Request, Response, Cookie
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

MONGODB_URI = os.getenv("MONGODB_URI", "")
JWT_SECRET = os.getenv("JWT_SECRET", "vectra-dev-secret-change-in-prod")
FOUNDER_EMAILS = [e.strip().lower() for e in os.getenv("FOUNDER_EMAILS", "akhil718@gmail.com").split(",") if e.strip()]
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
VEO_MODEL = os.getenv("VEO_MODEL", "veo-3.1-generate-preview")
UPI_ID = os.getenv("UPI_ID", "7359777788@UPI")

# MongoDB optional
mongo_client = None
db = None
mongo_available = False
if MONGODB_URI:
    try:
        from pymongo import MongoClient
        mongo_client = MongoClient(MONGODB_URI, serverSelectionTimeoutMS=5000)
        mongo_client.admin.command('ping')
        db_name = MONGODB_URI.split("/")[-1].split("?")[0] or "vectra"
        if not db_name or db_name.startswith("mongodb"):
            db_name = "vectra"
        db = mongo_client[db_name]
        mongo_available = True
    except Exception as e:
        print(f"MongoDB unavailable: {e}")
        mongo_available = False

MEM_DB: Dict[str, Dict] = {
    "users": {},
    "sessions": {},
    "projects": {},
    "media": {},
    "video_jobs": {},
    "oauth_tokens": {},
    "performance_tasks": {},
    "faceless_channels": {},
    "workflows": {},
    "usage": {}
}

def get_collection(name: str):
    if mongo_available and db is not None:
        return db[name]
    return None

def resolve_role(email: str, db_role: str = "user"):
    if email.lower() in FOUNDER_EMAILS:
        return "founder"
    return db_role or "user"

def create_jwt(user_id: str):
    payload = {"user_id": user_id, "exp": datetime.utcnow() + timedelta(days=7)}
    return jwt.encode(payload, JWT_SECRET, algorithm="HS256")

def decode_jwt(token: str):
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=["HS256"])
    except:
        return None

# THIS IS THE APP RENDER NEEDS
app = FastAPI(title="Vectra AI - Swastik AI Labs", version="1.0.0")

origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if "*" in origins else origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class RegisterIn(BaseModel):
    email: str
    password: str
    name: Optional[str] = "User"

class LoginIn(BaseModel):
    email: str
    password: str

class ProjectIn(BaseModel):
    name: str
    description: Optional[str] = ""

def db_find_one(col_name: str, query: dict):
    col = get_collection(col_name)
    if col is not None:
        return col.find_one(query)
    for doc in MEM_DB[col_name].values():
        if all(doc.get(k) == v for k, v in query.items()):
            return doc
    return None

def db_find(col_name: str, query: dict):
    col = get_collection(col_name)
    if col is not None:
        return list(col.find(query, {"_id": 0}))
    return [d for d in MEM_DB[col_name].values() if all(d.get(k)==v for k,v in query.items())]

def db_insert(col_name: str, doc: dict):
    col = get_collection(col_name)
    if col is not None:
        col.insert_one(doc)
    else:
        MEM_DB[col_name][doc.get("id") or str(uuid.uuid4())] = doc

def get_current_user(request: Request, session_token: str = Cookie(None)):
    token = None
    if request.headers.get("Authorization"):
        auth = request.headers.get("Authorization")
        if auth.startswith("Bearer "):
            token = auth.replace("Bearer ", "")
    if not token:
        token = session_token
    if not token:
        token = request.cookies.get("session_id")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    payload = decode_jwt(token)
    if not payload:
        if token in MEM_DB["sessions"]:
            user_id = MEM_DB["sessions"][token]
            user = db_find_one("users", {"id": user_id})
            if user:
                user["role"] = resolve_role(user["email"], user.get("role"))
                return user
        raise HTTPException(status_code=401, detail="Invalid session")
    user_id = payload.get("user_id")
    user = db_find_one("users", {"id": user_id})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    user["role"] = resolve_role(user["email"], user.get("role"))
    return user

@app.get("/")
def root():
    return {"app": "Vectra AI", "status": "running", "upi": UPI_ID}

@app.get("/api/health")
def health():
    return {
        "app": "VECTRA - Swastik AI Labs",
        "database": "CONNECTED" if mongo_available else "NOT_CONFIGURED",
        "gemini": "CONFIGURED" if GEMINI_API_KEY else "NOT_CONFIGURED",
        "veo": {"model": VEO_MODEL, "status": "CONFIGURED" if GEMINI_API_KEY else "NOT_CONFIGURED"},
        "distribution": {
            "youtube": "NOT_CONFIGURED" if not os.getenv("YOUTUBE_CLIENT_ID") else "CONFIGURED",
            "instagram": "NOT_CONFIGURED" if not os.getenv("META_APP_ID") else "CONFIGURED",
        },
        "upi": UPI_ID,
        "founder_emails": FOUNDER_EMAILS,
    }

@app.post("/api/auth/register")
def register(data: RegisterIn, response: Response):
    existing = db_find_one("users", {"email": data.email.lower()})
    if existing:
        raise HTTPException(400, "Email exists")
    uid = str(uuid.uuid4())
    role = resolve_role(data.email, "user")
    doc = {"id": uid, "email": data.email.lower(), "name": data.name, "role": role, "password": data.password, "created_at": time.time()}
    db_insert("users", doc)
    jwt_token = create_jwt(uid)
    MEM_DB["sessions"][jwt_token] = uid
    response.set_cookie(key="session_id", value=jwt_token, httponly=True, samesite="lax")
    return {"user": {k: v for k, v in doc.items() if k != "password"}, "token": jwt_token}

@app.post("/api/auth/login")
def login(data: LoginIn, response: Response):
    user = db_find_one("users", {"email": data.email.lower()})
    if not user or user.get("password") != data.password:
        raise HTTPException(401, "Invalid credentials")
    user["role"] = resolve_role(user["email"], user.get("role"))
    jwt_token = create_jwt(user["id"])
    MEM_DB["sessions"][jwt_token] = user["id"]
    response.set_cookie(key="session_id", value=jwt_token, httponly=True, samesite="lax")
    return {"user": {k: v for k, v in user.items() if k != "password"}, "token": jwt_token}

@app.get("/api/auth/me")
def me(current_user: dict = Depends(get_current_user)):
    return {"user": {k: v for k, v in current_user.items() if k != "password"}}

@app.post("/api/projects")
def create_project(data: ProjectIn, user=Depends(get_current_user)):
    pid = str(uuid.uuid4())
    doc = {"id": pid, "user_id": user["id"], "name": data.name, "description": data.description, "created_at": time.time(), "updated_at": time.time()}
    db_insert("projects", doc)
    return doc
from fastapi.staticfiles import StaticFiles
import os

# Serve React frontend from backend (for Hostinger single deploy)
frontend_path = os.path.join(os.path.dirname(__file__), "frontend", "build")
if os.path.exists(frontend_path):
    app.mount("/", StaticFiles(directory=frontend_path, html=True), name="frontend")
@app.get("/api/projects")
def list_projects(user=Depends(get_current_user)):
    return db_find("projects", {"user_id": user["id"]})
