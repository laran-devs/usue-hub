"use client"

import * as React from "react"
import {
  LayoutGrid,
  Users,
  MessageSquare,
  BookOpen,
  Calendar,
  Shield,
  Search,
  Hash
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import { Input } from "@/components/ui/input"

const items = [
  {
    title: "Стена",
    url: "/",
    icon: LayoutGrid,
  },
  {
    title: "Преподы (Рейтинг)",
    url: "/teachers",
    icon: Users,
  },
  {
    title: "Чаты институтов",
    url: "/chats",
    icon: Hash,
  },
  {
    title: "База знаний",
    url: "/files",
    icon: BookOpen,
  },
  {
    title: "Расписание",
    url: "/schedule",
    icon: Calendar,
  },
]

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-blue-900/30 bg-black">
      <SidebarHeader className="border-b border-blue-900/20 p-4">
        <div className="flex items-center gap-2 px-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-700/20 text-blue-400">
            <Shield className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none">
            <span className="font-semibold text-blue-100 tracking-tight">USUE.HUB</span>
            <span className="text-[10px] text-blue-500 uppercase font-mono">Anonymous Layer 0</span>
          </div>
        </div>
        <div className="mt-4 px-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input
              placeholder="Поиск по порталу..."
              className="h-9 w-full bg-slate-900/50 pl-8 border-slate-800 text-xs focus:border-blue-700/50"
            />
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-blue-900/80 font-mono text-[10px] uppercase tracking-wider">Навигация</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    render={<a href={item.url} />}
                    className="hover:bg-blue-950/40 hover:text-blue-400 transition-colors"
                  >
                    <item.icon className="h-4 w-4" />
                    <span className="text-sm">{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  )
}
