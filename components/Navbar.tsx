import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { LogOut, Search, Settings, User } from "lucide-react";
import { Field, FieldContent, FieldLabel } from "./ui/field";
import { ButtonGroup } from "./ui/button-group";
import { Input } from "./ui/input";

function AccountDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <User />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User /> Profile
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Settings /> Settings
        </DropdownMenuItem>
        <DropdownMenuItem>
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const Navbar = () => {
  return (
    <div className="mx-auto border border-white/20 shadow-sm shadow-white/20 p-4 flex justify-between items-center">
      {/* links */}
      <div className="flex gap-4 items-center">
        <h1 className="text-2xl font-bold">StreamCoin</h1>
        <Link href="/">Home</Link>
        <Link href="/coins">Coins</Link>
        <Link href="/portfolio">Portfolio</Link>
      </div>

      {/* buttons */}
      <div className="flex gap-4">
        {/* Search */}
        <Field>
          <ButtonGroup>
            <Input id="input-button-group" type="text" placeholder="Search" />
            <Button variant="outline">
              <Search />
            </Button>
          </ButtonGroup>
        </Field>
        <AccountDropdown />
      </div>
    </div>
  );
};

export default Navbar;
