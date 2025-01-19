import { getIdOfConversation, getOneConversation } from "@/api/conversations";
import { sendMessage } from "@/api/message";
import { Conversation } from "@/types/conversation";
import { create } from "zustand";

interface ConversationState {
  conversation: Conversation | null;
  fetchOneConversation: (id: number) => Promise<void>;
  fetchIdOfOneConversation: (otherUserId: number) => Promise<number>;
  loading: boolean;
  sendMessageStore: (
    recipientId: number,
    content: string,
    idConversation: number
  ) => Promise<void>;
}

const useConversationStore = create<ConversationState>((set, get) => ({
    conversation: null,
    loading: false,

  fetchOneConversation: async (id) => {
    set({ loading: true });
    try {
      const conversation = await getOneConversation(id);
      set({ conversation: conversation });
    } catch (err) {
      console.error("Erreur lors de la récupération de la conversation", err);
    } finally {
      set({ loading: false });
    }
  },

  sendMessageStore: async (recipientId, content) => {
    try {
      const newMessage = await sendMessage(recipientId, content);
      const currentConversation = get().conversation;
      if (currentConversation) {
        set({
          conversation: {
            ...currentConversation,
            messages: [...currentConversation.messages, newMessage],
          },
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'envoie du message", error);
    }
  },

  fetchIdOfOneConversation: async (otherUserId) => {
    try {
      return await getIdOfConversation(otherUserId);
    } catch (error) {
      console.error("Erreur dans le Conversationstore", error);
      return 0;
    }
  },
}));

export default useConversationStore;
