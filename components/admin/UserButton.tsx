import { auth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton } from "@/components/Button"; // Or from wherever it's exported

export async function UserButton() {
  const session = await auth();

  if (!session?.user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full h-10 w-10 border shadow-sm"
        >
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={session.user.image || ""}
              alt={session.user.name || "Admin"}
            />
            <AvatarFallback className="bg-indigo-100 text-indigo-700 font-semibold">
              {session.user.name?.charAt(0).toUpperCase() || "A"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {session.user.name && (
              <p className="font-medium text-sm">{session.user.name}</p>
            )}
            {session.user.email && (
              <p className="w-[200px] truncate text-xs text-muted-foreground">
                {session.user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <SignOutButton />
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
