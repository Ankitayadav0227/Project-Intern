# =========================
# 1. Build React frontend
# =========================

FROM node:22 AS frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend/ ./

RUN npm run build


# =========================
# 2. Run Flask backend
# =========================

FROM python:3.12-slim

WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt

RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend/ ./backend/

# Copy React production build
COPY --from=frontend-build /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

ENV PYTHONUNBUFFERED=1

CMD ["python", "app.py"]