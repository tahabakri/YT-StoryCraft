'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

export function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link 
      href={href}
      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
        ${isActive 
          ? "bg-[#1a1625] text-white" 
          : "text-gray-300 hover:text-white hover:bg-[#1a1625]/50"
        }`}
    >
      {children}
    </Link>
  )
}
