# === Stage 1: Build React Frontend ===
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# === Stage 2: Python Backend that SERVES frontend ===
FROM python:3.11-slim
WORKDIR /app

# Install Python deps
COPY backend/requirements.txt ./requirements.txt
# fallback if requirements in root
COPY requirements.txt ./requirements_root.txt
RUN pip install --no-cache-dir -r requirements.txt || pip install --no-cache-dir -r requirements_root.txt
RUN pip install fastapi uvicorn pymongo python-jose python-multipart google-generativeai python-dotenv

# Copy backend code
COPY backend/ ./backend/
COPY server.py ./server.py
# Some repos have server.py inside backend/
RUN if [ ! -f server.py ] && [ -f backend/server.py ]; then cp backend/server.py ./server.py; fi

# Copy built frontend from stage 1
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Env
ENV PORT=8080
EXPOSE 8080

# Start - Google Cloud Run needs 0.0.0.0 and $PORT
CMD uvicorn server:app --host 0.0.0.0 --port 8080