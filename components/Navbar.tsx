import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { MenuIcon, MountainIcon } from "lucide-react";
import Image from "next/image";
import LogoIcon from "./icons/logo-icon";
import { ModeToggle } from "./ui/toggle-theme";
import { getCurrentUser } from "@/actions/auth.action";
import UserButton from "./auth/userIcon";

const Links = [
  {
    name: "Features",
    href: "/features",
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "About",
    href: "/about",
  },
  {
    name: "Contact",
    href: "/contact",
  },
];

export default async function Navbar() {
  const session = await getCurrentUser();
  return (
    <header className="flex h-16 w-full max-w-[1300px] mx-auto items-center justify-between px-4 md:px-6 lg:px-8">
      <Link href="/" className="flex items-center" prefetch={false}>
        <span className="sr-only">StudyGen AI</span>
        <LogoIcon className="size-52" />
      </Link>
      <nav className="hidden lg:flex items-center space-x-6">
        {Links.map((link, index) => (
          <Link
            key={link.name + index}
            href={link.href}
            className="text-sm font-medium transition-colors hover:text-primary focus:text-primary py-1 underline-animated"
            prefetch={false}
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="hidden lg:flex gap-6">
        <ModeToggle />

        {!session ? (
          <Button>Get Started</Button>
        ) : (
          <UserButton
            profileImage={session.image || undefined}
            userEmail={session.email || undefined}
            username={session.name || undefined}
          />
        )}
      </div>

      {/* Mobile Navbar */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="lg:hidden">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex flex-col items-start space-y-6 p-6">
            <Link href="#" className="flex items-center" prefetch={false}>
              <Image
                src="/full-logo.svg"
                width={200}
                height={200}
                alt="StudyGen AI Logo"
              />
              <span className="sr-only">StudyGen AI</span>
            </Link>
            <nav className="grid gap-4">
              <Link
                href="#"
                className="text-sm font-medium transition-colors hover:text-gray-900 focus:text-gray-900 dark:hover:text-gray-50 dark:focus:text-gray-50"
                prefetch={false}
              >
                Features
              </Link>
              <Link
                href="#"
                className="text-sm font-medium transition-colors hover:text-gray-900 focus:text-gray-900 dark:hover:text-gray-50 dark:focus:text-gray-50"
                prefetch={false}
              >
                Pricing
              </Link>
              <Link
                href="#"
                className="text-sm font-medium transition-colors hover:text-gray-900 focus:text-gray-900 dark:hover:text-gray-50 dark:focus:text-gray-50"
                prefetch={false}
              >
                About
              </Link>
              <Link
                href="#"
                className="text-sm font-medium transition-colors hover:text-gray-900 focus:text-gray-900 dark:hover:text-gray-50 dark:focus:text-gray-50"
                prefetch={false}
              >
                Contact
              </Link>
            </nav>

            <Button>Get Started</Button>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
