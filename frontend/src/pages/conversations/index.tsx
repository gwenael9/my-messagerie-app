import ConversationSumCard from "@/components/conversations/conversation.summary.card";
import Layout from "@/components/Layout/Layout";
import useConversationStore from "@/stores/conversationStore";
import { useEffect } from "react";

export default function Conversations() {
  const { conversationsSummary, fetchConversationsSummary } =
    useConversationStore();

  useEffect(() => {
    const fetchData = async () => {
      await fetchConversationsSummary();
    };
    fetchData();
  }, [fetchConversationsSummary]);

  return (
    <Layout title="Conversations">
      <h2>Toutes mes conversations</h2>
      <div className="flex justify-center mt-2">
        <div className="w-full max-w-[500px] flex flex-col gap-1">
          {conversationsSummary.map((conversation) => (
            <ConversationSumCard
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
}
