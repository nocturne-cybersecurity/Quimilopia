# Quimilopia — Atomic Simulator v3.4 🧬

Un simulador molecular **interactivo** y **educativo** que permite a estudiantes de química y biología explorar, crear y manipular moléculas a nivel atómico. Perfecto para aprender sobre enlaces químicos, reacciones y estructura celular.

## 🎯 Características Principales

- ✅ **Tabla Periódica Interactiva** - 50+ elementos químicos con propiedades reales
- ✅ **Constructor de Moléculas** - Crea moléculas arrastrando átomos al canvas
- ✅ **Vinculación Manual** - Conecta átomos con el modo de enlace manual
- ✅ **Recetas Personalizadas** - Crea y guarda tus propias moléculas
- ✅ **Tres Niveles de Visualización**:
  - 🔬 **Átomos** - Vista atómica detallada
  - 🧪 **Moléculas** - Agrupaciones moleculares
  - 🫀 **Células** - Sistemas biológicos complejos
- ✅ **Agrupación en Células** - Forma células biológicas a partir de moléculas
- ✅ **Animación de Reacciones** - Visualiza reacciones químicas en tiempo real
- ✅ **Sistema de Autenticación** - Login con Google y Email/Firebase
- ✅ **Captura de Pantalla** - Descarga tus simulaciones
- ✅ **Interfaz Responsiva** - Diseño moderno y profesional

## 🚀 Inicio Rápido

### 1. Clonar el Repositorio

```bash
git clone https://github.com/nocturne-cybersecurity/Quimilopia.git
cd quimilopia
```
---

## 📖 Guía de Uso

### Interfaz Principal

```
┌─────────────────────────────────────────┐
│ 🔬 Átomos │ 🧪 Moléculas │ 🫀 Células  │  ← Tabs de visualización
├──────────┬─────────────────────┬────────┤
│  Panel   │    CANVAS           │ Panel  │
│ Izquierdo│   (Simulación)      │Derecho │
│          │                     │        │
├──────────┴─────────────────────┴────────┤
```

### Paso 1: Seleccionar Átomos

En el panel **izquierdo**, busca elementos en la tabla periódica:
- Filtra por nombre o símbolo
- Categorías por tipo (Alcalino, No Metal, etc.)
- Arrastra átomos al canvas

### Paso 2: Crear Moléculas

**Opción A - Modo Automático "Auto-Reacción"**
```
Clic en "Auto-Reacción" en la barra superior
La simulación crea moléculas automáticamente
```

**Opción B - Vinculación Manual**
```
1. Clic en "Vincular Manual"
2. Clic en Átomo A
3. Clic en Átomo B
→ Se crea un enlace entre ellos
```

**Opción C - Usar Recetas**
```
1. Panel izquierdo → "📋 Recetas"
2. Selecciona una receta (H₂O, CO₂, etc.)
3. Clic en "✓" para crear la molécula
```

### Paso 3: Personalizar Recetas

En **Recetas** → "+ Añadir receta personalizada":

```
Nombre: H_2O (usa _ para subíndice, ^ para superíndice)
Selecciona átomos: H, H, O
Descripción: Agua
Función biológica: Solvente universal
Categoría: Inorgánica
Color: [Selector de color]

Clic en "✓ Agregar Receta"
```

### Paso 4: Formar Células

Agrupa moléculas en células usando las combinaciones recomendadas:

| Fórmula | Tipo | Color |
|---------|------|-------|
| H₂O + CO₂ | Vegetal | 🟢 Verde |
| NH₃ + H₂O | Sanguínea | 🔴 Rojo |
| CO₂ + NH₃ | Nerviosa | 🔵 Azul |
| H₂O + C₆H₁₂O₆ | Muscular | 🟣 Púrpura |
| ATP + ADP | Energética | 🟠 Naranja |
| 3+ cualquiera | Genérica | Mixto |

```
Clic en "⬡ Formar Célula" después de seleccionar moléculas
```

### Controles Adicionales

| Botón | Función |
|-------|---------|
| ▶ Animar | Inicia animación de reacciones |
| ■ Detener | Pausa la simulación |
| 🗑 Limpiar | Elimina todos los átomos |
| ↺ Reiniciar | Reinicia la simulación completa |
| Captura | Descarga una captura PNG del canvas |
| Seleccionar | Ativa modo de selección múltiple (Shift+Click) |

---

## 🏗️ Estructura del Proyecto

```
quimilopia/
├── index.html              # Página principal de la simulación
├── login.html              # Pantalla de autenticación
├── flask.py                # Servidor backend (Python)
├── netlify.toml            # Configuración de Netlify
├── README.md               # Este archivo
│
├── static/
│   ├── script.js           # Lógica principal de simulación
│   ├── style.css           # Estilos generales
│   └── colors.css          # Variables CSS de color
│
├── script/
│   ├── script.py           # Scripts de utilidad
│   └── capture.py          # Captura de pantallas
│
├── images/                 # Recursos gráficos
├── github/                 # Archivos de GitHub Actions
├── netlify/                # Funciones de Netlify
│
├── FIREBASE_CONFIG.md      # Instrucciones Firebase
├── FIREBASE_CREDENTIALS.md # Credenciales (NO comitear)
├── DEPLOY_NETLIFY.md       # Guía de despliegue
└── NETLIFY_SETUP.md        # Setup de Netlify
```

---

## 🔐 Configuración de Firebase

### Crear Autenticación

1. **Firebase Console** → Tu Proyecto → **Authentication**
2. Habilita proveedores:
   - ✅ Google Sign-In
   - ✅ Email/Password
3. Añade dominios autorizados

### Configurar Firestore

1. **Firestore Database** → Crear BD
2. Modo de prueba: `Start in test mode`
3. Estructura de datos:

```firestore
users/
├── {userId}/
│   ├── name: string
│   ├── email: string
│   ├── createdAt: timestamp
│   └── recipes: array
│
recipes/
├── {recipeId}/
│   ├── name: string
│   ├── atoms: array
│   ├── description: string
│   ├── userId: string
│   └── createdAt: timestamp

simulations/
├── {simId}/
│   ├── userId: string
│   ├── atoms: array
│   ├── molecules: array
│   ├── cells: array
│   └── timestamp: timestamp
```

### Reglas de Seguridad Firestore

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer/escribir su propio documento
    match /users/{userId} {
      allow read, write: if request.auth.uid == userId;
    }
    
    // Recetas: públicas para leer, privadas para escribir
    match /recipes/{recipeId} {
      allow read: if true;
      allow create, update, delete: if request.auth.uid == resource.data.userId;
    }
    
    // Simulaciones privadas
    match /simulations/{simId} {
      allow read, write: if request.auth.uid == resource.data.userId;
    }
  }
}
```
---

## 💻 Desarrollo

### Agregar Nuevos Elementos

En [script.js](static/script.js), línea ~65, añade a la array `ELEMENTS`:

```javascript
{n:99, sym:'Xx', name:'Tuoxi', mass:299.01, bonds:3, cat:'NoMetal', r:16, color:'#ff0000'},
```

Propiedades:
- `n`: Número atómico
- `sym`: Símbolo
- `name`: Nombre en español
- `mass`: Masa atómica
- `bonds`: Valencia (máximo de enlaces)
- `cat`: Categoría (Alcalino, NoMetal, etc.)
- `r`: Radio en px
- `color`: Código hex

### Agregar Recetas Predefinidas

En [script.js](static/script.js), busca `RECIPES` y añade:

```javascript
{
  name: 'CH_4',
  atoms: ['C', 'H', 'H', 'H', 'H'],
  desc: 'Metano',
  func: 'Combustible',
  cat: 'Orgánica',
  color: '#78909c'
}
```

### Modificar la Física

La simulación está en [script.js](static/script.js):
- **Fuerzas de enlace**: ~línea 800
- **Repulsión electrostática**: ~línea 850
- **Fricción**: ~línea 900
- **Gravedad**: ~línea 950

---

## 🐛 Troubleshooting

### "Usuario no autenticado"

```javascript
// Verificar en la consola del navegador
sessionStorage.getItem('user')
```

### Canvas en blanco

```javascript
// Abre DevTools (F12) y busca errores
// Verifica que el canvas tenga tamaño
console.log(document.getElementById('simCanvas').width)
```

### Simulación lenta

- Reduce el número de átomos
- Desactiva animaciones complejas
- Usa modo de visualización "CÉLULAS" en lugar de "ÁTOMOS"

### Firebase dice "permiso denegado"

Verifica las reglas de seguridad en Firestore Console:
```javascript
// Temporalmente en pruebas, puedes usar:
allow read, write: if true;
```

## 🎓 Casos de Uso Educativo

### Química General
- Visualizar estructura atómica
- Entender enlaces covalentes
- Explorar molecularidad

### Biología
- Comprender moléculas biológicas (proteínas, lípidos, carbohidratos)
- Estudiar células y sus componentes
- Simulaciones de reacciones bioquímicas

### STEAM
- Integración de ciencia e interactividad
- Herramienta para laboratorios virtuales
- Proyectos de estudiantes

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama: `git checkout -b feature/mi-feature`
3. Commit tus cambios: `git commit -m "Add: descripción"`
4. Push: `git push origin feature/mi-feature`
5. Abre un Pull Request

### Áreas donde contribuir:
- Más elementos químicos
- Recetas predefinidas
- Optimización de physics
- Traduções a otros idiomas
- Mejoras en UI/UX
- Documentación

---

## 📝 Licencia

Este proyecto está bajo licencia **MIT**. Eres libre de usar, modificar y distribuir este código.

---

## 👨‍💻 Autor

Creado por **[Rodrigo (nocturne-cyberseucirty)]**

---

## 📧 Contacto & Soporte

- **Issues**: [GitHub Issues](https://github.com/nocturne-cybersecurity/quimilopia/issues)
- **Email**: rodrigolopezp11@email.com

---

## 🎉 Agradecimientos

- Tabla periódica basada en datos científicos reales
- Inspirado en simuladores educativos
- Comunidad STEAM por el feedback

---

## 📚 Referencias Útiles

- [Documentación Firebase](https://firebase.google.com/docs)
- [MDN - Canvas API](https://developer.mozilla.org/es/docs/Web/API/Canvas_API)
- [Tabla Periódica - NIST](https://www.nist.gov/)
- [Tipos de Enlaces Químicos](https://es.wikipedia.org/wiki/Enlace_qu%C3%ADmico)

---

**Última actualización**: Febrero 2026 | v3.4
