import { Link } from "react-router";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog";

export const SignInDialog = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => (
  <Dialog open={open} onOpenChange={setOpen}>
    <DialogContent>
      <DialogTitle>登入 Discord 帳號後報名</DialogTitle>
      <DialogDescription>我不會盜你帳號，應該吧</DialogDescription>
      <Button className="rounded-full" size="lg" asChild>
        <Link to="/auth">帶我去登入頁面</Link>
      </Button>
    </DialogContent>
  </Dialog>
);
