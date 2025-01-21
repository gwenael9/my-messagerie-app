import { getNbMessagesNotRead } from "@/api/message";
import { create } from "zustand";

interface MessageState {
  nbMessages: number;
  fetchNbMessagesNoRead: () => Promise<void>;
  loading: boolean;
}

const useMessageStore = create<MessageState>((set) => ({
  nbMessages: 0,
  loading: false,

  fetchNbMessagesNoRead: async () => {
    set({ loading: true });
    try {
      const data = await getNbMessagesNotRead();
      set({ nbMessages: data.number });
    } catch (err) {
      console.error(
        "Erreur lors de la récupération du nombres de messages",
        err
      );
    } finally {
      set({ loading: false });
    }
  },
}));

export default useMessageStore;
