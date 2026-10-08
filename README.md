# Backstage – Trabajo práctico intermaterias

Un mismo sistema de gestión de eventos que se desarrolla y evalúa en **cuatro materias**.
Cada profesor pide algo distinto del proyecto, así que cada materia tiene su propia sección,
con su consigna, su entregable y su plan.

| Materia | Qué evalúa | Entregable | Consigna |
| --- | --- | --- | --- |
| [Programación 2 y Base de Datos](#programación-2-y-base-de-datos) | El software: arquitectura, API, front, base de datos | Código en este repo | [docs/PLAN.md](docs/PLAN.md) |
| [Sistemas de Información](#sistemas-de-información) | Relevamiento, análisis y diseño (DDD) | Avances en clase y un **documento formal escrito** | [docs/consignas/sistemas-de-informacion.md](docs/consignas/sistemas-de-informacion.md) |
| [Sistemas Operativos](#sistemas-operativos) | Despliegue con réplicas, Docker y Nginx | Demo + `docker-compose.yml` + `nginx.conf` | [docs/consignas/sistemas-operativos.md](docs/consignas/sistemas-operativos.md) |

> **Antes de seguir, ver [Alcance a resolver entre materias](#alcance-a-resolver-entre-materias).**
> El alcance que fija Sistemas de Información no coincide con el de [docs/PLAN.md](docs/PLAN.md).

```
proyecto-eventos/
├── api-eventos/        → backend (Node + Express + PostgreSQL en Supabase) · puerto 3000
├── front-eventos/      → frontend (React + Vite + Ant Design) · puerto 5173
└── docs/
    ├── PLAN.md         → plan técnico (Programación 2 y Base de Datos)
    └── consignas/      → texto original de las consignas de cada materia
```

---

## Programación 2 y Base de Datos

Plataforma para **productoras de recitales y festivales**. Cada productora es un *tenant* (empresa)
y en el futuro gestionará sus propios eventos; este panel es para nosotros, los dueños de la
plataforma, y sirve para administrar las productoras registradas.

El dominio, el DER, los roles, los endpoints y las fases están en [docs/PLAN.md](docs/PLAN.md).

### Cómo correrlo

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

#### Archivos `.env` (no se suben a GitHub)

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

### Front

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

### Trabajo en grupo

- Antes de empezar: `git pull`.
- Una rama por tarea: `git checkout -b nombre-tarea`, y al terminar Pull Request a `main`.

---

## Sistemas de Información

**Qué evalúa:** el **proceso** de relevamiento, análisis y diseño conceptual, más el resultado final.
No hay plantilla obligatoria, pero el trabajo tiene que mostrar el análisis, sus fundamentos y cómo fue cambiando.
Todos los integrantes tienen que poder explicar las decisiones.
Texto completo: [docs/consignas/sistemas-de-informacion.md](docs/consignas/sistemas-de-informacion.md).

### El caso

Una **empresa organizadora de eventos** que le organiza eventos **a sus clientes** y coordina los servicios necesarios
(proveedores). El software lo usa **solo el personal de la organizadora**.

**Objetivo del software:** centralizar los requerimientos del cliente, la propuesta acordada y los compromisos de preparación,
para que el personal sepa qué se acordó, quién tiene que hacer qué y qué falta resolver.

**Límites:** eventos de **una jornada**, en **una sede**, de escala chica o mediana. Cada evento es de un cliente contratante.
Las comunicaciones con clientes y proveedores pasan por fuera de la app; en la app se registra el resultado.
El análisis es sobre **una sola empresa**, aunque otras materias pidan que el software sea multiempresa.

### Alcance obligatorio del software

| Área | Qué tiene que permitir |
| --- | --- |
| Clientes y solicitudes | Datos de contacto y solicitud: tipo de evento, fecha, sede prevista, asistentes estimados, necesidades y preferencias |
| Propuesta y presupuesto | Servicios con importes y total; modificarla mientras se negocia; registrar aceptación o rechazo. **Una propuesta vigente por solicitud** |
| Confirmación del encargo | Registrar a mano que el cliente confirmó, con los servicios y condiciones acordados |
| Servicios y proveedores | Datos básicos de proveedores, vinculados a los servicios del evento, con estado pendiente o confirmado |
| Preparación y seguimiento | Tareas con responsable interno, fecha prevista y estado; ver servicios sin confirmar y tareas pendientes o vencidas |
| Consulta y cierre | Buscar eventos por fecha o estado, ver el resumen del encargo, registrar realización o cancelación con observaciones |
| Cambios y cancelaciones | Registrar cambios relevantes (fecha, servicio) y revisar los compromisos afectados; cancelar conservando la información y el motivo |

**Queda fuera:** venta de entradas, control de acceso, gestión de invitados, cobros y pagos, facturación, inventario y logística,
reservas automáticas, portales para clientes o proveedores, integraciones (WhatsApp, mail, pasarelas de pago),
**eventos de varios días o sedes** y coordinación de varias salas simultáneas.

**Demo obligatoria:** solicitud → propuesta → aceptación → servicios y tareas → pendientes → cierre.
Además: una propuesta rechazada, un cambio relevante y una cancelación. Con login del personal y permisos sencillos.

### Qué hay que hacer

Las partes no son etapas separadas: se trabajan juntas y de forma iterativa.

1. **Relevamiento** con el "cliente" de ChatGPT que arma la profesora.
   - Se pregunta **cómo funciona la empresa**. No vale preguntarle por el límite del sistema, el entorno o los elementos: eso lo deducimos nosotros.
   - No inventar cómo funciona la organización. Las hipótesis sirven para nuevas preguntas, pero se marcan como hipótesis.
   - Validar con el cliente nuestras interpretaciones.
2. **Sistema organizacional:** propósito, límites, entorno, actores, elementos, relaciones, entradas, procesos y salidas;
   subsistemas, restricciones e interdependencias; reservas, bucles y demoras cuando sirvan.
3. **Sistema de información:** quién produce, registra, consulta o modifica cada dato y para qué (operar, controlar, decidir);
   fuentes, canales y destinatarios; controles de calidad de la información; qué parte cubre el software y qué sigue fuera.
4. **DDD:** conceptos, procesos, responsabilidades y reglas; lenguaje ubicuo; subdominios y Bounded Contexts justificados; modelo conceptual.

Solo se analiza lo que interviene en la solución de software.

### Plan

| # | Tarea | Estado |
| --- | --- | --- |
| 1 | Enviar a la profesora: rubro, integrantes y correo de ChatGPT de cada uno | Pendiente |
| 2 | Preparar la entrevista inicial (clase 7) a partir de "Qué debe descubrir cada grupo" | Pendiente |
| 3 | Relevar con el cliente de ChatGPT y **guardar las conversaciones** (se piden para justificar decisiones) | Pendiente |
| 4 | Primer borrador del análisis organizacional, del SI y del modelo de dominio para la devolución en clase | Pendiente |
| 5 | Iterar: incorporar devoluciones y lo que aparezca al desarrollar | Continuo |
| 6 | Documento formal escrito consolidado | Al cierre |

---

## Sistemas Operativos

**Qué evalúa:** el despliegue del sistema con la arquitectura de Programación 2, replicada en varios contenedores,
con **Nginx como balanceador de carga** en la máquina de acceso y **una única base de datos SQL dockerizada**.
Texto completo: [docs/consignas/sistemas-operativos.md](docs/consignas/sistemas-operativos.md).

### Qué hay que mostrar

- **Servicios en Docker:** todos los componentes y réplicas corriendo bien dentro de contenedores.
- **Docker Compose:** el `docker-compose.yml` con la infraestructura, las réplicas y la red.
- **Configuración de Nginx:** explicar el `nginx.conf` que balancea la carga entre los nodos.

### Cómo encaja con lo que ya existe

| Tema | Situación |
| --- | --- |
| Base de datos | Hoy solo usamos Supabase. Hay que sumar un PostgreSQL en un contenedor. [db.js](api-eventos/src/data/db.js) ya soporta las variables `DB_*`, y los scripts de `api-eventos/database/` se pueden cargar al iniciar el contenedor. |
| Réplicas de la API | La API no guarda estado en memoria (sesión con JWT, todo en la base), así que se puede replicar sin cambios. |
| Nginx | Sirve el build del front y reparte `/api` entre las réplicas. Al quedar todo en el mismo origen, no hace falta CORS. Para la demo conviene que cada réplica se identifique (por ejemplo, un header `X-Instancia`). |

Propuesta de servicios del `docker-compose.yml`: `nginx` (puerto 80, front + balanceo), `api` ×3 y `postgres` con volumen, todos en una red interna.

### Dudas para el profesor

- "Una única base de datos … dockerizada (la SQL) **y la otra vía web**": ¿la otra es una base en la web (Supabase)
  o se refiere a que la aplicación se accede por web?

---

## Alcance a resolver entre materias

El plan actual ([docs/PLAN.md](docs/PLAN.md)) y el alcance de Sistemas de Información describen **dos negocios distintos**:

| | docs/PLAN.md (Prog. 2 y BD) | Sistemas de Información |
| --- | --- | --- |
| Empresa | Productora que arma **sus propios** recitales y festivales | Organizadora que organiza eventos **para un cliente contratante** |
| Usuarios | Superadmin, productoras y **público que compra** | Solo el **personal** de la organizadora |
| Núcleo | Line-up, tarifas, **venta de entradas**, pago, control de acceso | Solicitudes, propuestas, encargos, proveedores, tareas |
| Eventos | Festivales de **varias jornadas** y escenarios simultáneos | **Una jornada, una sede** |

Casi todo lo que el PLAN tiene como núcleo (venta de entradas, pasarela de pago, control de acceso, portal para el público,
eventos de varios días) aparece en la lista de **"Qué queda fuera"** de SI. Y lo obligatorio de SI (propuestas, proveedores,
tareas, cierre) no está en el PLAN.

Lo que sí es compatible: el multitenant (SI acepta que otras materias lo pidan), la tabla `empresas`, el login con roles
y todo el despliegue de Sistemas Operativos.

**Para decidir en grupo y consultar con los profesores:**
1. ¿El software es uno solo para las cuatro materias? Si es así, ¿manda el alcance de SI?
2. ¿Qué rubro le mandamos a la profesora de SI? Tiene que ser una organizadora que trabaja para clientes
   (por ejemplo, organizadora de recitales o shows privados para clientes), no una ticketera.
3. Según la respuesta, actualizar [docs/PLAN.md](docs/PLAN.md) **después** del relevamiento, no antes:
   el dominio tiene que salir de la entrevista con el cliente.
