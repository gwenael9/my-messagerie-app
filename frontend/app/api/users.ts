import apiClient from ".";

export const register = async (
  email: string,
  name: string,
  password: string
) => {
  try {
    const response = await apiClient.post("/auth/register", {
      name,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la création du compte", error);
  }
};

export const login = async (email: string, password: string) => {
  try {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
  }
};
