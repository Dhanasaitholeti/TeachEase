"use client";
import { List, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/component/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/component/ui/dropdown-menu";
import { Button } from "@/app/component/ui/button";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function TopBar() {
  const [userData, setUserData] = useState<any>();

  useEffect(() => {
    const data = localStorage.getItem("userData");
    if (data) {
      setUserData(data);
    }
  }, []);
  return (
    <div className="lg:h-[10%] bg-white border-b">
      <div className="h-full flex items-center justify-between gap-4 w-full px-4">
        {/* Toggle Button */}

        {/* Search Bar */}
        <form action="#" className="hidden sm:block w-[350px]">
          <div className="relative">
            <button
              type="submit"
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <Search className="w-5 h-5" />
            </button>
            <input
              type="text"
              className="pl-12 pr-4 h-10 w-full bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-main-600 placeholder:text-sm"
              placeholder="Search..."
            />
          </div>
        </form>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative p-0 rounded-full">
              <Avatar className="w-10 h-10">
                <AvatarImage
                  src="/assets/images/thumbs/user-img.png"
                  alt="User"
                />
                <AvatarFallback>MJ</AvatarFallback>
              </Avatar>
              <span className="absolute w-3 h-3 bg-green-500 rounded-full bottom-0 right-0 border-2 border-white" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <div className="px-4 py-2 border-b">
              <h4 className="text-sm font-medium">{userData?.name}</h4>
              <p className="text-xs text-gray-500">{userData?.email}</p>
            </div>
            <DropdownMenuItem className="hover:bg-gray-100">
              <i className="ph ph-gear text-primary-600 text-xl" />
              <span className="ml-2">Account Settings</span>
            </DropdownMenuItem>
            <Link
              href={"/login"}
              onClick={() => {
                localStorage.removeItem("userData");
                localStorage.removeItem("userMenu");
                localStorage.removeItem("authToken");
              }}
            >
              <DropdownMenuItem className="hover:bg-red-100 text-red-600">
                <i className="ph ph-sign-out text-xl" />
                <span className="ml-2">Log Out</span>
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
