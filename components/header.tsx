// components/Header.tsx

"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface HeaderProps {
  LinkText: string;
  LinkUrl: string;
  LinkText1: string;
  LinkUrl1: string;
  LinkText2: string;
  LinkUrl2: string;
}

const Header: React.FC<HeaderProps> = ({ LinkText, LinkUrl, LinkText1, LinkUrl1, LinkText2,LinkUrl2 }) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <header className="border-b fixed top-0 left-0 right-0 bg-background z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold">EcoTrack</Link>
          <nav className="hidden md:flex space-x-8 ml-auto pr-5">
            <Link href={LinkUrl} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors px-3 py-2 rounded">{LinkText}</Link>
            <Link href={LinkUrl1} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors px-3 py-2 rounded">{LinkText1}</Link>
            <Link href={LinkUrl2} className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors px-3 py-2 rounded">{LinkText2}</Link>
          </nav>
          <div className="flex items-center space-x-2">
          <DropdownMenu>
              <DropdownMenuTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" className="px-7">
                  <Menu className="h-[1.2rem] w-[1.2rem]" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={LinkUrl}>{LinkText}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={LinkUrl1}>{LinkText1}</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={LinkUrl2}>{LinkText2}</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <div className="border-l border-slate-200 ml-4 pl-4 dark:border-slate-800">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors "
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? (
                <Moon className="h-[1.2rem] w-[1.2rem]" />
              ) : (
                <Sun className="h-[1.2rem] w-[1.2rem]" />
              )}
            </button>
            </div>
          </div>
        </div>
      </header>
  );
};

export default Header;
