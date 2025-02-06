import useAuthStore from "@/stores/authStore";
import useMessageStore from "@/stores/messageStore";
import useUserStore from "@/stores/userStore";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { io } from "socket.io-client";

export default function App({ Component, pageProps }: AppProps) {
  const { fetchUser, isLoggedIn, user } = useAuthStore();
  const { fetchUsersPublic } = useUserStore();
  const { fetchNbMessagesNoRead } = useMessageStore();

  useEffect(() => {
    const fetchMe = async () => {
      await fetchUser();
    };
    const fetchData = async () => {
      await fetchUsersPublic();
      await fetchNbMessagesNoRead();
    };
    if (isLoggedIn) {
      fetchData();

      const newSocket = io("http://localhost:4000", {
        withCredentials: true,
        query: { userId: user?.id },
      });

      newSocket.on("connect", () => {
        console.log("WebSocket connecté avec succès !");
      });

    }
    fetchMe();
  }, [fetchNbMessagesNoRead, fetchUser, fetchUsersPublic, isLoggedIn, user?.id]);

  return <Component {...pageProps} />;
}
