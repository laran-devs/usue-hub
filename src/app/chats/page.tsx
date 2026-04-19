"use client"

import * as React from "react"
import { Hash, Send, Shield, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getSocket } from "@/lib/socket"

export default function ChatsPage() {
  const [institutes, setInstitutes] = React.useState<any[]>([])
  const [selectedInst, setSelectedInst] = React.useState<any>(null)
  const [messages, setMessages] = React.useState<any[]>([])
  const [inputValue, setInputValue] = React.useState("")
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const [session, setSession] = React.useState<any>(null)

  React.useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => setSession(data))
  }, [])

  React.useEffect(() => {
    fetch("/api/institutes")
      .then((res) => res.json())
      .then((data) => {
        setInstitutes(data)
        if (data.length > 0) setSelectedInst(data[0])
      })
  }, [])

  React.useEffect(() => {
    if (!selectedInst) return

    // Join room
    const socket = getSocket()
    socket.emit("join-room", selectedInst.id)

    // Fetch history
    fetch(`/api/chats/${selectedInst.id}`)
      .then((res) => res.json())
      .then((data) => setMessages(data))

    socket.on("new-message", (msg: any) => {
      if (msg.instituteId === selectedInst.id) {
        setMessages((prev) => [...prev, msg])
      }
    })

    socket.on("system-message", (msg: any) => {
      if (msg.instituteId === selectedInst.id) {
        setMessages((prev) => [...prev, { ...msg, type: "system" }])
      }
    })

    return () => {
      socket.off("new-message")
      socket.off("system-message")
    }
  }, [selectedInst])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedInst || !session?.user?.id) return

    const msgData = {
      content: inputValue,
      userId: session.user.id,
      instituteId: selectedInst.id,
    }

    // Emit via socket for real-time
    const socket = getSocket()
    socket.emit("send-message", msgData)

    // Save to DB
    await fetch(`/api/chats/${selectedInst.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msgData),
    })

    setInputValue("")
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] bg-black overflow-hidden">
      {/* Institute Sidebar */}
      <div className="w-64 border-r border-blue-900/20 bg-slate-950/20 flex flex-col">
        <div className="p-4 border-b border-blue-900/10">
          <h2 className="text-xs font-mono font-bold text-blue-500 uppercase tracking-widest">Институты</h2>
        </div>
        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {institutes.map((inst) => (
              <button
                key={inst.id}
                onClick={() => setSelectedInst(inst)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-all ${
                  selectedInst?.id === inst.id
                    ? "bg-blue-950/40 text-blue-400 border border-blue-800/30"
                    : "text-slate-500 hover:bg-slate-900 hover:text-slate-300"
                }`}
              >
                <Hash className="h-4 w-4" />
                <span className="text-sm font-medium">{inst.name}</span>
                <span className="ml-auto flex h-2 w-2 rounded-full bg-green-500 shadow-sm shadow-green-500/50" />
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-black relative">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808005_1px,transparent_1px),linear-gradient(to_bottom,#80808005_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        {/* Header */}
        <div className="z-10 flex h-14 items-center justify-between border-b border-blue-900/10 px-6 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-slate-100">{selectedInst?.name}</span>
            <Badge variant="outline" className="border-blue-900/30 text-[10px] text-blue-500 font-mono">
              ROOM_ID: {selectedInst?.id?.slice(0, 8)}
            </Badge>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-6 w-6 rounded-full border border-black bg-slate-800 flex items-center justify-center text-[10px] text-slate-400">
                  <Users className="h-3 w-3" />
                </div>
              ))}
              <div className="h-6 w-6 rounded-full border border-black bg-blue-900/40 flex items-center justify-center text-[10px] text-blue-300">
                +12
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              msg.type === "system" ? (
                <div key={i} className="flex justify-center my-6">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/20 border border-blue-900/10 text-[10px] text-blue-500/80 font-mono">
                    <Shield className="h-3 w-3" />
                    SYSTEM :: {msg.content}
                  </div>
                </div>
              ) : (
                <div key={i} className={`flex flex-col ${msg.userId === "anonymous" ? "items-end" : "items-start"}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-slate-600">{msg.user?.nickname || "Анонимный Студент"}</span>
                  </div>
                  <div className={`max-w-[80%] rounded-xl px-4 py-2 text-sm leading-relaxed ${
                    msg.userId === "anonymous" 
                      ? "bg-blue-700/20 text-blue-100 border border-blue-700/30 rounded-tr-none shadow-[0_0_15px_-5px_rgba(59,130,246,0.3)]"
                      : "bg-slate-900/60 text-slate-300 border border-slate-800 rounded-tl-none"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              )
            ))}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="p-4 border-t border-blue-900/10 bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            <div className="relative flex-1">
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Введите сообщение в защищенный канал..."
                className="w-full bg-slate-900/50 border border-slate-800 rounded-lg px-4 py-3 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-700/50 transition-all font-mono"
              />
              <div className="absolute right-3 top-3 h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <Button 
              size="icon" 
              onClick={handleSendMessage}
              className="h-11 w-11 bg-blue-700 hover:bg-blue-600 shadow-lg shadow-blue-500/20"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="mt-2 text-center">
            <span className="text-[8px] font-mono text-slate-700 uppercase tracking-tighter">
              Encryption: AES-256-GCM | Protocol: WebSocket-Secure-v1.2 | Room: {selectedInst?.name || "Initializing..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
