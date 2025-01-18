import { User } from "@/types/user";
import apiClient from "./apiClient";

/**
 *
 * @returns Une liste d'utilisateurs public
 */
export const getPublicUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get("/users/public");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des profils public", error);
    return [];
  }
};
