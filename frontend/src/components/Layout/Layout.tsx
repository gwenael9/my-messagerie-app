import Head from "next/head";
import { ReactNode, useEffect } from "react";
import Header from "./Header";
import { Toaster } from "../ui/toaster";
import useAuthStore from "@/stores/authStore";
import { io } from "socket.io-client";
import { Message } from "@/types/message";
import { useToast } from "@/hooks/use-toast";
import { Button } from "../ui/button";
import { useRouter } from "next/router";
import { changeName } from "@/lib/utils";
import useMessageStore from "@/stores/messageStore";
import useConversationStore from "@/stores/conversationStore";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  const { user } = useAuthStore();

  const { fetchNbMessagesNoRead } = useMessageStore();
  const { fetchConversationsSummary } = useConversationStore();

  const router = useRouter();
  const { toast } = useToast();
  // Utilisation du useEffect pour initialiser le socket
  useEffect(() => {
    if (user?.id) {
      const newSocket = io("http://localhost:4000", {
        query: { userId: user.id }, // Envoyer l'ID de l'utilisateur à la connexion WebSocket
        withCredentials: true,
      });

      const handleReceiveMessage = (data: { data: Message }) => {
        console.log("Message reçu :", data);
        fetchNbMessagesNoRead();
        fetchConversationsSummary();
        toast({
          title: "Nouveau message !",
          description: `${changeName(data.data.sender)} : ${data.data.content}`,
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
      };

      newSocket.on("receiveMessage", handleReceiveMessage);

      return () => {
        newSocket.off("receiveMessage", handleReceiveMessage);
        newSocket.disconnect(); // Déconnecter le socket à la destruction du composant
      };
    }
  }, [fetchConversationsSummary, fetchNbMessagesNoRead, router, toast, user?.id]);

  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200..800&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Pacifico&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="flex flex-col h-screen">
        <Header />
        <main className="flex-grow px-8 my-4 overflow-y-auto">{children}</main>
      </div>
      <Toaster />
    </>
  );
}
