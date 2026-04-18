"use client"

import * as React from "react"
import { Bell, ShieldCheck, ShieldAlert, Wifi, LogOut } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"

export function Navbar() {
  const [session, setSession] = React.useState<any>(null)
  const router = useRouter()

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setSession(data))
  }, [])

  const handleLogout = async () => {
    // Add logout API if needed, or just clear cookie
    setSession(null)
    router.push("/login")
  }

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b border-blue-900/20 bg-black/80 backdrop-blur-md px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="border-green-900/50 bg-green-950/20 text-[10px] text-green-500 font-mono">
            <Wifi className="mr-1 h-3 w-3" /> ONLINE
          </Badge>
          <span className="text-xs text-slate-500 font-mono">192.168.0.x</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {session?.authenticated ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 pr-2 border-r border-blue-900/10">
              <span className="text-[10px] text-slate-500 font-mono text-right leading-tight">
                Node: {session.user.id.slice(0, 3)}<br/>
                Auth: <span className="text-blue-400 font-bold">{session.user.nickname}</span>
              </span>
              <Avatar className="h-8 w-8 rounded border border-blue-700/50">
                <AvatarImage src={session.user.avatarUrl} />
                <AvatarFallback className="bg-blue-900/20 text-blue-400">
                  <ShieldCheck className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-red-950/20 text-slate-500 hover:text-red-500 transition-colors">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-slate-500 font-mono text-right leading-tight">
              Node: ???<br/>
              Auth: UNAUTHORIZED
            </span>
            <div className="h-8 w-8 rounded bg-red-900/20 border border-red-700/50 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4 text-red-500" />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
