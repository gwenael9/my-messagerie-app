import { User } from "@/types/user";
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Plus, Send } from "lucide-react";
import { Button } from "../ui/button";
import useAuthStore from "@/store/authStore";
import { Badge } from "../ui/badge";
import { capitalizeFirstLetter } from "@/lib/utils";

export default function CardUser({ user }: { user: User }) {
  const { user: me } = useAuthStore();

  // on vérifie si l'user est notre ami
  const isFriend = user.friends.some((u) => u.id === me?.id);

  const fullname = `${user.firstname} ${user.lastname}`;

  return (
    <Card className="bg-white w-[300px]">
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
                {capitalizeFirstLetter(fullname)}
              </CardTitle>
              {isFriend && <Badge variant="outline">ami</Badge>}
            </div>
            <CardDescription>{user.email}</CardDescription>
          </div>
          <div className="flex justify-end">
            {!isFriend && (
              <Button variant="outline" size="icon">
                <Plus />
              </Button>
            )}
            <Button variant="outline" size="icon">
              <Send />
            </Button>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
}
