# Sistema de Validación del Formulario de Registro

Este documento explica el sistema de validación implementado en el formulario de registro usando **Zod** y **JavaScript**.

## 📋 Características

### ✅ Validaciones Implementadas

#### 1. **Nombres y Apellidos**

- Mínimo 2 caracteres
- Máximo 50 caracteres
- Solo letras (incluyendo acentos y ñ)
- Validación en tiempo real al salir del campo (blur)

#### 2. **Email**

- Campo obligatorio
- Formato de email válido
- Validación automática de formato

#### 3. **Teléfono**

- Campo opcional
- Formato: 9-15 caracteres
- Acepta: números, espacios, guiones, paréntesis
- Puede incluir código de país (+)

#### 4. **Nombre del Negocio**

- Mínimo 3 caracteres
- Máximo 100 caracteres
- Campo obligatorio

#### 5. **RUC (Registro Único de Contribuyentes)**

- Exactamente 11 dígitos numéricos
- **Obligatorio** solo si el negocio es formal
- Se oculta automáticamente si el negocio no es formal
- Validación condicional basada en el tipo de negocio

## 🎯 Tipos de Validación

### 1. **Validación en Tiempo Real (Blur)**

Cuando el usuario sale de un campo, se valida automáticamente:

```javascript
input.addEventListener("blur", () => {
  validateField(id, value);
});
```

### 2. **Limpieza de Errores (Input)**

Los errores se limpian mientras el usuario escribe:

```javascript
input.addEventListener("input", () => {
  clearError(id);
});
```

### 3. **Validación al Enviar**

Al enviar el formulario, se validan todos los campos:

- Si hay errores, se muestran todos
- Se hace scroll al primer campo con error
- Se enfoca automáticamente el campo con error

## 🔧 Esquema de Validación Zod

```typescript
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .max(50, "El nombre no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        "El nombre solo puede contener letras",
      ),

    lastName: z
      .string()
      .min(2, "El apellido debe tener al menos 2 caracteres")
      .max(50, "El apellido no puede exceder 50 caracteres")
      .regex(
        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
        "El apellido solo puede contener letras",
      ),

    email: z
      .string()
      .min(1, "El email es obligatorio")
      .email("Ingresa un correo electrónico válido"),

    phone: z
      .string()
      .regex(/^\+?[0-9\s\-()]{9,15}$/, "Ingresa un número de teléfono válido")
      .optional()
      .or(z.literal("")),

    businessName: z
      .string()
      .min(3, "El nombre del negocio debe tener al menos 3 caracteres")
      .max(100, "El nombre del negocio no puede exceder 100 caracteres"),

    isFormal: z.enum(["yes", "no"]),

    ruc: z
      .string()
      .regex(/^[0-9]{11}$/, "El RUC debe tener exactamente 11 dígitos")
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (data) => {
      // Validación condicional: RUC obligatorio si es formal
      if (data.isFormal === "yes") {
        return data.ruc && data.ruc.length === 11;
      }
      return true;
    },
    {
      message: "El RUC es obligatorio para negocios formales",
      path: ["ruc"],
    },
  );
```

## 🎨 Estilos de Error

### Estados Visuales

**Campo Normal:**

```css
border-[#d1dee6] focus:border-[#2e9cdc] focus:ring-[#2e9cdc]
```

**Campo con Error:**

```css
border-red-500 focus:border-red-500 focus:ring-red-500
```

**Mensaje de Error:**

```html
<span class="error-message text-red-500 text-xs mt-1">
  Mensaje de error aquí
</span>
```

## 📝 Funciones Principales

### `showError(fieldName, message)`

Muestra un error en un campo específico:

- Cambia el borde a rojo
- Muestra el mensaje de error
- Actualiza las clases CSS

### `clearError(fieldName)`

Limpia el error de un campo:

- Restaura el borde normal
- Oculta el mensaje de error
- Restaura las clases CSS originales

### `clearAllErrors()`

Limpia todos los errores del formulario

### `validateField(fieldName, value)`

Valida un campo individual usando el esquema Zod

## 🚀 Flujo de Validación

1. **Usuario completa un campo** → Sale del campo (blur)
2. **Se ejecuta validación** → `validateField()`
3. **Si hay error** → Se muestra con `showError()`
4. **Usuario escribe** → Error se limpia automáticamente
5. **Usuario envía formulario** → Validación completa
6. **Si todo es válido** → Muestra alerta de éxito
7. **Si hay errores** → Muestra todos y hace scroll al primero

## 🔍 Ejemplo de Uso

```javascript
// Datos del formulario después de validación exitosa
{
  firstName: "Juan",
  lastName: "Pérez",
  email: "juan.perez@empresa.com",
  phone: "+51 999 999 999",
  businessName: "Mi Empresa S.A.C.",
  isFormal: "yes",
  ruc: "20123456789"
}
```

## 📦 Dependencias

- **Zod**: Librería de validación de esquemas TypeScript-first
  ```bash
  npm install zod
  ```

## 🎯 Próximos Pasos

Para integrar con un backend:

1. Reemplazar el `alert()` en el evento submit
2. Hacer una petición POST al servidor
3. Manejar respuestas del servidor
4. Mostrar mensajes de éxito/error del servidor

```javascript
// Ejemplo de integración con API
const response = await fetch("/api/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(validatedData),
});

if (response.ok) {
  // Redirigir o mostrar mensaje de éxito
} else {
  // Manejar errores del servidor
}
```

## 🐛 Debugging

Para ver los datos validados en la consola:

```javascript
console.log("✅ Formulario válido:", validatedData);
```

Los errores de validación también se muestran en la consola del navegador.
