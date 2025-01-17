import { User } from "@/types/user";
import apiClient from "./apiClient";

/**
 * @returns Une liste d'amis
 */
export const getFriends = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get("/users/friends");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des amis", error);
    return [];
  }
};
