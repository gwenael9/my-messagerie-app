import { create } from "zustand";
import { io, Socket } from "socket.io-client";
import { Message } from "@/types/message";

interface SocketState {
  socket: Socket | null;
  connectSocket: (userId: number) => void;
  disconnectSocket: () => void;
  onReceiveMessage: (callback: (data: { data: Message }) => void) => void;
}

const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,

  connectSocket: (userId: number) => {
    if (!userId || get().socket) return;

    const newSocket = io(process.env.NEXT_PUBLIC_API_SERVER!, {
      withCredentials: true,
      query: { userId },
    });

    set({ socket: newSocket });
  },

  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      set({ socket: null });
    }
  },

  onReceiveMessage: (callback) => {
    const socket = get().socket;
    if (socket) {
      socket.on("receiveMessage", callback);
    }
  },
}));

export default useSocketStore;
