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
 * @return L'ID de la conversation entre l'utilisateur connecté et les autres utilisateurs
 */
export const getIdOfConversation = async (
  otherUserId: number
): Promise<number> => {
  try {
    const response = await apiClient.get(`/conversations/user/${otherUserId}`);
    console.log("nuuuuuuumber", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de l'ID de la conversation",
      error
    );
    return 0;
  }
};
