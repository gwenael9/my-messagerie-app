import {
  getConversationWithOtherUserId,
  getInfosConversations,
  getOneConversation,
  readAllMessage,
} from "@/api/conversations";
import { sendMessage } from "@/api/message";
import { Conversation, ConversationSummary } from "@/types/conversation";
import { create } from "zustand";

interface ConversationState {
  conversation: Conversation | null;
  fetchOneConversation: (id: number) => Promise<void>;
  fetchIdOfOneConversation: (
    otherUserId: number
  ) => Promise<Conversation | null>;
  loading: boolean;
  sendMessageStore: (
    recipientId: number,
    content: string,
    idConversation: number
  ) => Promise<void>;
  conversationsSummary: ConversationSummary[];
  fetchConversationsSummary: () => Promise<void>;
  readMessages: (conversationId: number) => void;
}

const useConversationStore = create<ConversationState>((set, get) => ({
  conversation: null,
  loading: false,
  conversationsSummary: [],

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
      return await getConversationWithOtherUserId(otherUserId);
    } catch (error) {
      console.error("Erreur dans le Conversationstore", error);
      return null;
    }
  },

  fetchConversationsSummary: async () => {
    try {
      const conversations = await getInfosConversations();
      set({ conversationsSummary: conversations });
    } catch (error) {
      console.error("Erreur lors du fetchConversationSummary", error);
    }
  },

  readMessages: async (conversationId) => {
    try {
      await readAllMessage(conversationId);
    } catch (error) {
      console.error("Erreur dans readMessage", error);
    }
  },
}));

export default useConversationStore;
