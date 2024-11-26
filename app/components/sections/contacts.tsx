import type { ReactNode } from "react";
import { SectionTitle } from "../section-title";
import { FaDiscord, FaFacebook, FaInstagram } from "react-icons/fa6";

interface Social {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}

const socials: Social[] = [
  {
    title: "進我們的不和諧 😡",
    description: "台科資安社 NTUST CSRC",
    href: "https://discord.gg/8mZxdsJkvQ",
    icon: <FaDiscord className="w-10 h-10" />,
  },
  {
    title: "追蹤 Instagram",
    description: "@ntust.hacking",
    href: "https://instagram.com/ntust.hacking",
    icon: <FaInstagram className="w-10 h-10" />,
  },
  {
    title: "在 Facebook 按讚",
    description: "@ntust.hacking",
    href: "https://www.facebook.com/ntust.hacking",
    icon: <FaFacebook className="w-10 h-10" />,
  },
];

export const Contacts = () => {
  return (
    <div className="py-32 flex flex-col items-center justify-center gap-10 w-full container">
      <SectionTitle>在這裡找我們</SectionTitle>
      <div className="grid lg:grid-cols-3 gap-4">
        {socials.map((social) => (
          <SocialLink key={social.href} social={social} />
        ))}
      </div>
    </div>
  );
};

const SocialLink = ({ social }: { social: Social }) => (
  <a
    href={social.href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center text-xl text-primary/90 gap-4 hover:bg-accent transition-colors rounded-lg px-6 py-4"
  >
    {social.icon}
    <div>
      <p>{social.title}</p>
      <p className="text-sm text-muted-foreground">{social.description}</p>
    </div>
  </a>
);
