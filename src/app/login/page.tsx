"use client"

import * as React from "react"
import { ShieldAlert, Terminal, Lock } from "lucide-react"

export default function LoginPage() {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    // Standard Telegram Login Widget script
    const script = document.createElement("script")
    // Use internal proxy to bypass regional blocks on telegram.org
    script.src = "/api/telegram-script";
    script.setAttribute("data-telegram-login", process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "bot_name")
    script.setAttribute("data-size", "large")
    script.setAttribute("data-radius", "8")
    script.setAttribute("data-auth-url", "/api/auth/telegram")
    script.setAttribute("data-request-access", "write")
    script.async = true

    script.onerror = () => {
      console.error("Critical: Telegram Gateway Script blocked even via proxy.");
    };

    if (containerRef.current) {
      containerRef.current.appendChild(script)
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = ""
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Matrix-like background effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,100,255,0.1)_50%,transparent)] bg-[size:100%_4px] animate-scanline" />
      </div>

      <div className="max-w-md w-full z-10">
        <div className="bg-slate-950 border border-blue-900/30 rounded-lg overflow-hidden shadow-[0_0_50px_-12px_rgba(30,58,138,0.5)]">
          {/* Header */}
          <div className="bg-blue-950/20 border-b border-blue-900/30 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-blue-500" />
              <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">Gateway Initialization</span>
            </div>
            <div className="flex gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-900/50" />
              <div className="h-2 w-2 rounded-full bg-yellow-900/50" />
              <div className="h-2 w-2 rounded-full bg-green-900/50" />
            </div>
          </div>

          <div className="p-8 space-y-8 text-center">
            <div className="relative inline-block">
              <div className="h-20 w-20 rounded-2xl bg-blue-950/30 flex items-center justify-center border border-blue-700/20 shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <Lock className="h-10 w-10 text-blue-600 animate-pulse" />
              </div>
              <div className="absolute -top-1 -right-1">
                <ShieldAlert className="h-5 w-5 text-red-600" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-slate-100 tracking-tight">ACCESS RESTRICTED</h1>
              <p className="text-sm text-slate-500 font-mono">
                Unauthorized entry to USUE.HUB is strictly prohibited. 
              </p>
            </div>

            <div className="flex flex-col items-center gap-6 py-4">
              {/* Primary Widget (Proxied) */}
              <div ref={containerRef} className="telegram-widget-container min-h-[40px]" />
              
              <div className="flex items-center gap-4 w-full">
                <div className="h-px bg-blue-900/30 flex-1" />
                <span className="text-[9px] font-mono text-blue-900/50 tracking-widest">OR SECURE DEEP LINK</span>
                <div className="h-px bg-blue-900/30 flex-1" />
              </div>

              {/* High-Reliability Fallback Button */}
              <a 
                href={`https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME || "usuehub_bot"}?start=login`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-blue-700 hover:bg-blue-600 text-slate-100 font-mono text-[11px] font-bold py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-all shadow-[0_0_25px_-5px_rgba(29,78,216,0.3)] border border-blue-500/30 group active:scale-95"
              >
                <Lock className="h-3.5 w-3.5 group-hover:text-blue-300 transition-colors" />
                ENTER VIA SECURE GATEWAY
              </a>

              <div className="space-y-1">
                <p className="text-[10px] text-blue-800 font-mono leading-tight">
                  * Use Gateway if the widget is blocked by ISP.
                </p>
                <p className="text-[10px] text-blue-900/40 font-mono italic">
                  Identity anonymized upon entry.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-blue-900/10">
              <div className="flex flex-col gap-1 text-[9px] font-mono text-slate-700 items-start uppercase">
                <span>&gt; STAGE: AUTHENTICATION_WAIT</span>
                <span>&gt; ENCRYPTION: ACTIVE</span>
                <span>&gt; ORIGIN: EXTERNAL_BOT_GATEWAY</span>
              </div>
            </div>
          </div>
        </div>
        
        <p className="mt-8 text-center text-[10px] text-slate-700 font-mono">
          SECURE SECTOR // USUE.HUB v0.1.0-alpha
        </p>
      </div>
    </div>
  )
}
