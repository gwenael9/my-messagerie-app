import { Conversation } from "@/types/conversation";
import apiClient from "./apiClient";

/**
 *
 * @param conversationId L'ID de la conversation
 * @returns La conversation
 */
export const getOneConversation = async (conversationId: number) => {
  try {
    const response = await apiClient.get(`/conversations/${conversationId}`);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération de la conversation", error);
  }
};

/**
 * @param otherUserId L'ID de l'user au quel on veux créer/récupérer la conversation
 * @return La conversation entre l'utilisateur connecté et les autres utilisateurs
 */
export const getConversationWithOtherUserId = async (
  otherUserId: number
): Promise<Conversation | null> => {
  try {
    const response = await apiClient.get(`/conversations/user/${otherUserId}`);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'ID de la conversation",
      error
    );
    return null;
  }
};
