import { UserButton } from "@/components/admin/UserButton";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function AdminNavbar() {
  return (
    <div className="flex items-center p-4 bg-white/50 backdrop-blur-md shadow-sm border-b sticky top-0 z-50">
      <div className="flex w-full justify-end items-center gap-4">
        <LanguageSwitcher />
        <UserButton />
      </div>
    </div>
  );
}
