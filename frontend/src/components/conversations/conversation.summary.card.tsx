import { ConversationSummary } from "@/types/conversation";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format } from "date-fns";
import { changeName } from "@/lib/utils";
import Link from "next/link";

interface ConversationSumCardProps {
  conversation: ConversationSummary;
}

export default function ConversationSumCard({
  conversation,
}: ConversationSumCardProps) {
  const time = format(new Date(conversation.lastMessage.timestamp), "HH:mm");
  return (
    <Link href={`/conversations/${conversation.id}`}>
      <div
        className={`relative ${
          conversation.unreadCount == 0 ? "bg-white/40" : "bg-white"
        } p-2 rounded w-full flex justify-between items-end gap-4`}
      >
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt={conversation.otherUser.firstname}
            />
            <AvatarFallback>
              {conversation.otherUser.firstname.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-semibold">
              {changeName(conversation.otherUser)}
            </h4>
            <p className="text-sm">{conversation.lastMessage.content}</p>
          </div>
        </div>
        <div className="text-xs">{time}</div>
        {conversation.unreadCount > 0 && (
          <div className="absolute top-2 right-2 bg-primary px-2 rounded text-xs text-white">
            {conversation.unreadCount}
          </div>
        )}
      </div>
    </Link>
  );
}
