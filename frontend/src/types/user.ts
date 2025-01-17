import { Conversation } from "./conversation";
import { Message } from "./message";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
  messageSend: Message[];
  messageReceived: Message[];
  conversations: Conversation[];
};
