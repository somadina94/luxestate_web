import { User } from "@/types";
import Link from "next/link";

interface UserItemProps {
  user: User;
}

export default function UserItem({ user }: UserItemProps) {
  return (
    <Link href={`users/${user.id}`} className="block">
      <div className="p-4 shadow-sm rounded-lg flex flex-col dark:bg-muted lg:flex-row lg:items-center justify-between gap-4">
        <div className="md:w-1/4">
          <p>{user.first_name}</p>
          <p>{user.last_name}</p>
        </div>
        <p className="text-primary md:w-1/4">{user.role.toUpperCase()}</p>
        <p className="md:w-1/4">{user.email}</p>
        <p className="md:w-1/4">{user.phone}</p>
      </div>
    </Link>
  );
}
