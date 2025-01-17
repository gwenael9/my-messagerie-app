import { getFriends } from "@/api/users";
import Layout from "@/components/Layout/Layout";
import CardUser from "@/components/users/user.card";
import useUserStore from "@/store/authStore";
import { User } from "@/types/user";
import { useEffect, useState } from "react";

export default function Home() {
  const [friends, setFriends] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { isLoggedIn } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const friendsData = await getFriends();
        setFriends(friendsData);
      } catch (error) {
        console.error("Erreur", error);
      } finally {
        setLoading(false);
      }
    };
    if (isLoggedIn) {
      fetchData();
    }
  }, [isLoggedIn]);

  if (loading) return <p>Chargement de la liste des amis...</p>;

  return (
    <Layout title="Accueil">
      <h1>Page d&apos;accueil</h1>
      <div className="flex">
        {friends.map((friend) => (
          <CardUser key={friend.id} user={friend} />
        ))}
      </div>
    </Layout>
  );
}
