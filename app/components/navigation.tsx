'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link 
      href={href}
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive 
          ? "bg-[#1a1625]/80 text-[#e4e0ec]" 
          : "text-gray-400 hover:text-[#e4e0ec] hover:bg-[#1a1625]/40"
        }`}
    >
      {children}
    </Link>
  )
}

export function Navigation() {
  return (
    <nav className="bg-[#1f1b29] border-b border-gray-800/50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/placeholder-logo.svg"
                alt="YT StoryCraft"
                width={32}
                height={32}
                className="opacity-90 hover:opacity-100 transition-opacity"
              />
              <span className="text-[#e4e0ec]/90 font-medium">YT StoryCraft</span>
            </Link>
          </div>

          {/* Centered Navigation */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center space-x-1">
              <NavLink href="/">Home</NavLink>
              <NavLink href="/story-editor">Story Editor</NavLink>
              <NavLink href="/voiceover">Voiceover</NavLink>
            </div>
          </div>

          {/* Profile/Social Icons */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full bg-[#1a1625]/40 hover:bg-[#1a1625]/60 transition-colors">
              <Image 
                src="/placeholder-user.jpg"
                alt="Profile"
                width={28}
                height={28}
                className="rounded-full opacity-90 hover:opacity-100 transition-opacity"
              />
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
