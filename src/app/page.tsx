

"use client";

import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function EntryPortal() {
  const { login, authenticated, ready } = usePrivy();
  const router = useRouter();

  useEffect(() => {
    if (ready && authenticated) {
      router.push("/feed");
    }
  }, [ready, authenticated, router]);

  return (
    /* The container uses justify-between to push the title to the top and button to the bottom */
    <main className="relative flex h-screen w-screen flex-col items-center justify-between bg-black px-8 py-16 overflow-hidden font-sans">
      
      {/* 1. TOP BRANDING (Matches "Project I" position) */}
      <nav className="z-10 pt-4">
        <h2 className="text-white text-lg font-bold tracking-tight"></h2>
      </nav>

      {/* 2. CENTER TEXT (Matches "Own Your Identity" style) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center text-center space-y-2"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
         PORTAL
        </h1>
        <p className="text-zinc-500 text-xs tracking-[0.4em] uppercase font-bold pt-4">
            Powered by Project ɪ
        </p>
      </motion.div>

      {/* 3. BOTTOM BUTTON (Exact match to your screenshot) */}
      <div className="z-10 w-full max-w-[280px]">
        {!ready ? (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-zinc-700" size={32} />
          </div>
        ) : !authenticated ? (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => login()}
            className="w-full h-[64px] bg-white text-black text-lg font-bold rounded-full transition-all flex items-center justify-center shadow-2xl"
          >
            Continue
          </motion.button>
        ) : (
          <div className="flex justify-center py-6">
            <Loader2 className="animate-spin text-cyan-500" size={24} />
          </div>
        )}
      </div>

      {/* 4. BACKGROUND STYLING (Silk/Wave Effect) */}
      {/* This creates that subtle depth you see at the bottom of your image */}
      <div className="absolute bottom-0 left-0 w-full h-[40%] bg-gradient-to-t from-zinc-900/40 to-transparent pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[radial-gradient(circle,rgba(24,24,27,1)_0%,rgba(0,0,0,1)_70%)] pointer-events-none" />
      
    </main>
  );
}