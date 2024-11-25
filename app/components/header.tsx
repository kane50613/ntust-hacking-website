import { Await, Link, useRouteLoaderData } from "react-router";
import { Button } from "./ui/button";
import { loader } from "~/root";
import { Suspense } from "react";
import type { Info } from "~/+types/root";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export const Header = () => {
  const { user } = useRouteLoaderData<typeof loader>("root") ?? {};

  return (
    <header className="fixed h-20 w-full top-0 left-0 z-50 flex justify-center">
      <div
        className="backdrop-blur-sm absolute w-full h-full top-0 left-0 from-background to-transparent bg-gradient-to-b pointer-events-none"
        style={{
          mask: "linear-gradient(black, black, transparent)",
        }}
      />
      <div className="flex gap-4 items-center h-full container relative">
        <a href="#">
          <img
            src="https://creatorspace.imgix.net/users/clm61gg6k03bdo9010lkwn8z8/G1CNUrljJkYCXIWY-channels4_profile.jpeg"
            className="rounded-full w-10 aspect-square shadow-lg"
          />
        </a>
        <p className="hidden sm:block">台科大資訊安全研究社</p>
        <div className="flex-grow"></div>
        <Suspense fallback={<UserSkeleton />}>
          <Await resolve={user}>{(user) => <User user={user} />}</Await>
        </Suspense>
      </div>
    </header>
  );
};

const User = ({ user }: { user: Awaited<Info["loaderData"]["user"]> }) => {
  if (!user)
    return (
      <Button variant="outline" className="rounded-full h-10" asChild>
        <Link to="/auth">社員登入</Link>
      </Button>
    );

  return (
    <Button variant="outline" className="rounded-full h-10">
      <img
        src={user.avatar}
        className="rounded-full w-6 aspect-square shadow-lg"
      />
      <p className="text-sm">{user.name}</p>
      <ChevronDown className="h-4 w-4" />
    </Button>
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
