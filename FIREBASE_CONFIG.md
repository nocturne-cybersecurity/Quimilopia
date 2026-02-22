# 🔐 Configurar Firebase + Google Sign-In

## Paso 1: Crear proyecto en Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Haz click en **"Crear proyecto"** o **"Add project"**
3. Nombre: `quimilopia-db` (o el que prefieras)
4. Desactiva Google Analytics (opcional)
5. Click en **"Create project"**

## Paso 2: Habilitar Autenticación

### 2.1 - Habilitar Google Authentication

1. En la consola, ve a **Authentication** (en el menú izquierdo)
2. Click en **"Get started"**
3. Busca **Google** en los proveedores
4. Click en **Google** → habilítalo
5. Ingresa:
   - **Project name**: Quimilopia
   - **Project support email**: tu-email@gmail.com
6. Click en **"Save"**

### 2.2 - Habilitar Email/Contraseña (NUEVO ⭐)

1. En **Authentication** (menú izquierdo)
2. Ve a la pestaña **"Sign-in method"**
3. Busca **Email/Password**
4. Click en **Email/Password** → habilítalo
5. Activa **"Email/Password"** pero NO "Email link (passwordless)"
6. Click en **"Save"**

## Paso 3: Obtener credenciales de Firebase

1. Ve a **Project Settings** (engranaje en la esquina superior)
2. Ve a la pestaña **"General"**
3. Desplázate hacia abajo hasta **"Your apps"**
4. Si no hay apps, click en **"</>Web"**
5. Ingresa un nombre: `quimilopia-web`
6. Click en **"Register app"**
7. **COPIA las credenciales** que aparecen:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "...",
  appId: "1:...:web:..."
};
```

## Paso 4: Reemplazar credenciales en login.html

1. Abre `login.html` en tu editor
2. Busca la sección `// ─── CONFIGURACIÓN DE FIREBASE ───`
3. Reemplaza `firebaseConfig` con tus credenciales reales
4. **Guarda el archivo**

## Paso 5: Crear base de datos Firestore

1. En Firebase Console, ve a **Firestore Database**
2. Click en **"Create database"**
3. Selecciona **"Start in test mode"** (para desarrollo)
4. Región: elige la más cercana
5. Click en **"Create"**

## Paso 6: Configurar reglas de seguridad (IMPORTANTE)

En Firestore → Rules, reemplaza con esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

Click en **"Publish"**

## Paso 6.5: Configurar Políticas de Contraseña (Opcional)

En **Authentication** → **Passwords**:
- **Minimum password length**: 6 (por defecto)
- Puedes cambiar esto si quieres requerir contraseñas más fuertes

El login de Quimilopia ya valida que tenga al menos 6 caracteres.

## Paso 7: Desplegar en Netlify

1. Sube tu proyecto a GitHub (o crea un repositorio)
2. Ve a [Netlify](https://app.netlify.com/)
3. Conecta tu repositorio
4. Click en **"Deploy"**
5. Tu sitio estará en `https://tu-sitio.netlify.app`

## Paso 8: Autorizar Google Sign-In en Netlify

1. En Firebase Console → Authentication → Google
2. En **"Authorized domains"** agrega:
   - `localhost:3000`
   - `tu-sitio.netlify.app`
3. Click en **"Save"**

## ✅ ¡Listo!

Ahora los usuarios pueden:
- Hacer login con Google
- Sus datos se guardarán en Firestore
- Acceder a Quimilopia

---

## 🔒 Seguridad

⚠️ **IMPORTANTE**: Las credenciales de Firebase en login.html son visibles públicamente (es normal). Firebase controla el acceso con:
- Authentication (solo usuarios autenticados)
- Firestore Rules (cada usuario solo ve sus datos)

No pongas secrets sensibles aquí, pero las API keys públicas de Firebase están diseñadas para esto.

---

## Troubleshooting

**Error: "Firebase is not defined"**
- Verifica que los scripts de Firebase se carguen correctamente

**Error: "auth/configuration-not-found"**
- Verifica que las credenciales sean exactas (sin espacios extra)

**Error: "auth/operation-not-supported-in-this-environment"** en localhost
- Es normal, Firebase requiere HTTPS o localhost:3000
- En Netlify funcionará sin problemas

**CORS Error**
- Asegúrate de haber agregado tu dominio a "Authorized domains" en Firebase

**Error: "auth/email-already-in-use"** (Sign up)
- El email ya está registrado, intenta con otro o inicia sesión

**Error: "auth/user-not-found"** (Sign in)
- No hay una cuenta con ese email, crea una nueva

**Error: "auth/wrong-password"** (Sign in)
- La contraseña es incorrecta

**Error: "auth/weak-password"** (Sign up)
- La contraseña debe tener al menos 6 caracteres

⚠️ **IMPORTANTE**: Luego de habilitar Email/Password en Firebase, no olvides que AMBAS opciones están disponibles en el login de Quimilopia
