import useAuthStore from "@/stores/authStore";
import { Message } from "@/types/message";
import { format } from "date-fns";

type MessageCardProps = {
  message: Message;
};

export default function MessageCard({ message }: MessageCardProps) {
  const { user } = useAuthStore();
  const isSentByMe = message.sender.id === user?.id;

  const time = format(new Date(message.timestamp), "HH:mm");

  return (
    <div className={`flex ${isSentByMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex flex-col rounded px-2 max-w-sm ${
          isSentByMe ? "bg-blue-500 text-white" : "bg-gray-200 text-black"
        }`}
      >
        <span>{message.content}</span>
        <span className="text-gray-500 text-xs">{time}</span>
      </div>
    </div>
  );
}
