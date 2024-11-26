import { Separator } from "./ui/separator";

export const Footer = () => (
  <>
    <Separator />
    <footer className="flex flex-col items-center justify-center text-center py-4 gap-4">
      <p className="text-sm text-muted-foreground">
        既然你都看到這了，應該就接著往這邊點吧
      </p>
      <a
        href="https://github.com/kane50613"
        target="_blank"
        rel="noopener noreferrer"
        className="text-muted-foreground"
      >
        第一章：魔法的起源 (GitHub)
      </a>
    </footer>
  </>
);
