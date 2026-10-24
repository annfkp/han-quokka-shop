# Han Quokka Shop — proyecto escolar React + Express + MySQL

Catálogo fan-made conceptual de artículos inspirados en Han Jisung / Han Quokka. **No es una tienda oficial ni procesa pagos.** Los productos y precios iniciales son datos de demostración; se pueden cambiar desde la aplicación.

## Qué incluye
- React + Vite para la página.
- Axios para comunicarse con la API.
- Node.js + Express para las rutas.
- MySQL con categorías y productos relacionados.
- CRUD de productos: consultar, agregar, editar y eliminar.
- Archivos preparados para publicar el backend en Render y el frontend en Vercel.

## 1. Base de datos MySQL
1. Crea una base de datos en Aiven y conecta DBeaver usando los datos que Aiven te da y SSL activado.
2. Abre `database.sql` en DBeaver y ejecútalo en la base `defaultdb`.
3. Guarda las credenciales de la base para el paso del backend. **No publiques tu contraseña en GitHub.**

## 2. Probar backend en tu computadora
Abre una terminal dentro de `backend` y ejecuta:

```bash
npm install
```

Copia `.env.example` como `.env` y completa los datos reales de tu MySQL. Para MySQL local, deja `DB_SSL=false`; para Aiven, usa `DB_SSL=true`.

```bash
npm run dev
```

Al abrir `http://localhost:3000` debe aparecer un mensaje de que la API está funcionando. `http://localhost:3000/productos` devuelve los productos en JSON.

## 3. Probar frontend en tu computadora
Abre otra terminal dentro de `frontend`:

```bash
npm install
npm run dev
```

Abre la dirección local que Vite muestra en la terminal, normalmente `http://localhost:5173`.

El frontend usa `http://localhost:3000` por defecto. Para producción, configúralo con `VITE_API_URL`.

## 4. Subir los archivos a GitHub
Crea un repositorio, por ejemplo `han-quokka-shop`, y sube el contenido de esta carpeta. No subas el archivo `.env`; está incluido en `.gitignore`.

## 5. Publicar el backend en Render
1. En Render, crea un **Web Service** y conecta el repositorio de GitHub.
2. Configura **Root Directory** como `backend`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. En Environment Variables agrega:
   - `DB_HOST` = host de Aiven
   - `DB_USER` = usuario de Aiven
   - `DB_PASSWORD` = contraseña de Aiven
   - `DB_NAME` = nombre de base de datos (por ejemplo `defaultdb`)
   - `DB_PORT` = puerto de Aiven
   - `DB_SSL` = `true`
6. Publica el servicio y copia la URL que te dé Render, como `https://tu-api.onrender.com`.

## 6. Publicar el frontend en Vercel
1. En Vercel importa el mismo repositorio de GitHub.
2. Configura **Root Directory** como `frontend`.
3. En Environment Variables agrega `VITE_API_URL` con la URL completa de Render, sin una ruta al final. Ejemplo: `https://tu-api.onrender.com`.
4. Presiona Deploy. La URL que entregue Vercel es la que puedes compartir como proyecto final.

## 7. Si aparece un error
- `CORS`: verifica que el backend tenga `app.use(cors())` y que Render esté funcionando.
- `404`: revisa que la ruta de la API esté escrita como `/productos`.
- `500` o error de base: revisa los logs de Render y las variables `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT` y `DB_SSL`.
- Página sin datos: confirma que la variable `VITE_API_URL` en Vercel tenga la URL de Render y vuelve a publicar el frontend después de cambiarla.

**Importante:** yo puedo preparar el código y la guía, pero no puedo crear tu URL de Vercel/Render sin que tú entres a tus cuentas y hagas la publicación. Haz una prueba final abriendo la URL pública y usando Agregar, Editar y Eliminar.
