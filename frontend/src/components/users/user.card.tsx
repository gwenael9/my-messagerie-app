import { User } from "@/types/user";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Plus, Send } from "lucide-react";
import { Button } from "../ui/button";
import useAuthStore from "@/stores/authStore";
import { Badge } from "../ui/badge";
import { changeName } from "@/lib/utils";
import useConversationStore from "@/stores/conversationStore";
import { useRouter } from "next/router";
import { addNewFriend } from "@/api/users";
import { useToast } from "@/hooks/use-toast";

export default function CardUser({ user }: { user: User }) {
  const { user: me, isLoggedIn } = useAuthStore();
  const { fetchIdOfOneConversation } = useConversationStore();
  const router = useRouter();
  const { toast } = useToast();

  // on vérifie si l'user est notre ami
  const isFriend = user.friends.some((u) => u.id === me?.id);

  const handleConversationFetch = async () => {
    const conversation = await fetchIdOfOneConversation(user.id);
    if (conversation) {
      router.push(`/conversations/${conversation.id}`);
    }
  };

  const handleAddNewFriend = async (userId: number) => {
    const message = await addNewFriend(userId);
    toast({
      title: message,
      variant: "success",
    });
  };

  return (
    <Card className="bg-white w-[350px]">
      <CardHeader className="flex justify-between flex-row gap-4">
        <div className=" flex items-center">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt={user?.firstname}
            />
            <AvatarFallback>
              {user?.firstname.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-2  w-full">
          <div>
            <div className="flex items-center gap-2">
              <CardTitle className="text-xl">
                {changeName(user)}
              </CardTitle>
              {isFriend && <Badge variant="outline">ami</Badge>}
            </div>
            <CardDescription>{user.email}</CardDescription>
          </div>
          {isLoggedIn && (
            <div className="flex items-center justify-end">
              {!isFriend && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleAddNewFriend(user.id)}
                >
                  <Plus />
                </Button>
              )}
              <Button
                variant="outline"
                size="icon"
                onClick={handleConversationFetch}
              >
                <Send />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}
