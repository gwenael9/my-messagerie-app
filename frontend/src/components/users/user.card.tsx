import { User } from "@/types/user";
import { Card, CardTitle } from "../ui/card";

export default function CardUser({ user }: { user: User }) {
  return (
    <Card className="p-2">
      <CardTitle>{user.name}</CardTitle>
    </Card>
  );
}
