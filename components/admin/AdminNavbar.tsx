import { UserButton } from "@/components/admin/UserButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AdminNavbar() {
  return (
    <div className="sticky top-0 z-50 flex items-center border-b border-slate-200 bg-white/85 p-4 backdrop-blur-md">
      <div className="flex w-full justify-end items-center gap-4">
        <LanguageSwitcher />
        <UserButton />
      </div>
    </div>
  );
}
