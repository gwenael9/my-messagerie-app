import MessageCard from "@/components/conversations/message.card";
import Layout from "@/components/Layout/Layout";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { capitalizeFirstLetter } from "@/lib/utils";
import useAuthStore from "@/stores/authStore";
import useConversationStore from "@/stores/conversationStore";
import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormValues {
  message: string;
}

export default function Conversation() {
  const router = useRouter();
  const form = useForm<FormValues>();
  const { id: conversationId } = router.query;
  const { user } = useAuthStore();
  const { fetchOneConversation, conversation, loading, sendMessageStore } =
    useConversationStore();

  const paramId =
    typeof conversationId === "string" ? parseInt(conversationId, 10) : 0;

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paramId > 0) {
      fetchOneConversation(paramId);
    }
  }, [paramId, fetchOneConversation]);

  // Scroll automatiquement vers le bas
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation?.messages]);

  // récupérer le nom de l'autre user de la conversation
  const otherUser = conversation?.users.find((u) => u.id !== user?.id);
  const otherUserName = otherUser
    ? `${otherUser.firstname} ${otherUser.lastname}`
    : "Utilisateur inconnu";

  const name = capitalizeFirstLetter(otherUserName);

  if (loading) {
    return <p>chargement</p>;
  }

  if (!conversation?.messages) {
    return <p>non</p>;
  }

  const handleSendMessage: SubmitHandler<FormValues> = async (values) => {
    form.reset();
    await sendMessageStore(otherUser?.id || 0, values.message, paramId);
  };

  return (
    <Layout title="Conversation">
      <div className="flex justify-center h-full w-full">
        <div className="w-full max-w-[500px] h-full">
          <div className="flex flex-col justify-between h-full">
            <div className="border-b pb-2">
              <h2>{name}</h2>
            </div>
            <div className="flex flex-col h-full max-h-[400px] hover:overflow-y-scroll gap-1 p-2 overflow-hidden">
              {conversation?.messages.length > 0 ? (
                conversation?.messages.map((message) => (
                  <MessageCard key={message.id} message={message} />
                ))
              ) : (
                <p className="text-center text-white">
                  Démarrez une conversation avec {name}.
                </p>
              )}
              <div ref={messagesEndRef} />
            </div>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSendMessage)}>
                <FormField
                  control={form.control}
                  name="message"
                  defaultValue=""
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
