import useAuthStore from "@/stores/authStore";
import Link from "next/link";
import DropdownAvatar from "../Dropdown";
import { Home, Mail, MailOpen } from "lucide-react";
import ButtonLink from "../button.link";
import useMessageStore from "@/stores/messageStore";

export default function Header() {
  const { isLoggedIn } = useAuthStore();
  const { nbMessages } = useMessageStore();

  const iconMail = nbMessages > 0 ? <Mail /> : <MailOpen />;

  return (
    <header className="flex justify-between items-center p-4">
      <ButtonLink icon={<Home />} link="/" />
      {isLoggedIn ? (
        <div className="flex items-center gap-2">
          <ButtonLink
            icon={iconMail}
            link="/conversations"
            nbNotif={nbMessages}
          />
          <DropdownAvatar />
        </div>
      ) : (
        <Link href="/auth">Connexion</Link>
      )}
    </header>
  );
}
