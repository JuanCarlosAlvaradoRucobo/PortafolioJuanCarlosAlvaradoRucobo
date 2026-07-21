from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json, os, httpx
from pathlib import Path

app = FastAPI(title="CarpetaOS API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"


def load_json(filename: str):
    with open(DATA_DIR / filename, "r", encoding="utf-8") as f:
        return json.load(f)


@app.get("/")
def root():
    return {"status": "CarpetaOS API Online", "version": "1.0.0"}


@app.get("/api/health")
def health():
    return {"status": "online", "message": "CarpetaOS backend is alive."}


@app.get("/api/projects")
def get_projects():
    return load_json("projects.json")


@app.get("/api/projects/{project_id}")
def get_project(project_id: int):
    projects = load_json("projects.json")
    for p in projects:
        if p["id"] == project_id:
            return p
    return {"error": "Project not found"}, 404


@app.get("/api/certificates")
def get_certificates():
    return load_json("certificates.json")


@app.get("/api/ping")
async def ping_url(url: str):
    """Check if a URL is reachable."""
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.head(url, follow_redirects=True)
            return {
                "url": url,
                "status": "online",
                "http_code": resp.status_code,
                "latency_ms": None,
            }
    except Exception as e:
        return {"url": url, "status": "offline", "error": str(e)}


@app.get("/api/stats")
def get_stats():
    projects = load_json("projects.json")
    live = sum(1 for p in projects if p["status"] == "live")
    maintenance = sum(1 for p in projects if p["status"] == "maintenance")
    inactive = sum(1 for p in projects if p["status"] == "inactive")
    return {
        "total": len(projects),
        "live": live,
        "maintenance": maintenance,
        "inactive": inactive,
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
