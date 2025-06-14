"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Headphones, Home, MessageSquare, Brain, Activity, Trophy } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AppSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Sidebar
      defaultOpen={true}
      collapsible={collapsed ? "icon" : "none"}
      className="border-r border-[#2B2F34] bg-[#1A1D21]"
    >
      <SidebarHeader className="py-4 px-2 border-b border-[#2B2F34]">
        <div className="flex items-center px-2">
          <div className="w-8 h-8 rounded-full bg-[#51AF30] flex items-center justify-center mr-2">
            <span className="text-white font-bold">OTP</span>
          </div>
          <div className="font-semibold text-white">Sales Insight AI</div>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2 py-2">
        <nav className="space-y-1">
          <NavItem href="/" icon={Home} label="Dashboard" active={pathname === "/"} />
          <NavItem
            href="/sparring-arena"
            icon={Trophy}
            label="Sparring Arena"
            active={pathname === "/sparring-arena"}
          />
          <NavItem 
            href="/ai-coach" 
            icon={Brain} 
            label="AI Coach" 
            active={pathname === "/ai-coach"}
          />
          <NavItem 
            href="/live-assist" 
            icon={MessageSquare} 
            label="Live Assist" 
            active={pathname === "/live-assist"}
          />
          <NavItem href="#" icon={Headphones} label="My Recordings" />
          <NavItem 
            href="/stats" 
            icon={Activity} 
            label="Stats" 
            active={pathname === "/stats"}
          />
          <NavItem href="/leaderboard" icon={Trophy} label="Leaderboard" active={pathname === "/leaderboard"} />
        </nav>
      </SidebarContent>
      <SidebarFooter className="border-t border-[#2B2F34] p-4">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/John_Parker.jpg-NPKeWTXdBBJO894tncRpAd8t3fSca5.jpeg"
              alt="John Parker"
            />
            <AvatarFallback className="bg-[#1F2328] text-[#51AF30]">JP</AvatarFallback>
          </Avatar>
          <div>
            <div className="text-sm font-medium text-[#F0F2F5]">John Parker</div>
            <div className="text-xs text-[#A0A4A8]">Sales Representative</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

function NavItem({
  href,
  icon: Icon,
  label,
  active,
}: {
  href: string
  icon: React.ElementType
  label: string
  active?: boolean
}) {
  return (
    <Link href={href} passHref>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          active ? "bg-[#1F2328] text-[#51AF30]" : "text-[#A0A4A8] hover:text-[#F0F2F5] hover:bg-[#1F2328]/50",
        )}
      >
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Button>
    </Link>
  )
}
