import { Button } from "./ui/button";

export const Header = () => (
  <header className="fixed h-20 w-full top-0 left-0 z-50 flex justify-center">
    <div
      className="backdrop-blur-sm absolute w-full h-full top-0 left-0 from-background to-transparent bg-gradient-to-b pointer-events-none"
      style={{
        mask: "linear-gradient(black, black, transparent)",
      }}
    />
    <div className="flex gap-4 items-center h-full container relative">
      <img
        src="https://creatorspace.imgix.net/users/clm61gg6k03bdo9010lkwn8z8/G1CNUrljJkYCXIWY-channels4_profile.jpeg"
        className="rounded-full w-10 aspect-square shadow-lg"
      />
      <p className="hidden sm:block">台科大資訊安全研究社</p>
      <div className="flex-grow"></div>
      <Button variant="outline" className="rounded-full h-10">
        社員登入
      </Button>
    </div>
  </header>
);
