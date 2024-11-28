import { ChevronDown } from "lucide-react";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import type { Info } from "~/+types/root";
import { useJsonFetcher } from "~/hook/use-json-fetcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link } from "react-router";

export const User = ({
  user,
}: {
  user: Awaited<Info["loaderData"]["user"]>;
}) => {
  const [signOut, signOutFetcher] = useJsonFetcher("/sign-out");

  if (!user)
    return (
      <Button variant="outline" className="rounded-full h-10" asChild>
        <Link to="/auth">社員登入</Link>
      </Button>
    );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-full h-10 px-2">
          <img
            src={user.avatar}
            className="rounded-full w-6 aspect-square shadow-lg"
            alt="user avatar"
          />
          <p className="text-sm">{user.name}</p>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {user?.role === "admin" && <AdminDropdownOptions />}
        <DropdownMenuItem
          onClick={() => signOut(null)}
          disabled={signOutFetcher.state !== "idle"}
        >
          登出
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const UserSkeleton = () => (
  <Button variant="outline" className="rounded-full h-10 px-2">
    <Skeleton className="w-6 aspect-square shadow-lg rounded-full" />
    <Skeleton className="text-sm">
      <p className="opacity-0 pointer-events-none">name</p>
    </Skeleton>
    <ChevronDown className="h-4 w-4" />
  </Button>
);

const AdminDropdownOptions = () => (
  <>
    <DropdownMenuItem asChild>
      <Link to="/admin/users">管理社員</Link>
    </DropdownMenuItem>
    <DropdownMenuItem asChild>
      <Link to="/admin/events">管理活動</Link>
    </DropdownMenuItem>
    <DropdownMenuSeparator />
  </>
);
