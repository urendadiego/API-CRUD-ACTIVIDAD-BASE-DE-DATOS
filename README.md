# API Eventos – CRUD de empresas

API del sistema de eventos **multitenant** (Node.js + Express + PostgreSQL).
En esta etapa solo existe la tabla `empresas`.

## Puesta en marcha

1. Clonar el repo e instalar dependencias:
   ```bash
   npm install
   ```
2. Crear la base de datos en PostgreSQL (pgAdmin o psql):
   ```sql
   CREATE DATABASE eventos;
   ```
   Conectarse a `eventos` y ejecutar el script [database/empresas.sql](database/empresas.sql).
3. Copiar `.env.example` a `.env` y completar la contraseña de **su** Postgres:
   ```
   PORT=3000
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=su_contraseña
   DB_NAME=eventos
   ```
   El `.env` **nunca** se sube a GitHub (ya está en `.gitignore`).
4. Levantar el servidor:
   ```bash
   npm run dev
   ```
   Queda en `http://localhost:3000`.

## Estructura

```
database/empresas.sql                  → script de la tabla
src/index.js                           → crea el servidor y conecta todo
src/routes/empresas.routes.js          → QUÉ rutas existen
src/controllers/empresas.controller.js → QUÉ hace cada ruta
src/data/db.js                         → conexión a la base de datos
```

## Endpoints

| Método | Ruta                | Acción                   | Respuesta |
| ------ | ------------------- | ------------------------ | --------- |
| GET    | `/api/empresas`     | Listar todas las empresas | 200       |
| GET    | `/api/empresas/:id` | Obtener una empresa      | 200 / 404 |
| POST   | `/api/empresas`     | Crear una empresa        | 201 / 400 |
| PUT    | `/api/empresas/:id` | Editar una empresa       | 200 / 404 |
| DELETE | `/api/empresas/:id` | Eliminar una empresa     | 204 / 404 |

- Al crear, `nombre` y `cuit` son obligatorios (si faltan → 400). Un `cuit` repetido también responde 400.
- En el PUT se pueden mandar solo los campos a modificar; el resto queda igual.
- El `id` lo genera la base (SERIAL), nunca se toma del body.

Ejemplo de body para POST:
```json
{
  "nombre": "Mi Empresa",
  "cuit": "30-71111111-1",
  "email": "contacto@miempresa.com",
  "telefono": "351-4000000",
  "direccion": "Calle 123, Córdoba"
}
```

## Deploy (opcional)

La actividad se corre en local. Si más adelante se sube a Vercel, la base tiene que estar en la nube
(Neon, Supabase, etc.), porque Vercel no puede conectarse al Postgres de una computadora personal.
En ese caso se define `DATABASE_URL` en las variables de entorno de Vercel y `db.js` la usa automáticamente.
