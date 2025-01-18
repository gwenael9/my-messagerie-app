import useAuthStore from "@/store/authStore";
import useUserStore from "@/store/userStore";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const { fetchUser } = useAuthStore();
  const { fetchUsersPublic } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      await fetchUser();
      await fetchUsersPublic();
    };
    fetchData();
  }, [fetchUser, fetchUsersPublic]);

  return <Component {...pageProps} />;
}
