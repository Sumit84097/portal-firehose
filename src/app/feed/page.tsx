
// "use client";

// import { motion } from "framer-motion";
// import { usePrivy } from "@privy-io/react-auth";
// import { 
//   Heart, MessageCircle, Send, Bookmark, MoreHorizontal, 
//   Lock, Home, Search, Bell, User as UserIcon, Plus, Menu, Loader2 
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import { getShieldedFeed } from "@/app/actions/get-feed";

// export default function PortalFeed() {
//   const { authenticated, ready, user } = usePrivy();
//   const router = useRouter();
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);
//   const loaderRef = useRef<HTMLDivElement>(null);

//   // Logic remains identical to your working version
//   const fetchPosts = async (afterId?: string | null) => {
//     if (!hasMore) return;
//     setLoading(true);
//     try {
//       const result = await getShieldedFeed({ limit: 10, afterId });
//       if (!result.success || !result.data?.length) { setHasMore(false); return; }
//       setPosts((prev) => [...prev, ...result.data]);
//     } catch (err) { setHasMore(false); } finally { setLoading(false); }
//   };

//   useEffect(() => { if (ready && authenticated) fetchPosts(); }, [ready, authenticated]);

//   if (!ready) return null;

//   return (
//     <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden flex flex-col">
      
//       {/* 1. HEADER: Strictly 3 columns using Grid so items CANNOT overlap */}
//       <header className="h-14 border-b border-white/10 grid grid-cols-3 items-center px-4 shrink-0 bg-black z-50">
//         <div className="flex justify-start">
//           <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 overflow-hidden flex items-center justify-center">
//              {user?.google?.picture ? (
//                <img src={user.google.picture as string} className="w-full h-full object-cover" />
//              ) : ( <UserIcon size={16} className="text-zinc-500"/> )}
//           </div>
//         </div>
        
//         <div className="flex justify-center">
//           <h1 className="text-[12px] font-black tracking-[0.4em] uppercase">PORTAL</h1>
//         </div>
        
//         <div className="flex justify-end">
//           <button className="p-1"><Menu size={24} /></button>
//         </div>
//       </header>

//       {/* 2. SCROLLABLE FEED: Independent scroll container */}
//       <main className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-hide pb-20">
//         {posts.map((post) => (
//           <div key={post.id} className="w-full border-b border-white/5 mb-4">
            
//             {/* Post Header */}
//             <div className="flex items-center justify-between px-4 py-3">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-full bg-zinc-800 overflow-hidden">
//                   {post.author_avatar ? (
//                     <img src={post.author_avatar} className="w-full h-full object-cover" />
//                   ) : ( <div className="w-full h-full bg-zinc-900" /> )}
//                 </div>
//                 <div className="flex flex-col">
//                   <span className="text-sm font-bold leading-none">@{post.author_username}</span>
//                   <span className="text-[10px] text-zinc-500 mt-1 uppercase font-medium">
//                     {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
//                   </span>
//                 </div>
//               </div>
//               <MoreHorizontal size={20} className="text-zinc-500" />
//             </div>

//             {/* Content Image: Exact Square */}
//             <div className="w-full aspect-square bg-zinc-950 flex items-center justify-center">
//               {post.signed_url && (
//                 <img src={post.signed_url} className="w-full h-full object-cover" alt="artifact" />
//               )}
//             </div>

//             {/* Actions Bar */}
//             <div className="flex items-center justify-between px-4 py-4">
//               <div className="flex items-center gap-6">
//                 <Heart size={24} strokeWidth={1.5} />
//                 <MessageCircle size={24} strokeWidth={1.5} />
//                 <Send size={24} strokeWidth={1.5} />
//               </div>
//               <Bookmark size={24} strokeWidth={1.5} />
//             </div>

//             {/* Caption & Clean Signature Badge */}
//             <div className="px-4 pb-6 space-y-3">
//               <p className="text-sm leading-snug">
//                 <span className="font-bold mr-2 text-white">@{post.author_username}</span>
//                 <span className="text-zinc-300">{post.caption}</span>
//               </p>
              
//               {/* Reset Signature Badge: No overlapping possible */}
//               <div className="inline-flex items-center gap-2 bg-zinc-900 px-2 py-1.5 rounded border border-white/5">
//                 <Lock size={10} className="text-cyan-500" />
//                 <span className="text-[9px] font-mono font-bold text-cyan-500 uppercase tracking-tighter">
//                   Verified Signature: {post.signature?.slice(0, 10)}...
//                 </span>
//               </div>
//             </div>
//           </div>
//         ))}
        
//         {loading && <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>}
//         <div ref={loaderRef} className="h-1" />
//       </main>

//       {/* 3. FLOATING ACTION BUTTON: Positioned relative to the screen, not the feed */}
//       <Link 
//         href="/studio"
//         className="fixed bottom-24 right-6 w-14 h-14 bg-white text-black rounded-2xl flex items-center justify-center shadow-2xl z-50 active:scale-95 transition-transform"
//       >
//         <Plus size={30} strokeWidth={3} />
//       </Link>

//       {/* 4. BOTTOM NAVIGATION: Fixed height, fixed position */}
//       <nav className="h-16 border-t border-white/10 bg-black flex items-center justify-around px-4 shrink-0 z-50">
//         <Link href="/feed" className="text-white"><Home size={26} strokeWidth={2} /></Link>
//         <Search size={26} className="text-zinc-500" strokeWidth={2} />
//         <Bell size={26} className="text-zinc-500" strokeWidth={2} />
//         <Link href="/profile" className="text-zinc-500"><UserIcon size={26} strokeWidth={2} /></Link>
//       </nav>

//     </div>
//   );
// }










"use client";

import { motion } from "framer-motion";
import { usePrivy } from "@privy-io/react-auth";
import {
  Heart,
  MessageCircle,
  Share2,
  Diamond,
  Play,
  User as UserIcon,
  Loader2,
  CheckCircle2,
  Hexagon,
  Home,
  Compass,
  Bell,
  Search,
  MoreVertical,
  Plus,
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

  const fetchPosts = async (afterId?: string | null) => {
    if (!hasMore) return;

    setLoading(true);

    try {
      const result = await getShieldedFeed({
        limit: 10,
        afterId,
      });

      if (!result.success || !result.data?.length) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => [...prev, ...result.data]);
    } catch (err) {
      console.error("Feed fetch failed:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ready && authenticated) {
      fetchPosts();
    }
  }, [ready, authenticated]);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          const lastId = posts[posts.length - 1]?.id;
          fetchPosts(lastId);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [posts, hasMore, loading]);

  useEffect(() => {
    if (ready && !authenticated) {
      router.push("/");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-gray-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-gray-950 text-white pb-safe">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-blue-900/30 px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-md mx-auto">
          <div className="flex items-center gap-3">
            <Hexagon className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" size={32} />
            <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              PORTAL
            </span>
          </div>
          <div className="flex items-center gap-5">
            <button className="text-blue-300 hover:text-white transition-colors">
              <Search size={24} />
            </button>
            <button className="text-blue-300 hover:text-white transition-colors relative">
              <Bell size={24} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
            </button>
          </div>
        </div>
      </header>

      {/* Feed – cinematic, immersive */}
      <main className="pt-20 px-0 max-w-screen-md mx-auto space-y-10">
        {posts.length === 0 && !loading && (
          <div className="text-center py-32 text-slate-400">
            <Hexagon size={64} className="mx-auto mb-6 opacity-40 animate-pulse" />
            <p className="text-xl font-medium">The feed is quiet...</p>
            <p className="mt-2">Create your first moment</p>
          </div>
        )}

        {posts.map((post) => {
          const isVideo = post.media_type?.startsWith("video") ||
                          post.content_url?.toLowerCase().endsWith('.mp4') ||
                          post.content_url?.toLowerCase().endsWith('.mov');

          const author = {
            name: post.author_name || "Anonymous",
            handle: post.author_did?.slice(-8) || "@unknown",
            avatar: post.author_avatar || null,
            verified: true,
            time: new Date(post.created_at).toLocaleString([], { hour: 'numeric', minute: '2-digit', hour12: true })
          };

          return (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-post"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 p-0.5">
                      {user?.picture ? (  // ← FIXED: use top-level user.picture (from Google login)
                        <img
                          src={user.picture}
                          alt="Profile"
                          className="w-full h-full rounded-full object-cover"
                          referrerPolicy="no-referrer"  // Prevents Google referrer blocking
                        />
                      ) : (
                        <UserIcon className="w-full h-full p-2 text-blue-200" />
                      )}
                    </div>
                    <div className="online-dot" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white">{author.name}</h3>
                      {author.verified && <span className="verified-pill">Verified</span>}
                    </div>
                    <p className="text-sm text-zinc-500">{author.handle} • {author.time}</p>
                  </div>
                </div>
                <button className="text-zinc-500 hover:text-white">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Caption if exists */}
              {post.caption && (
                <p className="px-4 pb-3 text-white">{post.caption}</p>
              )}

              {/* Media – full bleed */}
              {post.signed_url && (
                <div className="media-full-bleed aspect-[4/5] overflow-hidden">
                  {isVideo ? (
                    <video
                      src={post.signed_url}
                      controls
                      className="w-full h-full object-cover"
                      playsInline
                    >
                      <source src={post.signed_url} type={post.media_type || "video/mp4"} />
                    </video>
                  ) : (
                    <img
                      src={post.signed_url}
                      alt={post.caption || "Post"}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="action-pill">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-2 text-zinc-300 hover:text-red-400">
                    <Heart size={22} />
                    <span className="font-medium">24</span>
                  </button>
                  <button className="flex items-center gap-2 text-zinc-300 hover:text-blue-400">
                    <MessageCircle size={22} />
                    <span className="font-medium">8</span>
                  </button>
                  <button className="flex items-center gap-2 text-zinc-300 hover:text-green-400">
                    <Share2 size={22} />
                  </button>
                </div>
                <button className="text-zinc-300 hover:text-amber-400">
                  <Diamond size={22} />
                </button>
              </div>
            </motion.div>
          );
        })}

        {loading && (
          <div className="flex justify-center py-8">
            <Loader2 className="animate-spin text-blue-400" size={32} />
          </div>
        )}

        <div ref={loaderRef} className="h-10" />
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-t border-blue-900/30 py-2">
        <div className="flex justify-around max-w-screen-md mx-auto">
          <Link href="/feed" className="flex flex-col items-center text-blue-300">
            <Home size={28} />
          </Link>
          <Link href="/explore" className="flex flex-col items-center text-zinc-500 hover:text-white">
            <Compass size={28} />
          </Link>
          <button
            onClick={() => router.push("/studio")}
            className="glow-plus -mt-6 w-16 h-16 rounded-full flex items-center justify-center text-white"
          >
            <Plus size={32} />
          </button>
          <Link href="/notifications" className="flex flex-col items-center text-zinc-500 hover:text-white relative">
            <Bell size={28} />
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-zinc-500 hover:text-white">
            <UserIcon size={28} />
          </Link>
        </div>
      </nav>
    </div>
  );
}