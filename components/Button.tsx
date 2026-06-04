"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { signOutUser } from "@/lib/auth-actions";

export function SignoutButton() {
  return (
    <DropdownMenuItem
      onClick={async () => {
        await signOutUser();
      }}
    >
      Log out
    </DropdownMenuItem>
  );
}
