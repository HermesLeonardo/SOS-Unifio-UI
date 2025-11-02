// src/services/api.ts
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5000/";

// Função genérica
export async function apiFetch(path: string, options: RequestInit = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Erro na requisição");
  }

  return response.json();
}

// Função específica de login
export async function loginUser(matricula: string, senha: string) {
  return apiFetch("auth/login", {
    method: "POST",
    body: JSON.stringify({ matricula, senha }),
  });
}
