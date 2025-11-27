import { apiFetch } from "./api";

export const dashboardService = {
  async getDashboard() {
    try {
      const token = localStorage.getItem("token");
      const data = await apiFetch("dashboard", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Dashboard carregado:", data);
      return data;
    } catch (error) {
      console.error("Erro ao buscar dados do dashboard:", error);
      return null;
    }
  },

  async getHistorico() {
    try {
      const token = localStorage.getItem("token");
      const data = await apiFetch("dashboard/historico", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Histórico carregado:", data);
      return data;
    } catch (error) {
      console.error("Erro ao buscar histórico de ocorrências:", error);
      return [];
    }
  },
};
