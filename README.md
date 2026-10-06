# Backstage – Sistema de eventos multitenant

Plataforma para **productoras de recitales y festivales**. Cada productora es un *tenant* (empresa)
y en el futuro gestionará sus propios eventos; este panel es para nosotros, los dueños de la
plataforma, y sirve para administrar las productoras registradas.

```
proyecto-eventos/
├── api-eventos/     → backend (Node + Express + PostgreSQL en Supabase) · puerto 3000
└── front-eventos/   → frontend (React + Vite + Ant Design) · puerto 5173
```

## Cómo correrlo

Se necesitan **dos terminales**, una para cada parte.

```bash
# Terminal 1
cd api-eventos
npm install
npm run dev        # http://localhost:3000

# Terminal 2
cd front-eventos
npm install
npm run dev        # http://localhost:5173  ← abrir esto en el navegador
```

### Archivos `.env` (no se suben a GitHub)

**api-eventos/.env** (la `DATABASE_URL` se pide por privado al grupo)
```
PORT=3000
FRONTEND_URL=http://localhost:5173
DATABASE_URL=postgresql://...supabase...
```

**front-eventos/.env**
```
VITE_API_URL=http://localhost:3000/api
```

Cada carpeta tiene un `.env.example` para copiar. Más detalle de la API en [api-eventos/README.md](api-eventos/README.md).

## Front

| Ruta | Pantalla |
| --- | --- |
| `/` | Listado de productoras (búsqueda, orden, filtro por estado, eliminar con confirmación) |
| `/empresas/nueva` | Formulario de alta |
| `/empresas/:id/editar` | Mismo formulario, precargado (incluye activar/desactivar) |
| cualquier otra | Página 404 |

```
front-eventos/src/
├── main.jsx                 → BrowserRouter + tema de Ant Design
├── App.jsx                  → QUÉ pantallas existen
├── services/empresasService.js → llamadas a la API (axios)
├── pages/                   → Empresas.jsx, EmpresaForm.jsx, NoEncontrada.jsx
└── components/Navbar.jsx
```

## Trabajo en grupo

- Antes de empezar: `git pull`.
- Una rama por tarea: `git checkout -b nombre-tarea`, y al terminar Pull Request a `main`.
