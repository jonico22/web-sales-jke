// src/services/api.ts
import type { RegisterFormData } from "../schemas/registerSchema";

const API_URL = import.meta.env.PUBLIC_API_URL || "http://localhost:3000/api";

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  message: string;
}

/**
 * Registra un nuevo usuario en el sistema
 * @param formData - Datos del formulario validados con Zod
 * @returns Respuesta de la API con los datos del usuario creado
 */
export async function registerUser(
  formData: RegisterFormData
): Promise<ApiResponse<RegisterResponse>> {
  try {
    const formatResquest = {...formData}
    formatResquest['isBusiness'] = formData.isFormal === "yes" ? true : false;
    const response = await fetch(`${API_URL}/requests`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formatResquest),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || data.message || "Error al registrar el usuario",
      };
    }

    return {
      success: true,
      data: data,
      message: data.message || "Usuario registrado exitosamente",
    };
  } catch (error) {
    console.error("Error en registerUser:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error de conexión con el servidor",
    };
  }
}

/**
 * Verifica si un email ya está registrado
 * @param email - Email a verificar
 * @returns true si el email está disponible, false si ya existe
 */
export async function checkEmailAvailability(
  email: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `${API_URL}/check-email?email=${encodeURIComponent(email)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data.available === true;
  } catch (error) {
    console.error("Error al verificar email:", error);
    return true; // En caso de error, permitir continuar
  }
}

/**
 * Valida un RUC contra la API de SUNAT (Perú)
 * @param ruc - Número de RUC a validar
 * @returns Información del RUC si es válido
 */
export async function validateRUC(ruc: string): Promise<ApiResponse<{
  ruc: string;
  razonSocial: string;
  estado: string;
}>> {
  try {
    const response = await fetch(`${API_URL}/validate-ruc/${ruc}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.error || "RUC no válido",
      };
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error al validar RUC:", error);
    return {
      success: false,
      error: "Error al validar el RUC",
    };
  }
}
