// src/schemas/registerSchema.ts
import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El nombre solo puede contener letras"),
  
  lastName: z
    .string()
    .min(2, "El apellido debe tener al menos 2 caracteres")
    .max(50, "El apellido no puede exceder 50 caracteres")
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, "El apellido solo puede contener letras"),
  
  email: z
    .string()
    .email("Ingresa un correo electrónico válido")
    .toLowerCase(),
  
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
  isBusiness: z.boolean().optional(),
  ruc: z
    .string()
    .regex(/^[0-9]{11}$/, "El RUC debe tener 11 dígitos")
    .optional()
    .or(z.literal("")),
}).refine((data) => {
  // Si es formal, el RUC es obligatorio
  if (data.isFormal === "yes") {
    return data.ruc && data.ruc.length === 11;
  }
  return true;
}, {
  message: "El RUC es obligatorio para negocios formales",
  path: ["ruc"],
});

export type RegisterFormData = z.infer<typeof registerSchema>;
