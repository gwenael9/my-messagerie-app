import useUserStore from "@/store/userStore";
import Link from "next/link";
import DropdownAvatar from "../Dropdown";

export default function Header() {
  const { isLoggedIn } = useUserStore();

  return (
    <div className="flex justify-between items-center h-20 border-b px-4">
      <Link href="/">Accueil</Link>
      {isLoggedIn ? <DropdownAvatar /> : <Link href="/auth">Connexion</Link>}
    </div>
  );
}
