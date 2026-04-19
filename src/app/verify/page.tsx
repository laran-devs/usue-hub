"use client"

import * as React from "react"
import { ShieldCheck, Terminal, ArrowRight, Loader2, MailCheck, ShieldAlert } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"

function VerifyContent() {
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState("")
  const [loading, setLoading] = React.useState(false)
  const [success, setSuccess] = React.useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  React.useEffect(() => {
    if (!email) {
      router.push("/login")
    }
  }, [email, router])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token: code }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || "Security mismatch: Invalid code.")
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/")
          router.refresh()
        }, 1500)
      }
    } catch (err) {
      setError("GATEWAY_CONNECT_FAILURE: Sector link unstable.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#1e40af 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-md w-full z-10">
        <div className="bg-slate-950 border border-blue-900/40 rounded-lg overflow-hidden shadow-[0_0_80px_-20px_rgba(37,99,235,0.4)]">
          {/* Diagnostic Header */}
          <div className="bg-blue-950/20 border-b border-blue-900/30 p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest italic">Identity Verification Module</span>
            </div>
            <span className="text-[9px] font-mono text-blue-800 animate-pulse">Awaiting Code...</span>
          </div>

          <div className="p-10 space-y-10">
            <div className="text-center space-y-4">
              <div className="inline-flex h-20 w-20 rounded-full bg-blue-900/10 items-center justify-center border border-blue-800/20 relative group">
                <div className="absolute inset-0 rounded-full bg-blue-500/5 animate-ping group-hover:animate-none" />
                {success ? (
                  <ShieldCheck className="h-10 w-10 text-green-500 transition-all scale-110" />
                ) : (
                  <MailCheck className="h-10 w-10 text-blue-600" />
                )}
              </div>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-slate-100 uppercase tracking-wide">Verification Required</h2>
                <p className="text-[10px] text-slate-500 font-mono">
                  Confirm receipt at: <span className="text-blue-500 italic lowercase">{email}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[9px] font-mono text-blue-600 uppercase tracking-[0.3em] block text-center">Enter 6-Digit Clearcode</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="000 000"
                  className="w-full bg-slate-900/80 border-2 border-blue-900/30 rounded-lg py-5 px-4 text-3xl text-center text-slate-100 font-black tracking-[0.5em] outline-none focus:border-blue-500/60 focus:shadow-[0_0_20px_rgba(59,130,246,0.1)] transition-all flex items-center justify-center placeholder:text-slate-800"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  disabled={success || loading}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-950/20 border border-red-900/40 rounded flex items-center gap-3 text-red-500 font-mono text-[10px] animate-pulse">
                  <ShieldAlert className="h-4 w-4" />
                  <span className="uppercase">{error}</span>
                </div>
              )}

              {success ? (
                <div className="w-full bg-green-900/20 border border-green-800/40 text-green-400 font-mono text-xs font-bold py-4 rounded flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  IDENTITY VERIFIED. ACCESS GRANTED.
                </div>
              ) : (
                <button
                  type="submit"
                  disabled={loading || code.length < 6}
                  className="w-full bg-blue-700 hover:bg-blue-600 disabled:opacity-30 text-slate-100 font-mono text-xs font-bold py-5 rounded-lg flex items-center justify-center gap-3 transition-all border border-blue-400/30 active:scale-95 shadow-[0_0_40px_-5px_rgba(29,78,216,0.2)]"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>DECODE & VERIFY <ArrowRight className="h-4 w-4" /></>}
                </button>
              )}
            </form>

            <div className="text-center">
              <Link 
                href="/register" 
                className="text-[9px] font-mono text-slate-600 hover:text-blue-500 transition-colors uppercase tracking-[0.2em]"
              >
                &lt; Return to registration terminal
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-6 opacity-20 filter grayscale">
           <div className="h-6 w-12 bg-slate-800 rounded-sm" />
           <div className="h-6 w-12 bg-slate-800 rounded-sm" />
           <div className="h-6 w-12 bg-slate-800 rounded-sm" />
        </div>
      </div>
    </div>
  )
}

export default function VerifyPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
      </div>
    }>
      <VerifyContent />
    </React.Suspense>
  )
}
