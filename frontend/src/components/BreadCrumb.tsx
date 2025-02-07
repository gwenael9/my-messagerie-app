import { useRouter } from "next/router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import useConversationStore from "@/stores/conversationStore";
import useAuthStore from "@/stores/authStore";
import { changeName } from "@/lib/utils";

export default function BreadcrumbMessage() {
  const router = useRouter();
  const { conversation } = useConversationStore();
  const { user } = useAuthStore();

  const pathSegments = router.asPath.split("/").filter(Boolean);
  const { id } = router.query;

  if (router.pathname === "/") {
    return null;
  }

  const breadcrumbMap: Record<string, string> = {
    conversations: "Conversations",
    users: "Utilisateurs",
    auth: "Authentification",
  };

  const getNameOfConversationUser = () => {
    const otherUser = conversation?.users.find((u) => u.id !== user?.id);
    if (!otherUser) return "";
    return changeName(otherUser);
  };

  return (
    <Breadcrumb>
      <BreadcrumbList className="text-white">
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>

        {pathSegments.map((segment, index) => {
          const href = "/" + pathSegments.slice(0, index + 1).join("/");
          const isLast = index === pathSegments.length - 1;

          const label =
            breadcrumbMap[segment] ||
            (id && segment === id ? getNameOfConversationUser() : segment);

          return (
            <>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
