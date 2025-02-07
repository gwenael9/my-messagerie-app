import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { changeName } from "@/lib/utils";
import useAuthStore from "@/stores/authStore";
import useConversationStore from "@/stores/conversationStore";
import useMessageStore from "@/stores/messageStore";
import useSocketStore from "@/stores/socketStore";
import useUserStore from "@/stores/userStore";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function App({ Component, pageProps }: AppProps) {
  const { fetchUser, isLoggedIn, user } = useAuthStore();
  const { fetchUsersPublic } = useUserStore();
  const { fetchNbMessagesNoRead } = useMessageStore();
  const { fetchConversationsSummary } = useConversationStore();
  const { toast } = useToast();
  const router = useRouter();
  const { connectSocket, disconnectSocket, onReceiveMessage } =
    useSocketStore();

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

      if (user?.id) {
        connectSocket(user.id); // Connexion socket ici

        onReceiveMessage((data) => {
          fetchNbMessagesNoRead();
          fetchConversationsSummary();
          toast({
            title: "Nouveau message !",
            description: `${changeName(data.data.sender)} : ${
              data.data.content
            }`,
            action: (
              <Button
                onClick={() => {
                  router.push(`/conversations/${data.data.conversation.id}`);
                }}
              >
                Voir
              </Button>
            ),
          });
        });
      } else {
        disconnectSocket();
      }
    }

    fetchMe();
  }, [
    connectSocket,
    disconnectSocket,
    fetchConversationsSummary,
    fetchNbMessagesNoRead,
    fetchUser,
    fetchUsersPublic,
    isLoggedIn,
    onReceiveMessage,
    router,
    toast,
    user?.id,
  ]);

  return <Component {...pageProps} />;
}
