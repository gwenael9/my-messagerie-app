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

/**
 *
 * @param userId L'ID de l'user que l'on souhaite ajouter
 * @returns Un message validant la demande d'ami
 */
export const addNewFriend = async (userId: number) => {
  try {
    const response = await apiClient.post(`/friend-requests/${userId}`);
    return response.data.message;
  } catch (error) {
    console.error("Erreur lors de la demande d'ami", error);
  }
};

/**
 * 
 * @returns Toutes les demandes d'amis que j'ai envoyés qui sont en attente
 */
export const getAllFriendRequest = async () => {
  try {
    const response = await apiClient.get("/friend-requests/byme");
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de mes demandes d'amis",
      error
    );
  }
};
