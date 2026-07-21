# CarpetaOS 🖥️

> Sistema de evidencias estilo OS — Juan Carlos Alvarado Rucobo

**CarpetaOS** es una aplicación web con interfaz de sistema operativo (estilo Windows XP cyberpunk) que muestra proyectos, APIs y servicios activos, certificaciones y perfil profesional.

## Stack

| Capa | Tecnología |
|------|-----------|
| Frontend | Vue 3 + Vuetify 3 + Pinia |
| Backend | FastAPI (Python) |
| Deploy | Render (static + web service) |
| Fuentes | Orbitron · JetBrains Mono |

## Estructura

```
CarpetadeEvidencias/
├── frontend/          # Vue 3 + Vuetify
│   ├── src/
│   │   ├── components/
│   │   │   ├── apps/          # Terminal, Projects, Certificates, AboutMe, Browser
│   │   │   ├── Desktop.vue
│   │   │   ├── Taskbar.vue
│   │   │   ├── OsWindow.vue
│   │   │   └── ProjectCard.vue
│   │   └── stores/            # Pinia: windows.js, projects.js
├── backend/           # FastAPI
│   ├── data/
│   │   ├── projects.json     ← EDITAR con proyectos reales
│   │   └── certificates.json ← EDITAR con certificados reales
│   └── main.py
└── render.yaml
```

## Desarrollo local

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
# API disponible en http://localhost:8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# App disponible en http://localhost:5173
```

## Agregar tus proyectos reales

Edita `backend/data/projects.json`:

```json
{
  "id": 9,
  "name": "Mi Proyecto",
  "description": "Descripción del proyecto",
  "type": "API",          // API | Service | Project | Tool
  "status": "live",       // live | maintenance | inactive
  "tech": ["Python", "FastAPI"],
  "url": "https://mi-proyecto.com",
  "github": "https://github.com/jcar2/mi-proyecto",
  "last_deploy": "2026-07-15",
  "version": "v1.0.0",
  "uptime": "99.9%"
}
```

## Comandos de Terminal disponibles

| Comando | Descripción |
|---------|-------------|
| `help` | Lista todos los comandos |
| `projects` | Muestra todos los proyectos |
| `live` | Solo proyectos en producción |
| `status` | Estadísticas del sistema |
| `whoami` | Info del desarrollador |
| `links` | Redes sociales |
| `certs` | Lista certificaciones |
| `open <app>` | Abre una app (terminal, projects, certificates, aboutme, portfolio, github) |
| `date` | Fecha y hora |
| `matrix` | 🐉 Easter egg |
| `clear` | Limpia la terminal |

## Deploy en Render

1. Sube el código a GitHub
2. En Render, conecta el repo y usa `render.yaml` (Blueprint)
3. Actualiza `VITE_API_URL` en el frontend con la URL real del backend

## Personalización

- **Proyectos**: Edita `backend/data/projects.json`
- **Certificados**: Edita `backend/data/certificates.json`
- **Info personal**: Edita `frontend/src/components/apps/AboutMe.vue`
- **Links sociales**: Edita `frontend/src/components/Taskbar.vue` (start menu footer)
