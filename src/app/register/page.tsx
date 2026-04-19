"use client"

import * as React from "react"
import { ShieldAlert, Terminal, Lock, Mail, UserPlus, ArrowRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Registration sequence failed.")
      } else {
        // Direct to verification stage
        router.push(`/verify?email=${encodeURIComponent(email)}`)
      }
    } catch (err) {
      setError("GATEWAY_CONNECTION_ERROR: Check your local uplink.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,100,255,0.1)_50%,transparent)] bg-[size:100%_4px] animate-scanline" />
      </div>

      <div className="max-w-md w-full z-10">
        <div className="bg-slate-950 border border-blue-900/30 rounded-lg overflow-hidden shadow-[0_0_50px_-12px_rgba(30,58,138,0.5)]">
          {/* Header Bar */}
          <div className="bg-blue-950/20 border-b border-blue-900/30 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest text-shadow-glow">New Entity Registration</span>
            </div>
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse" />
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8 space-y-2">
              <h1 className="text-xl font-bold text-slate-100 tracking-tight flex items-center gap-2">
                ACADEMIC CLEARANCE
              </h1>
              <p className="text-xs text-slate-500 font-mono italic">
                Identification required for sector access. 
                Use your <span className="text-blue-500">@usue.ru</span> terminal.
              </p>
            </div>

            <form onSubmit={handleRegister} className="space-y-5">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-blue-500 uppercase tracking-widest pl-1">Email Terminal</label>
                <div className="relative group">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="email"
                    required
                    placeholder="student@usue.ru"
                    className="w-full bg-slate-900/50 border border-blue-900/20 rounded-md py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-blue-500 uppercase tracking-widest pl-1">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-600 group-focus-within:text-blue-500 transition-colors" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full bg-slate-900/50 border border-blue-900/20 rounded-md py-3 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500/50 transition-all font-mono"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-950/20 border border-red-900/30 rounded flex items-center gap-3 text-red-500 font-mono text-[10px]">
                  <ShieldAlert className="h-4 w-4 shrink-0" />
                  <span className="uppercase">{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-50 text-slate-50 font-mono text-xs font-bold py-4 px-6 rounded flex items-center justify-center gap-2 transition-all border border-blue-500/30 active:scale-[0.98] shadow-[0_0_20px_-5px_rgba(29,78,216,0.3)]"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-blue-200" />
                ) : (
                  <>
                    INITIALIZE SEQUENCE
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 flex flex-col gap-4 text-center">
              <div className="h-px bg-slate-900" />
              <Link 
                href="/login" 
                className="text-[10px] font-mono text-slate-500 hover:text-blue-400 uppercase tracking-widest transition-colors"
              >
                &lt; Return to Login Terminal
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-1 items-center opacity-40">
           <p className="text-[9px] font-mono text-slate-700 tracking-wider">
             SECURE_COMMUNICATION_PROTOCOL: V2.1
           </p>
           <p className="text-[9px] font-mono text-slate-800">
             // IDENTITY_ENCRYPTED // USUE.HUB
           </p>
        </div>
      </div>
    </div>
  )
}
