import { Conversation } from "./conversation";
import { Message } from "./message";

export type User = {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  role: "ADMIN" | "USER";
  messageSend: Message[];
  messageReceived: Message[];
  conversations: Conversation[];
  profilVisibility: boolean;
  friends: User[];
};
