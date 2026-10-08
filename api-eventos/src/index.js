import "dotenv/config";
import os from "node:os";
import express from "express";
import cors from "cors";
import empresasRouter from "./routes/empresas.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;
// Nombre de la réplica (en Docker: api1, api2, api3) para ver el balanceo de nginx
const INSTANCIA = process.env.INSTANCIA || os.hostname();

app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

app.use((req, res, next) => {
  res.set("X-Instancia", INSTANCIA);
  next();
});

app.get("/api/salud", (req, res) => {
  res.json({ estado: "ok", instancia: INSTANCIA });
});

app.use("/api/empresas", empresasRouter);

// Ruta 404 para rutas inexistentes (siempre al final)
app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// En Vercel la plataforma maneja el servidor; en local lo levantamos nosotros
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`[${INSTANCIA}] Servidor escuchando en http://localhost:${PORT}`);
  });
}

export default app;
