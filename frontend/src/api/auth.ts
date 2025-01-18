import { User } from "@/types/user";
import apiClient from "./apiClient";

export const register = async (
  email: string,
  firstname: string,
  lastname: string,
  password: string
) => {
  try {
    const response = await apiClient.post("/auth/register", {
      firstname,
      lastname,
      email,
      password,
    });
    return response.data.message;
  } catch (error) {
    console.error("Erreur lors de la création du compte", error);
  }
};

export const login = async (email: string, password: string): Promise<string | void> => {
  try {
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });
    return response.data.message;
  } catch (error) {
    console.error("Erreur lors de la connexion", error);
  }
};

export const me = async (): Promise<User | undefined> => {
  try {
    const response = await apiClient.get("/auth/me");
    return response.data as User;
  } catch (error) {
    console.error("Erreur lors de la récupération de l'user", error);
  }
};

export const logout = async () => {
  try {
    const response = await apiClient.post("/auth/logout");
    return response.data.message;
  } catch (error) {
    console.error("Erreur lors de la déconnexion", error);
  }
};
