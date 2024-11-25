import {
  Links,
  LinksFunction,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import "./app.css";
import { MotionLoader } from "./components/motion-loader";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Route } from "./+types/root";
import { getSessionFromRequest } from "./session";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { users } from "./db/schema";
import { Toaster } from "./components/ui/sonner";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com" },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500..700&display=swap",
  },
  {
    rel: "icon",
    href: "https://creatorspace.imgix.net/users/clm61gg6k03bdo9010lkwn8z8/G1CNUrljJkYCXIWY-channels4_profile.jpeg",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-Tw" className="dark font-sans">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <MotionLoader>
          <Header />
          {children}
          <Footer />
        </MotionLoader>
        <Toaster richColors />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader({ request }: Route.LoaderArgs) {
  const session = await getSessionFromRequest(request);

  if (session.data.userId) {
    return {
      user: db.query.users
        .findFirst({
          where: eq(users.userId, session.data.userId),
        })
        .execute(),
    };
  }

  return {};
}

export default function App() {
  return <Outlet />;
}
