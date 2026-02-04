
"use client";

import { motion } from "framer-motion";
import { usePrivy } from "@privy-io/react-auth";
import { 
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, 
  Lock, Home, Search, Bell, User as UserIcon, Plus, Menu, Loader2 
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getShieldedFeed } from "@/app/actions/get-feed";

export default function PortalFeed() {
  const { authenticated, ready, user } = usePrivy();
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Logic remains identical to your working version
  const fetchPosts = async (afterId?: string | null) => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const result = await getShieldedFeed({ limit: 10, afterId });
      if (!result.success || !result.data?.length) { setHasMore(false); return; }
      setPosts((prev) => [...prev, ...result.data]);
    } catch (err) { setHasMore(false); } finally { setLoading(false); }
  };

  useEffect(() => { if (ready && authenticated) fetchPosts(); }, [ready, authenticated]);

  if (!ready) return null;

  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden flex flex-col">
      
      {/* 1. HEADER: Strictly 3 columns using Grid so items CANNOT overlap */}
      <header className="h-14 border-b border-white/10 grid grid-cols-3 items-center px-4 shrink-0 bg-black z-50">
        <div className="flex justify-start">
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 overflow-hidden flex items-center justify-center">
             {user?.google?.picture ? (
               <img src={user.google.picture as string} className="w-full h-full object-cover" />
             ) : ( <UserIcon size={16} className="text-zinc-500"/> )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <h1 className="text-[12px] font-black tracking-[0.4em] uppercase">PORTAL</h1>
        </div>
        
        <div className="flex justify-end">
          <button className="p-1"><Menu size={24} /></button>
        </div>
      </header>

      {/* 2. SCROLLABLE FEED: Independent scroll container */}
      <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-20">
        {posts.map((post) => (
          <div key={post.id} className="w-full border-b border-white/5 mb-4">
            
            {/* Post Header */}
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden">
                  {post.author_avatar ? (
                    <img src={post.author_avatar} className="w-full h-full object-cover" />
                  ) : ( <div className="w-full h-full bg-zinc-900" /> )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold leading-none">@{post.author_username}</span>
                  <span className="text-[10px] text-zinc-500 mt-1 uppercase font-medium">
                    {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
              <MoreHorizontal size={20} className="text-zinc-500" />
            </div>

            {/* Content Image: Exact Square */}
            <div className="w-full aspect-square bg-zinc-950 flex items-center justify-center">
              {post.signed_url && (
                <img src={post.signed_url} className="w-full h-full object-cover" alt="artifact" />
              )}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between px-4 py-4">
              <div className="flex items-center gap-6">
                <Heart size={24} strokeWidth={1.5} />
                <MessageCircle size={24} strokeWidth={1.5} />
                <Send size={24} strokeWidth={1.5} />
              </div>
              <Bookmark size={24} strokeWidth={1.5} />
            </div>

            {/* Caption & Clean Signature Badge */}
            <div className="px-4 pb-6 space-y-3">
              <p className="text-sm leading-snug">
                <span className="font-bold mr-2 text-white">@{post.author_username}</span>
                <span className="text-zinc-300">{post.caption}</span>
              </p>
              
              {/* Reset Signature Badge: No overlapping possible */}
              <div className="inline-flex items-center gap-2 bg-zinc-900 px-2 py-1.5 rounded border border-white/5">
                <Lock size={10} className="text-cyan-500" />
                <span className="text-[9px] font-mono font-bold text-cyan-500 uppercase tracking-tighter">
                  Verified Signature: {post.signature?.slice(0, 10)}...
                </span>
              </div>
            </div>
          </div>
        ))}
        
        {loading && <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>}
        <div ref={loaderRef} className="h-1" />
      </main>

      {/* 3. FLOATING ACTION BUTTON: Positioned relative to the screen, not the feed */}
      <Link 
        href="/studio"
        className="fixed bottom-24 right-6 w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl z-50 active:scale-95 transition-transform"
      >
        <Plus size={30} strokeWidth={3} />
      </Link>

      {/* 4. BOTTOM NAVIGATION: Fixed height, fixed position */}
      <nav className="h-16 border-t border-white/10 bg-black flex items-center justify-around px-4 shrink-0 z-50">
        <Link href="/feed" className="text-white"><Home size={26} strokeWidth={2} /></Link>
        <Search size={26} className="text-zinc-500" strokeWidth={2} />
        <Bell size={26} className="text-zinc-500" strokeWidth={2} />
        <Link href="/profile" className="text-zinc-500"><UserIcon size={26} strokeWidth={2} /></Link>
      </nav>

    </div>
  );
}