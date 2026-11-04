# Portafolio de dibujos

Portafolio mínimo con una galería pública y un panel privado para subir dibujos.

- **`/`** — galería pública: cualquiera puede ver los dibujos.
- **`/login`** — ruta privada con usuario y contraseña.
- **`/admin`** — panel protegido para subir y borrar dibujos.
- **Modo oscuro/claro** — la vista arranca en oscuro y el botón del header guarda
  tu preferencia en el navegador.
- **Header y footer** — botón grande de Galería y botón Artista con su ficha.
- **Ficha de cada dibujo** — al hacer clic en una pieza se abre su metadata
  (título, descripción y fecha) desde el mismo `drawings.json`.

La ficha del artista se edita en `frontend/src/content.ts`.

## Stack

| Parte      | Tecnología                                             |
| ---------- | ------------------------------------------------------ |
| Frontend   | React Native (React Native Web) + Vite + TypeScript    |
| Backend    | NestJS + TypeScript, JWT, Multer                       |
| Almacenaje | Archivos en disco (`uploads/`) + índice en JSON        |
| Deploy     | Render (sitio estático + servicio Docker)              |

El front se compila a web con `npm install && npm run build`; no necesita Docker.
La API sí se empaqueta como imagen con su `Dockerfile` y se levanta con `docker compose`.
La API expone los datos y las imágenes que consume el front; el front es un sitio
estático aparte.

## Estructura

```
backend/
  src/
    auth/       login, JWT y guard
    drawings/   listar, subir y borrar dibujos
    main.ts     arranque, CORS y /uploads
  Dockerfile
  uploads/      imágenes subidas
  data/         drawings.json (índice)
frontend/
  src/
    components/ SiteHeader, SiteFooter, Dialog, ArtistDialog, DrawingDialog
    screens/    GalleryScreen, LoginScreen, AdminScreen
    api.ts      cliente de la API
    content.ts  ficha editable del artista
    theme.ts    paletas clara y oscura
    ThemeProvider.tsx  tema y persistencia
docker-compose.yml
render.yaml
```

## Rutas de la API

| Método   | Ruta                  | Acceso   | Qué hace                          |
| -------- | --------------------- | -------- | --------------------------------- |
| `GET`    | `/api/health`         | Público  | Estado del servicio               |
| `GET`    | `/api/drawings`       | Público  | Lista de dibujos                  |
| `GET`    | `/uploads/<archivo>`  | Público  | Imagen del dibujo                 |
| `POST`   | `/api/auth/login`     | Público  | Devuelve un token JWT             |
| `POST`   | `/api/drawings`       | Privado  | Sube un dibujo (`image`, `title`, `description`) |
| `DELETE` | `/api/drawings/:id`   | Privado  | Borra un dibujo y su archivo      |

Las rutas privadas esperan `Authorization: Bearer <token>`.

CORS: la API permite cualquier origen por defecto. Si definís `CORS_ORIGIN`, solo
acepta esa lista separada por comas (con soporte de comodines como
`https://*.onrender.com`).

## Correr en local

Requisitos: Node 20+.

### API

```bash
cd backend
cp .env.example .env        # editá ADMIN_USER, ADMIN_PASSWORD y JWT_SECRET
npm install
npm run start:dev           # http://localhost:3000
```

### Front

```bash
cd frontend
cp .env.example .env        # VITE_API_URL=http://localhost:3000
npm install
npm run dev                 # http://localhost:5173
```

Compilado de producción del front:

```bash
cd frontend
npm install
npm run build               # genera frontend/dist
npm run preview             # sirve el build
```

## Docker Compose

Levanta la API (con su Dockerfile) y el front en un contenedor Node que hace
`npm install && npm run build` y sirve el build. El front no tiene Dockerfile.

```bash
cp .env.example .env        # cambiá la contraseña y el secreto
docker compose up --build
```

- Front: http://localhost:5173
- API: http://localhost:3000/api

Los datos quedan en los volúmenes `api-data` y `api-uploads`. Para bajar todo:
`docker compose down` (agregá `-v` si querés borrar también las imágenes).

## Desplegar en Render (gratis)

1. Subí el repo a GitHub.
2. En Render: **New → Blueprint**, elegí el repo. Render lee `render.yaml` y crea
   los dos servicios: `portfolio-api` (Docker) y `portfolio-web` (estático).
3. Completá las variables que Render te pide:
   - `ADMIN_PASSWORD` (API): la contraseña del panel.
   - `VITE_API_URL` (front): la URL de la API, por ejemplo
     `https://portfolio-api.onrender.com`.
   - `CORS_ORIGIN` (API): opcional. Por defecto es `*` (cualquier origen); para
     restringirlo, poné la URL del front, por ejemplo
     `https://portfolio-web.onrender.com`.
4. Esperá ambos deploys y abrí la URL del front. El panel está en `/login`.

`JWT_SECRET` se genera solo. `ADMIN_USER` queda en `admin` (podés cambiarlo en
`render.yaml` o desde el dashboard).

### Si el navegador muestra un error de CORS

El síntoma típico es `Response body is not available to scripts (Reason: CORS
Missing Allow Origin)`. La API ya permite cualquier origen si `CORS_ORIGIN` no
está definida, así que revisá que:

- `CORS_ORIGIN` en la API esté vacía o sea `*`, o bien que contenga exactamente
  el origen del front (esquema + dominio, sin barra final ni `/login`).
- `VITE_API_URL` en el **front** apunte a la API y hayas redeployado el sitio
  estático después de cambiarla (Vite la incrusta en el build).

Para comprobar la respuesta de la API:

```bash
curl -i -H "Origin: https://portfolio-web.onrender.com" \
  https://portfolio-api.onrender.com/api/health
```

La respuesta debe incluir `access-control-allow-origin`.

Si preferís crearlos a mano en vez de usar el Blueprint:

- **API:** Web Service → Docker, `dockerfilePath: backend/Dockerfile`,
  `dockerContext: backend`, health check `/api/health`.
- **Front:** Static Site, `rootDir: frontend`,
  build `npm install && npm run build`, publish `frontend/dist`,
  rewrite `/*` → `/index.html` (para que `/login` funcione al recargar).

## Cosas a tener en cuenta

- **Almacenamiento efímero:** en el plan free de Render el disco se reinicia en
  cada deploy. Las imágenes y `drawings.json` se pierden. Para conservarlas,
  montá un disco persistente (plan pago) o cambiá el almacenaje por un servicio
  de objetos (S3, Cloudinary, Supabase Storage, etc.).
- **Un solo usuario:** las credenciales salen de `ADMIN_USER` y
  `ADMIN_PASSWORD`. Cambiá la contraseña por defecto y usá un `JWT_SECRET` largo.
- **Cold start:** los servicios free de Render se duermen tras un rato sin uso;
  la primera visita puede tardar unos segundos.
- **Formatos:** JPG, PNG, WEBP, GIF o AVIF, hasta 10 MB por archivo.

## Personalizar

- Ficha del artista (nombre, bio y datos): `frontend/src/content.ts`.
- Paletas clara y oscura y tipografías: `frontend/src/theme.ts`.
- Textos de la galería y el footer: `frontend/src/screens/GalleryScreen.tsx` y
  `frontend/src/components/SiteFooter.tsx`.
- Usuario/contraseña: variables de entorno del backend.
