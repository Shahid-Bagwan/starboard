"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Search } from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

const navItems = [
  { name: "Deal Overview", href: "/" },
  { name: "Workshop", href: "/workshop" },
]

export default function Navbar() {
  const pathname = usePathname()

  return (
    <header className="border-b w-full ">
      <div className="container mx-auto px-2 py-2 flex h-16 items-center justify-between">
        <nav className="flex items-center space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground",
              )}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Ask me anything!" className="pl-8" />
          </div>

          <ModeToggle />

          <Link href="/profile">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
