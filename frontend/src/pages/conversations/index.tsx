import ConversationSumCard from "@/components/conversations/conversation.summary.card";
import Layout from "@/components/Layout/Layout";
import LoadingBase from "@/components/Loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import useConversationStore from "@/stores/conversationStore";
import { useEffect, useState } from "react";

export default function Conversations() {
  const { conversationsSummary, fetchConversationsSummary } =
    useConversationStore();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      await fetchConversationsSummary();
      setLoading(false);
    };
    fetchData();
  }, [fetchConversationsSummary]);

  if (loading) {
    return <LoadingBase />;
  }

  return (
    <Layout title="Conversations">
      <h2>Toutes mes conversations</h2>
      <ScrollArea className="flex justify-center mt-4 mx-24 h-[500px]">
        <div className="w-full flex flex-col gap-1">
          {conversationsSummary.map((conversation) => (
            <ConversationSumCard
              key={conversation.id}
              conversation={conversation}
            />
          ))}
        </div>
      </ScrollArea>
    </Layout>
  );
}
