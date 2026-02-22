# 🚀 Configurar Netlify Paso a Paso

## 📋 Requisitos

- Carpeta `Biolopy` con todos tus archivos
- Cuenta en GitHub (gratis)
- Cuenta en Netlify (gratis)
- 10 minutos ⏱️

---

## PASO 1: Crear Repositorio en GitHub

### 1.1 - Ir a GitHub

1. Abre [github.com/new](https://github.com/new)
2. Haz login si no lo hiciste (o crea cuenta si no tienes)

### 1.2 - Crear el repositorio

1. **Repository name**: `quimilopia`
2. **Description**: "Molecular Simulator - Quimilopia" (opcional)
3. **Public** (debe ser público para que Netlify lo vea)
4. ✅ Click en **"Create repository"**

### 1.3 - Copiar la URL

Te aparecerá algo como:
```
https://github.com/tu-usuario/quimilopia.git
```

**GUARDA esta URL**, la necesitaremos después.

---

## PASO 2: Subir tu código a GitHub

### 2.1 - Abrir PowerShell en tu carpeta

1. Abre la carpeta `Biolopy` en el Explorador
2. Click derecho → **"Open PowerShell window here"**

### 2.2 - Comandos para subir

Copia y pega CADA línea (una por una) en PowerShell:

```powershell
git init
```

```powershell
git config user.name "Tu Nombre"
git config user.email "tu@email.com"
```

```powershell
git add .
```

```powershell
git commit -m "Initial commit: Quimilopia molecular simulator"
```

```powershell
git branch -M main
```

```powershell
git remote add origin https://github.com/tu-usuario/quimilopia.git
```

(Reemplaza `tu-usuario` con tu usuario de GitHub)

```powershell
git push -u origin main
```

Te pedirá que te autentiques. Si te aparece una ventana, autoriza.

### 2.3 - Verificar

Ve a `https://github.com/tu-usuario/quimilopia` en el navegador. Deberías ver todos tus archivos subidos ✅

---

## PASO 3: Conectar Netlify con GitHub

### 3.1 - Ir a Netlify

1. Abre [app.netlify.com](https://app.netlify.com/)
2. Haz login (o crea cuenta gratis con GitHub)

### 3.2 - Crear nuevo sitio

1. Click en **"Add new site"** → **"Import an existing project"**
2. Selecciona **GitHub** como proveedor
3. Autoriza a Netlify a acceder a tu GitHub (aparecerá ventana)

### 3.3 - Buscar tu repositorio

1. Busca `quimilopia`
2. Click sobre él

### 3.4 - Configurar build

En la pantalla de configuración:

- **Branch to deploy**: `main`
- **Build command**: (dejar vacío - no necesitas build)
- **Publish directory**: (dejar vacío o poner `.`)
- Click en **"Deploy site"**

### 3.5 - Esperar el despliegue

Espera a que termine (unos 30 segundos - 1 minuto). Verás un checkmark verde ✅

---

## PASO 4: Obtener tu URL

Netlify te habrá generado una URL como:

```
https://quimilopia-xyz.netlify.app
```

**GUARDA esta URL**, la necesitarás para Firebase.

---

## PASO 5: Configurar dominio personalizado (Opcional)

Si quieres un dominio mejor que `quimilopia-xyz.netlify.app`:

### 5.1 - Cambiar nombre del sitio

1. En Netlify, ve a **Site settings**
2. Click en **"Change site name"**
3. Ingresa: `quimilopia` (o lo que quieras)
4. Guarda

Tu URL será: `https://quimilopia.netlify.app`

### 5.2 - Dominio propio (opcional)

Si tienes un dominio en GoDaddy, Namecheap, etc:

1. En Netlify → **Domain settings**
2. Click en **"Add custom domain"**
3. Ingresa tu dominio
4. Sigue las instrucciones para actualizar DNS

---

## PASO 6: Actualizar Firebase

Ahora que tienes tu URL en Netlify, debes decirle a Firebase:

### 6.1 - Ir a Firebase Console

1. Abre [console.firebase.google.com](https://console.firebase.google.com)
2. Selecciona tu proyecto `quimilopia-db`

### 6.2 - Autorizar el dominio

1. Ve a **Authentication** → **Sign-in method** → **Google**
2. En **"Authorized domains"**, agrega:
   - `localhost:3000` (para testear localmente)
   - `quimilopia.netlify.app` (tu dominio de Netlify)
   - O tu dominio personalizado si tienes uno
3. Click en **"Save"**

---

## PASO 7: Actualizar Login.html (si es necesario)

Si ya copiaste tus credenciales de Firebase en `login.html`, no necesitas hacer nada más.

Si NO lo hiciste todavía, hazlo ahora:

1. Abre `login.html` en VS Code
2. Busca `firebaseConfig`
3. Reemplaza con tus credenciales reales (obtén de Firebase Console → Project Settings)

Luego:
```powershell
git add login.html
git commit -m "Update Firebase credentials"
git push
```

Netlify se redesplegará automáticamente.

---

## PASO 8: Probar tu app

1. Abre tu URL de Netlify en el navegador
2. Deberías ver la pantalla de login
3. Haz click en "Email" para probar signup
4. O usa Google Sign-In

✅ **¡Listo! Quimilopia está en internet**

---

## 🔄 Hacer cambios después

Cada vez que hagas cambios:

```powershell
cd C:\Users\rodri\OneDrive\Documentos\Biolopy

git add .
git commit -m "Descripción del cambio"
git push
```

Netlify automáticamente redesplegará en 30 segundos.

---

## ⚡ Quick Reference

| Comando | Qué hace |
|---------|----------|
| `git add .` | Prepara cambios |
| `git commit -m "mensaje"` | Guarda cambios |
| `git push` | Sube a GitHub → Netlify redeploy |
| `git status` | Ver archivos modificados |

---

## 🐛 Troubleshooting

**"Error: GitHub no se autentica"**
- Instala Git desde [git-scm.com](https://git-scm.com/download/win)
- Reinicia PowerShell después

**"No veo mi sitio después de 5 minutos"**
- Ve a Netlify → Deploys
- Busca logs de error
- Usualmente es por credenciales de Firebase incompletas

**"Google Sign-In no funciona"**
- Verifica que tu dominio esté en "Authorized domains" en Firebase
- Espera 5 minutos después de agregarlo

**"Solo veo página en blanco"**
- Abre DevTools (F12)
- Ve a Console
- Busca mensajes de error
- Probablemente es un problema con Firebase config

---

## ✅ Checklist Final

- [ ] Repositorio `quimilopia` creado en GitHub
- [ ] Código pusheado a GitHub
- [ ] Netlify conectado a GitHub
- [ ] Netlify mostrando ✅ "Deploy successful"
- [ ] URL de Netlify funciona
- [ ] Firebase credentials en login.html
- [ ] Dominio de Netlify agregado a Firebase "Authorized domains"
- [ ] Google Sign-In funciona
- [ ] Email Sign-Up funciona
- [ ] Usuarios se guardan en Firestore

---

## 📞 Resumen visual

```
Tu PC (Biolopy)
    ↓ git push
GitHub (repositorio)
    ↓ webhook automático
Netlify (deploy)
    ↓ sirve en HTTPS
Internet (tuapp.netlify.app)
    ↓ usuario abre en navegador
Firebase (autentica + Firestore)
```

---

**¡Felicitaciones! Quimilopia está en producción 🎉**
