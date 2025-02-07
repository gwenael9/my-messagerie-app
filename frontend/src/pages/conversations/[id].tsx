import MessageCard from "@/components/conversations/message.card";
import Layout from "@/components/Layout/Layout";
import LoadingBase from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { changeName } from "@/lib/utils";
import useAuthStore from "@/stores/authStore";
import useConversationStore from "@/stores/conversationStore";
import useSocketStore from "@/stores/socketStore";
import { Message } from "@/types/message";
import { useRouter } from "next/router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormValues {
  message: string;
}

export default function Conversation() {
  const router = useRouter();
  const form = useForm<FormValues>();
  const { id: conversationId } = router.query;
  const { user } = useAuthStore();
  const { fetchOneConversation, conversation, sendMessageStore, readMessages } =
    useConversationStore();
  const { onReceiveMessage } = useSocketStore();

  const [isFetching, setIsFetching] = useState(true);

  const [firstUnreadIndex, setFirstUnreadIndex] = useState<number | null>(null);

  const paramId =
    typeof conversationId === "string" ? parseInt(conversationId, 10) : 0;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paramId > 0) {
      setIsFetching(true);
      fetchOneConversation(paramId).finally(() => setIsFetching(false));
      readMessages(paramId);
    }
  }, [paramId, fetchOneConversation, readMessages]);

  useEffect(() => {
    const handleNewMessage = (data: { data: Message }) => {
      if (data.data.conversation.id === paramId) {
        fetchOneConversation(paramId);
      }
    };

    onReceiveMessage(handleNewMessage);
  }, [fetchOneConversation, onReceiveMessage, paramId]);

  // Scroll automatiquement vers le bas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages, isFetching]);

  // Fonction pour trouver l'index du premier message non lu
  const findFirstUnreadIndex = useCallback((messages: Message[]) => {
    return messages.findIndex(
      (message) => !message.isRead && message.recipient.id === user?.id
    );
  }, [user?.id]);

  // Recalculer isNoRead à chaque mise à jour des messages
  useEffect(() => {
    if (conversation?.messages.length) {
      setFirstUnreadIndex(findFirstUnreadIndex(conversation.messages));
    }
  }, [conversation?.messages, findFirstUnreadIndex]);

  // récupérer le nom de l'autre user de la conversation
  const otherUser = conversation?.users.find((u) => u.id !== user?.id);
  const otherUserName = otherUser
    ? changeName(otherUser)
    : "Utilisateur inconnu";

  const handleSendMessage: SubmitHandler<FormValues> = async (values) => {
    if (!values.message) return;
    form.reset();
    await sendMessageStore(otherUser?.id || 0, values.message, paramId);
  };

  if (isFetching) {
    return <LoadingBase />;
  }

  return (
    <Layout title={otherUserName}>
      <div
        className="flex justify-center w-full"
        onClick={() => {
          readMessages(paramId);
          setFirstUnreadIndex(null);
        }}
      >
        <div className="w-full max-w-[500px] h-full">
          <div className="flex flex-col justify-between h-full">
            <div className="border-b pb-2">
              <h2>{otherUserName}</h2>
            </div>
            <ScrollArea className="h-[450px] py-2">
              <div className="flex flex-col gap-1">
                {conversation && conversation?.messages.length > 0 ? (
                  conversation?.messages.map((message, index) => {
                    return (
                      <div key={message.id}>
                        {index === firstUnreadIndex && (
                          <div className="text-center text-red-500 font-bold">
                            Message non lu
                          </div>
                        )}
                        <MessageCard message={message} />
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-white">
                    Démarrez une conversation avec {otherUserName}.
                  </p>
                )}
              </div>
              <div ref={messagesEndRef} />
            </ScrollArea>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSendMessage)}>
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          className="bg-white"
                          placeholder={`Comment vas-tu ${otherUser?.firstname} ?`}
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div className="flex justify-end mt-2">
                  <Button type="submit">Envoyer</Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Layout>
  );
}
