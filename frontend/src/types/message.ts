import { Conversation } from "./conversation";
import { User } from "./user";

export type Message = {
    id: number;
    content: string;
    timestamp: Date;
    sender: User;
    recipient: User;
    isRead: boolean;
    conversation: Conversation;
}