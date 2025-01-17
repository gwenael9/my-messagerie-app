import useUserStore from "@/store/userStore";
import Link from "next/link";

export default function Header() {
  const { isLoggedIn, user } = useUserStore();

  return (
    <div className="p-4 border-b">
      <div className="flex justify-between">
        <Link href={"/"}>Accueil</Link>
        {isLoggedIn ? (
          <div>Bonjour {user?.name}</div>
        ) : (
          <Link href={"/auth"}>Connexion</Link>
        )}
      </div>
    </div>
  );
}
