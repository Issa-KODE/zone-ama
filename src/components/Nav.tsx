"use client"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ComponentProps } from "react"

export function Nav({children}: {children: React.ReactNode}) {
  return <nav className="flex flex-wrap justify-between items-center border-b border-gray-200 pb-10">{children}</nav>
}

export function NavLink(props: Omit<ComponentProps<typeof Link>, "className">) {
  const pathname = usePathname()
  return <Link {...props} className={cn("text-black text-lg mx-3 border border-gray-200 rounded-lg px-4 py-2 hover:bg-slate-50", pathname === props.href && "text-white bg-foreground border-none hover:bg-foregrounnd")} 
  />
}