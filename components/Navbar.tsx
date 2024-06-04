import Image from "next/image";
import Link from "next/link";
import React from "react";
import MobileNav from "@/components/MobileNav";
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import SwitchAppDropdown from "./SwitchAppDropdown";

const Navbar = () => {
  return (
    <nav className="flex-between fixed z-50 w-full bg-dark-1 px-6 py-4 ;g-px-10">
      <Link href="/" className="flex items-center gap-1">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="Coom Logo"
          className="max-sm:size-10"
        />
        <p className="text-[26px] font-extrabold text-white max-sm:hidden ">
          Coom
        </p>
      </Link>

      <div className="flex-between gap-5">
        <SwitchAppDropdown />
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
