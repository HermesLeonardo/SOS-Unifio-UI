import { apiFetch } from "./api";

export const locationService = {
  getAll: async () => {
    return apiFetch("ocorrencias/locais", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};

