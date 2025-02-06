import useAuthStore from "@/stores/authStore";
import useMessageStore from "@/stores/messageStore";
import useUserStore from "@/stores/userStore";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const { fetchUser, isLoggedIn } = useAuthStore();
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
    }
    fetchMe();
  }, [fetchNbMessagesNoRead, fetchUser, fetchUsersPublic, isLoggedIn]);

  return <Component {...pageProps} />;
}
