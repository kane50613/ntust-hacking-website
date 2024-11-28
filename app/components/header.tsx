import { Await, Link } from "react-router";
import { Suspense } from "react";
import { useRootLoaderData } from "~/hook/useRootLoaderData";
import { User, UserSkeleton } from "./user";

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
            alt="logo"
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
