import pg from "pg";

// En local se usan las variables DB_*. Si existe DATABASE_URL (ej. deploy en Vercel
// con una base en la nube como Neon o Supabase), se usa esa con SSL.
const pool = process.env.DATABASE_URL
  ? new pg.Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
  : new pg.Pool({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

export default pool;
