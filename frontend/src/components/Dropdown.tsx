import useAuthStore from "@/stores/authStore";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

export default function DropdownAvatar() {
  const { user, logoutUser } = useAuthStore();
  const { toast } = useToast();

  const handleLogout = async () => {
    setTimeout(async () => {
      const message = await logoutUser();
      toast({
        title: message,
      });
    }, 500);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage
            src="https://github.com/shadcn.png"
            alt={user?.firstname}
          />
          <AvatarFallback>{user?.firstname.charAt(0)}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem>Mon compte</DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 border-t" />
        <DropdownMenuItem
          className="cursor-pointer text-destructive"
          onClick={handleLogout}
        >
          Déconnexion
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
