"use client"

import * as React from "react"
import { ShieldAlert, Terminal, Lock, Mail, ArrowRight, Loader2, Key, UserCheck } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error === "UNVERIFIED_IDENTITY") {
          router.push(`/verify?email=${encodeURIComponent(email)}`)
        } else {
          setError(data.message || "Login sequence failed.")
        }
      } else {
        router.push("/")
        router.refresh()
      }
    } catch (err) {
      setError("GATEWAY_CONNECT_FAILURE: Sector unreachable.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Scanline Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,100,255,0.1)_50%,transparent)] bg-[size:100%_4px] animate-scanline" />
      </div>

      <div className="max-w-md w-full z-10">
        <div className="bg-slate-950 border border-blue-900/30 rounded-lg overflow-hidden shadow-[0_0_60px_-15px_rgba(30,58,138,0.6)]">
          {/* Top Status Bar */}
          <div className="bg-blue-950/20 border-b border-blue-900/30 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">Gateway Authentication</span>
            </div>
            <div className="flex gap-1.5 px-2">
              <div className="h-2 w-2 rounded-full bg-red-900/50" />
              <div className="h-2 w-2 rounded-full bg-yellow-900/50" />
              <div className="h-2 w-2 rounded-full bg-green-900/50 animate-pulse" />
            </div>
          </div>

          <div className="p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="relative inline-block">
                <div className="h-20 w-20 rounded-2xl bg-blue-950/30 flex items-center justify-center border border-blue-700/20 shadow-[0_0_30px_rgba(59,130,246,0.1)] transition-transform hover:scale-105 duration-500">
                  <Lock className="h-10 w-10 text-blue-600 animate-pulse" />
                </div>
                <div className="absolute -top-1 -right-1">
                  <ShieldAlert className="h-5 w-5 text-red-600 animate-bounce" />
                </div>
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl font-black text-slate-100 tracking-tighter uppercase italic">Access Restricted</h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-wider">
                  IDENTITY VERIFICATION REQUIRED FOR SECTOR ENTRY
                </p>
              </div>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[8px] font-mono text-blue-600 uppercase tracking-[0.2em] ml-1">Academic Identifier</label>
                  <div className="relative group">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="USER@USUE.RU"
                      className="w-full bg-slate-900/50 border border-blue-900/20 rounded py-3.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-all font-mono uppercase placeholder:lowercase"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[8px] font-mono text-blue-600 uppercase tracking-[0.2em] ml-1">Security Keyphrase</label>
                  <div className="relative group">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-900/50 border border-blue-900/20 rounded py-3.5 pl-10 pr-4 text-sm text-slate-200 outline-none focus:border-blue-500/50 transition-all font-mono"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-950/20 border border-red-900/30 rounded flex items-center gap-3 text-red-500 font-mono text-[10px] animate-in fade-in slide-in-from-top-2">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span className="uppercase">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-slate-100 font-mono text-xs font-bold py-4 rounded flex items-center justify-center gap-3 transition-all border border-blue-400/20 shadow-[0_0_30px_-10px_rgba(37,99,235,0.5)] active:scale-[0.97]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-200" />
                ) : (
                  <>
                    <UserCheck className="h-4 w-4" />
                    AUTHORIZE ENTRY
                  </>
                )}
              </button>
            </form>

            <div className="pt-6 flex flex-col items-center gap-4">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-900/20 to-transparent" />
              <div className="flex items-center gap-4">
                <Link 
                  href="/register" 
                  className="text-[10px] font-mono text-slate-500 hover:text-blue-400 transition-colors uppercase tracking-widest flex items-center gap-1.5 group"
                >
                  Request Clearance
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-[10px] text-slate-700 font-mono uppercase tracking-[0.3em] opacity-30">
          Secure Academic Sector // USUE.HUB v0.1.0-alpha
        </p>
      </div>
    </div>
  )
}
