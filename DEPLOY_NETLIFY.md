# 🚀 Desplegar Quimilopia en Netlify

## Opción 1: Despliegue Automático (RECOMENDADO)

### Requisitos:
- Cuenta en GitHub
- Cuenta en Netlify

### Pasos:

1. **Crear repositorio en GitHub**
   - Ve a [github.com/new](https://github.com/new)
   - Nombre: `quimilopia`
   - Haz el repo público
   - Click en **"Create repository"**

2. **Subir tu proyecto a GitHub**
   ```bash
   # En la carpeta del proyecto
   git init
   git add .
   git commit -m "Initial commit: Quimilopia"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/quimilopia.git
   git push -u origin main
   ```

3. **Conectar con Netlify**
   - Ve a [netlify.com](https://app.netlify.com/)
   - Click en **"New site from Git"**
   - Selecciona **GitHub**
   - Busca `quimilopia`
   - Click en **"Deploy site"**

4. **Configurar variables de entorno**
   - En Netlify, ve a **Site settings** → **Build & deploy** → **Environment**
   - Click en **"Edit variables"**
   - Agrega tus credenciales de Firebase aquí (opcional, más seguro)

## Opción 2: Despliegue Manual

1. **Crear sitio en Netlify**
   - Ve a [netlify.com](https://app.netlify.com/)
   - Drag & drop tu carpeta `Biolopy` al área indicada

2. **Tu sitio estará en:** `https://tu-sitio.netlify.app`

## Configuración Posterior

### 1. Dominio personalizado (Opcional)
- En Netlify → **Domain settings**
- Click en **"Add custom domain"**
- Sigue las instrucciones

### 2. SSL/HTTPS (Automático)
- Netlify genera certificado SSL automáticamente
- No necesitas hacer nada 🎉

### 3. Actualizar Firebase
- En Firebase Console
- Authentication → Google
- **Authorized domains**: Agrega tu dominio de Netlify
  - Ejemplo: `https://quimilopia.netlify.app`

### 4. Actualizar login.html
Si cambiaste las credenciales, recuerda redeploy:
```bash
git add login.html
git commit -m "Update Firebase config"
git push
```

Netlify se redesplegará automáticamente 🚀

## 📋 Checklist Antes de Desplegar

- [ ] Configuraste Firebase correctamente
- [ ] Copiaste las credenciales en login.html
- [ ] Habilitaste Google Sign-In en Firebase
- [ ] Creaste Firestore Database
- [ ] Configuraste las reglas de seguridad en Firestore
- [ ] Subiste el proyecto a GitHub
- [ ] Conectaste GitHub con Netlify
- [ ] Agregaste tu dominio a "Authorized domains" en Firebase

## 🧪 Testear Localmente Antes de Desplegar

```bash
# Si quieres testear localmente, necesitas un servidor
# Opción 1: Con Python
python -m http.server 5000

# Opción 2: Con Node.js
npx http-server

# Opción 3: Con VS Code
# Instala "Live Server" extension y haz click en "Go Live"
```

Luego abre `http://localhost:5000` en el navegador

⚠️ **NOTA**: Firebase requiere HTTPS o localhost. En Netlify funcionará sin problemas.

## 🐛 Troubleshooting

**Error: "Cannot GET /login.html"**
- Asegúrate de que login.html está en la carpeta raíz

**Error: "Firebase is not defined"**
- Verifica que los scripts de Firebase se carguen (abre DevTools → Network)

**Error en Google Sign-In**
- Verifica que tu dominio esté en "Authorized domains" en Firebase

**Las recetas no se cargan**
- Revisa la consola del navegador (F12 → Console)
- Verifica que script.js está correctamente vinculado

## 🔒 Seguridad en Producción

Cuando despliegues a producción (no dev):

1. **En Firebase**
   - Cambia Firestore rules a modo "production"
   - Restringe quien puede escribir/leer datos

2. **En Netlify**
   - Activa "Force HTTPS" en Domain settings
   - Configura redirecciones si es necesario

## ✨ URLs Importantes

- Tu sitio: `https://tu-sitio.netlify.app`
- Firebase Console: https://console.firebase.google.com
- Netlify Dashboard: https://app.netlify.com
- GitHub Repo: `https://github.com/tu-usuario/quimilopia`

---

¡Listo para mostrar tu Quimilopia al mundo! 🎉
