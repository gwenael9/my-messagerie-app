import { Message } from "./message";
import { User } from "./user";

export type Conversation = {
    id: number;
    users: User[];
    messages: Message[];
}

export type ConversationSummary = {
    id: number;
    lastMessage: LastMessage;
    unreadCount: number;
    otherUser: User;
}

type LastMessage = {
    content: string;
    timestamp: Date;
    sendByMe: boolean;
}
