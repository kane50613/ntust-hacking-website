import { Await, Link } from "react-router";
import { Button } from "./ui/button";
import { Suspense } from "react";
import type { Info } from "~/+types/root";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "./ui/skeleton";
import { useRootLoaderData } from "~/hook/useRootLoaderData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useJsonFetcher } from "~/hook/use-json-fetcher";

export const Header = () => {
  const { user } = useRootLoaderData();

  return (
    <header className="sticky h-20 w-full top-0 left-0 z-50 flex justify-center pointer-events-none">
      <div
        className="backdrop-blur-sm absolute w-full h-full top-0 left-0 from-background to-transparent bg-gradient-to-b pointer-events-none"
        style={{
          mask: "linear-gradient(black, black, transparent)",
        }}
      />
      <div className="flex gap-4 items-center h-full container relative">
        <Link to="/" className="pointer-events-auto flex items-center">
          <img
            src="https://creatorspace.imgix.net/users/clm61gg6k03bdo9010lkwn8z8/G1CNUrljJkYCXIWY-channels4_profile.jpeg"
            className="rounded-full w-10 aspect-square shadow-lg"
          />
          <p className="ml-2 hidden sm:block">台科大資訊安全研究社</p>
        </Link>
        <div className="flex-grow"></div>
        <div className="pointer-events-auto">
          <Suspense fallback={<UserSkeleton />}>
            <Await resolve={user}>{(user) => <User user={user} />}</Await>
          </Suspense>
        </div>
      </div>
    </header>
  );
};

const User = ({ user }: { user: Awaited<Info["loaderData"]["user"]> }) => {
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
        <Button variant="outline" className="rounded-full h-10">
          <img
            src={user.avatar}
            className="rounded-full w-6 aspect-square shadow-lg"
          />
          <p className="text-sm">{user.name}</p>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
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

const UserSkeleton = () => (
  <Button variant="outline" className="rounded-full h-10">
    <Skeleton className="w-6 aspect-square shadow-lg rounded-full" />
    <Skeleton className="text-sm">
      <p className="opacity-0 pointer-events-none">name</p>
    </Skeleton>
    <ChevronDown className="h-4 w-4" />
  </Button>
);
