import { apiFetch } from "./api";

export const dashboardService = {
  async getOcorrenciasResumo() {
    try {
      const token = localStorage.getItem("token");
      const data = await apiFetch("ocorrencias/resumoDash", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response dashboard:", data);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Erro ao buscar resumo de ocorrências:", error);
      return [];
    }
  },
};
