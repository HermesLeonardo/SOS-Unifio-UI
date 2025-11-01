import { apiFetch } from "./api";

export const occurrenceService = {
  abrirOcorrencia: async (
    locationId: number,
    peopleCount: number,
    occurrenceType: number,
    description: string,
    locationDescription: string
  ) => {
    return apiFetch("ocorrencias", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // 🔹 obrigatório
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        locationId,
        peopleCount,
        occurrenceType,
        description,
        locationDescription,
      }),
    });
  },

  getById: async (id: number) => {
    return apiFetch(`ocorrencias/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },


};
