import Link from "next/link";
import { ReactNode } from "react";
import { Badge } from "./ui/badge";

interface ButtonLinkProps {
  icon: ReactNode;
  link: string;
  nbNotif?: number;
}

export default function ButtonLink({ icon, link, nbNotif = 0 }: ButtonLinkProps) {
  return (
    <Link href={link}>
      <div className="relative p-2">
        <div className="rounded-full p-2 bg-white shadow-md text-primary">
          {icon}
        </div>
        {nbNotif > 0 && (
          <Badge className="absolute top-0 right-0" variant="destructive">
            {nbNotif}
          </Badge>
        )}
      </div>
    </Link>
  );
}
