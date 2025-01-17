import { Message } from "./message";
import { User } from "./user";

export type Conversation = {
    id: number;
    users: User[];
    messages: Message[];
}