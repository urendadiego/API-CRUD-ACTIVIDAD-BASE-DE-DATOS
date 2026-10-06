# API Eventos – CRUD de empresas

API del sistema de eventos **multitenant** (Node.js + Express + PostgreSQL).
En esta etapa solo existe la tabla `empresas`.

## Puesta en marcha

1. Clonar el repo e instalar dependencias:
   ```bash
   npm install
   ```
2. Crear el archivo `.env` (copiando `.env.example`) con la conexión a la base **compartida del grupo en Supabase**:
   ```
   PORT=3000
   DATABASE_URL=postgresql://postgres.xxxx:CONTRASEÑA@aws-1-us-west-2.pooler.supabase.com:5432/postgres
   ```
   La `DATABASE_URL` se pide por privado al grupo (Supabase → Connect → URI → **Session pooler**).
   El `.env` **nunca** se sube a GitHub (ya está en `.gitignore`).
3. (Opcional) Para usar un PostgreSQL local en vez de Supabase: crear una base, ejecutar
   [database/empresas.sql](database/empresas.sql), borrar `DATABASE_URL` del `.env` y completar las variables `DB_*`.
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

## Base de datos

- Todo el grupo comparte **una sola base** en Supabase (la tabla `empresas` ya está creada ahí).
  Si uno crea o borra una empresa, los demás lo ven.
- Si `DATABASE_URL` existe, [src/data/db.js](src/data/db.js) la usa (con SSL); si no, usa las variables `DB_*`.
- Si la URL trae `?sslmode=require` al final, sacarlo (el SSL ya lo configura `db.js`).

## Deploy (opcional)

Si se sube a Vercel, se carga `DATABASE_URL` en las variables de entorno del proyecto
(conviene la URL del **Transaction pooler**, puerto 6543).
