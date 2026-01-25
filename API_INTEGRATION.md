# Integración con API - Formulario de Registro

## 📋 Configuración

### Variables de Entorno

El proyecto utiliza variables de entorno para configurar la URL del servicio backend.

**Archivo: `.env`**

```bash
PUBLIC_API_URL=http://localhost:3000/api
```

**Archivo: `.env.example`** (para documentación)

```bash
# URL del servicio backend para el registro de usuarios
PUBLIC_API_URL=http://localhost:3000/api
```

### Cambiar la URL del API

1. Copia `.env.example` a `.env` si no existe
2. Modifica `PUBLIC_API_URL` con la URL de tu backend
3. Reinicia el servidor de desarrollo

```bash
# Desarrollo local
PUBLIC_API_URL=http://localhost:3000/api

# Producción
PUBLIC_API_URL=https://api.tudominio.com/api

# Staging
PUBLIC_API_URL=https://staging-api.tudominio.com/api
```

## 🔌 Endpoints de la API

### 1. Registro de Usuario

**Endpoint:** `POST /api/register`

**Request Body:**

```json
{
  "firstName": "Juan",
  "lastName": "Pérez",
  "email": "juan.perez@empresa.com",
  "phone": "+51 999 999 999",
  "businessName": "Mi Empresa S.A.C.",
  "isFormal": "yes",
  "ruc": "20123456789"
}
```

**Response (Éxito):**

```json
{
  "success": true,
  "data": {
    "id": "user_123456",
    "email": "juan.perez@empresa.com",
    "message": "Usuario registrado exitosamente"
  },
  "message": "Usuario registrado exitosamente"
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "El email ya está registrado"
}
```

### 2. Verificar Disponibilidad de Email (Opcional)

**Endpoint:** `GET /api/check-email?email={email}`

**Response:**

```json
{
  "available": true
}
```

### 3. Validar RUC (Opcional)

**Endpoint:** `GET /api/validate-ruc/{ruc}`

**Response:**

```json
{
  "ruc": "20123456789",
  "razonSocial": "MI EMPRESA S.A.C.",
  "estado": "ACTIVO"
}
```

## 🎨 Estados de la UI

### Estado de Carga

Cuando el formulario se está enviando:

- El botón muestra "Creando cuenta..."
- Se muestra un spinner de carga
- El botón se deshabilita para evitar múltiples envíos

### Mensajes de Alerta

#### Éxito ✅

```
Fondo verde claro con borde verde
Icono: check_circle
Auto-cierre después de 5 segundos
```

#### Error ❌

```
Fondo rojo claro con borde rojo
Icono: error
Se mantiene visible hasta que el usuario lo cierre
```

#### Info ℹ️

```
Fondo azul claro con borde azul
Icono: info
```

## 🔧 Servicio API (`src/services/api.ts`)

### Funciones Disponibles

#### `registerUser(formData)`

Registra un nuevo usuario en el sistema.

```typescript
import { registerUser } from "../services/api";

const response = await registerUser({
  firstName: "Juan",
  lastName: "Pérez",
  email: "juan@empresa.com",
  phone: "+51 999999999",
  businessName: "Mi Empresa",
  isFormal: "yes",
  ruc: "20123456789",
});

if (response.success) {
  console.log("Usuario creado:", response.data);
} else {
  console.error("Error:", response.error);
}
```

#### `checkEmailAvailability(email)`

Verifica si un email está disponible.

```typescript
import { checkEmailAvailability } from "../services/api";

const isAvailable = await checkEmailAvailability("juan@empresa.com");
if (isAvailable) {
  console.log("Email disponible");
} else {
  console.log("Email ya registrado");
}
```

#### `validateRUC(ruc)`

Valida un RUC contra la API de SUNAT.

```typescript
import { validateRUC } from "../services/api";

const response = await validateRUC("20123456789");
if (response.success) {
  console.log("RUC válido:", response.data);
} else {
  console.error("RUC inválido:", response.error);
}
```

## 🚀 Flujo de Registro

1. **Usuario completa el formulario**
2. **Validación del lado del cliente** (Zod)
   - Si hay errores → Mostrar mensajes de error
   - Si es válido → Continuar
3. **Mostrar estado de carga**
   - Botón deshabilitado
   - Texto: "Creando cuenta..."
   - Spinner visible
4. **Enviar datos a la API**
   - POST a `/api/register`
5. **Procesar respuesta**
   - **Éxito:**
     - Mostrar alerta verde
     - Resetear formulario
     - Redirigir a `/dashboard` después de 2 segundos
   - **Error:**
     - Mostrar alerta roja con el mensaje de error
     - Mantener los datos del formulario
6. **Ocultar estado de carga**

## 🔒 Seguridad

### Validación en el Cliente

- Todos los campos se validan con Zod antes de enviar
- Prevención de inyección de código
- Validación de formatos (email, teléfono, RUC)

### Validación en el Servidor

**IMPORTANTE:** El backend DEBE validar todos los datos nuevamente:

- No confiar en la validación del cliente
- Validar tipos de datos
- Sanitizar inputs
- Verificar unicidad de email
- Validar RUC con SUNAT (si aplica)

## 🐛 Manejo de Errores

### Errores de Validación

```javascript
// Se muestran debajo de cada campo
// Borde rojo en el input
// Scroll automático al primer error
```

### Errores de Red

```javascript
// Alerta roja con mensaje genérico
// Log en consola para debugging
// Usuario puede reintentar
```

### Errores del Servidor

```javascript
// Alerta roja con mensaje específico del servidor
// Ejemplo: "El email ya está registrado"
```

## 📝 Ejemplo de Implementación Backend (Node.js/Express)

```javascript
// routes/api.js
const express = require("express");
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, businessName, isFormal, ruc } =
      req.body;

    // 1. Validar datos (usar Zod también en el backend)
    // 2. Verificar si el email ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "El email ya está registrado",
      });
    }

    // 3. Crear usuario
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      businessName,
      isFormal: isFormal === "yes",
      ruc: isFormal === "yes" ? ruc : null,
    });

    // 4. Enviar email de bienvenida (opcional)
    // await sendWelcomeEmail(user.email);

    // 5. Responder con éxito
    res.status(201).json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        message: "Usuario registrado exitosamente",
      },
      message: "Usuario registrado exitosamente",
    });
  } catch (error) {
    console.error("Error en registro:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
    });
  }
});

module.exports = router;
```

## 🎯 Personalización

### Cambiar la URL de Redirección

En `register.astro`, línea ~556:

```javascript
setTimeout(() => {
  window.location.href = "/dashboard"; // Cambiar aquí
}, 2000);
```

### Cambiar el Tiempo de Redirección

```javascript
setTimeout(() => {
  window.location.href = "/dashboard";
}, 3000); // 3 segundos en lugar de 2
```

### Deshabilitar Auto-redirección

```javascript
// Comentar o eliminar el setTimeout
// setTimeout(() => {
//   window.location.href = "/dashboard";
// }, 2000);
```

## 📊 Logs y Debugging

### Logs en Consola

**Éxito:**

```
✅ Usuario registrado: { id: "...", email: "...", ... }
```

**Error de API:**

```
❌ Error de API: "El email ya está registrado"
```

**Error Inesperado:**

```
❌ Error inesperado: Error { ... }
```

### Verificar Peticiones de Red

1. Abre DevTools (F12)
2. Ve a la pestaña "Network"
3. Envía el formulario
4. Busca la petición a `/api/register`
5. Revisa Request/Response

## 🔄 Próximos Pasos

1. **Implementar el backend** con los endpoints necesarios
2. **Configurar CORS** en el servidor
3. **Agregar autenticación** (JWT, sesiones, etc.)
4. **Implementar email de verificación**
5. **Agregar validación de RUC con SUNAT**
6. **Configurar rate limiting** para prevenir spam
7. **Agregar Google reCAPTCHA** para seguridad

## 🆘 Troubleshooting

### Error: "Failed to fetch"

- Verifica que el backend esté corriendo
- Verifica la URL en `.env`
- Verifica configuración de CORS

### Error: "Network request failed"

- Verifica tu conexión a internet
- Verifica que el servidor esté accesible
- Revisa la consola del navegador

### El formulario no se envía

- Abre la consola del navegador
- Busca errores de JavaScript
- Verifica que Zod esté instalado
