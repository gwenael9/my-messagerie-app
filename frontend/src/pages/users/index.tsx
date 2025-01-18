import Layout from "@/components/Layout/Layout";
import CardUser from "@/components/users/user.card";
import useUserStore from "@/stores/userStore";

export default function UsersPage() {
  const { usersPublic } = useUserStore();

  console.log(usersPublic);

  return (
    <Layout title="Utilisateurs">
      <h2>Profils publics</h2>
      <div className="flex flex-wrap justify-center gap-2 mt-2">
        {usersPublic.map((user) => (
          <CardUser key={user.id} user={user} />
        ))}
      </div>
    </Layout>
  );
}
