"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  Settings, 
  Grid, 
  Lock, 
  Loader2, 
  Hexagon, 
  User as UserIcon, 
  ArrowRight,
  LogOut,
  MapPin,
  Calendar,
  Home,
  Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function SovereignProfile() {
  const { user, authenticated, ready, logout } = usePrivy();
  const router = useRouter();

  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user?.id) return;
      try {
        // 1. Fetch Profile Metadata
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("did", user.id)
          .maybeSingle();
        setProfile(profileData || {});

        // 2. Fetch User's Signed Artifacts
        const { data: arts } = await supabase
          .from("artifacts")
          .select("*")
          .eq("author_did", user.id)
          .order("created_at", { ascending: false });
        setArtifacts(arts || []);
      } catch (err) {
        console.error("Profile fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (ready && authenticated) fetchProfileData();
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, user, router]);

  if (!ready || loading) return (
    <div className="h-screen bg-black flex flex-col items-center justify-center">
      <Loader2 className="animate-spin text-cyan-500" size={32} />
      <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mt-4">Syncing Identity...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white font-sans pb-32">
      
      {/* HEADER NAV */}
      <nav className="flex items-center justify-between px-6 py-6 border-b border-white/5">
        <h2 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Identity Node</h2>
        <div className="flex items-center gap-4">
            <Link href="/terminal" className="text-cyan-400"><Settings size={20} strokeWidth={1.5} /></Link>
            <button onClick={() => logout()} className="text-zinc-600"><LogOut size={20} strokeWidth={1.5} /></button>
        </div>
      </nav>

      <main className="max-w-lg mx-auto px-6 pt-10">
        
        {/* PROFILE INFO */}
        <header className="flex flex-col items-center text-center mb-12">
            <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/10 p-1">
                    {user?.google?.picture ? (
                        <img src={user.google.picture as string} className="w-full h-full rounded-full object-cover" alt="avatar" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-zinc-700"><UserIcon size={40}/></div>
                    )}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-black p-1.5 rounded-full border-4 border-black">
                    <ShieldCheck size={14} strokeWidth={3} />
                </div>
            </div>

            <h1 className="text-2xl font-black tracking-tight mb-1">@{profile?.username || "anonymous"}</h1>
            <p className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest mb-6">DID: {user?.id.slice(0, 20)}...</p>
            
            <div className="flex items-center gap-6 text-zinc-500 text-xs">
                <div className="flex items-center gap-1"><Calendar size={12} /><span>Joined 2026</span></div>
                <div className="flex items-center gap-1"><MapPin size={12} /><span>India Node</span></div>
            </div>
        </header>

        {/* BENTO STATS */}
        <div className="grid grid-cols-2 gap-3 mb-12">
            <div className="bg-zinc-950 border border-white/5 p-6 rounded-3xl">
                <p className="text-zinc-600 text-[9px] uppercase font-black tracking-widest mb-1">Artifacts</p>
                <p className="text-2xl font-black">{artifacts.length}</p>
            </div>
            <Link href="/terminal" className="bg-zinc-950 border border-cyan-500/10 p-6 rounded-3xl group">
                <p className="text-cyan-500/50 text-[9px] uppercase font-black tracking-widest mb-1 flex items-center justify-between">
                    Sovereignty <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                </p>
                <p className="text-2xl font-black text-cyan-400 tracking-tighter">Terminal</p>
            </Link>
        </div>

        {/* THE GALLERY GRID */}
        <div className="flex items-center gap-2 mb-6 text-zinc-500">
            <Grid size={16} />
            <span className="text-[10px] uppercase font-black tracking-widest">Signed Gallery</span>
        </div>

        <div className="grid grid-cols-3 gap-1">
            {artifacts.length > 0 ? (
                artifacts.map((art) => (
                    <motion.div 
                        key={art.id} 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }}
                        className="aspect-square bg-zinc-900 border border-white/5 relative group cursor-pointer overflow-hidden"
                    >
                        {art.content_url && (
                            <img src={art.content_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        )}
                        <div className="absolute inset-0 bg-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Lock size={16} className="text-cyan-400" />
                        </div>
                    </motion.div>
                ))
            ) : (
                <div className="col-span-3 py-20 text-center border border-dashed border-zinc-800 rounded-3xl">
                    <p className="text-zinc-700 text-[10px] uppercase font-bold tracking-widest">No Artifacts Signed</p>
                </div>
            )}
        </div>
      </main>

      {/* BOTTOM NAV BAR (Shared with Feed) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/95 backdrop-blur-md border-t border-white/5 h-16 z-50">
        <div className="max-w-lg mx-auto h-full px-12 flex items-center justify-between">
          <Link href="/feed" className="text-zinc-600 hover:text-white transition-colors"><Home size={24} /></Link>
          <Link href="/studio" className="relative -top-4 w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center shadow-xl"><Plus size={28} strokeWidth={3} /></Link>
          <Link href="/profile" className="text-white"><UserIcon size={24} strokeWidth={2.5} /></Link>
        </div>
      </nav>

    </div>
  );
}