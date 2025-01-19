import apiClient from "./apiClient";

export const sendMessage = async (recipientId: number, content: string) => {
  try {
    const response = await apiClient.post(`/messages/send/${recipientId}`, {
      content,
    });
    return response.data;
  } catch (error) {
    console.error("Erreur lors de l'envoie du message", error);
  }
};
