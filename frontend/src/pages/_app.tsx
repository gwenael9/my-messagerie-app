import useUserStore from "@/store/userStore";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const { fetchUser } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      await fetchUser();
    };
    fetchUserData();
  }, [fetchUser]);

  return <Component {...pageProps} />;
}
