
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
  User as UserIcon,
  Loader2,
  Hexagon,
  Home,
  Search,
  Bell,
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
      const result = await getShieldedFeed({ limit: 8, afterId });
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
    if (ready && authenticated) fetchPosts();
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
      { threshold: 0.2, rootMargin: "400px" }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [posts, hasMore, loading]);

  useEffect(() => {
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="min-h-[100dvh] bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[100dvh] bg-black text-white overscroll-y-contain">
      {/* Fixed Top Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-zinc-900 px-3 py-3">
        <div className="flex items-center justify-between max-w-[420px] mx-auto">
          <div className="flex items-center gap-2">
            <Hexagon className="text-blue-500" size={26} />
            <span className="text-xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              PORTAL
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-1.5 text-zinc-300 hover:text-white">
              <Search size={24} />
            </button>
            <button className="p-1.5 text-zinc-300 hover:text-white relative">
              <Bell size={24} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Feed Content */}
      <main className="flex-1 pt-[72px] pb-[calc(100px + env(safe-area-inset-bottom,0px))] overflow-y-auto">
        {posts.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-zinc-500">
            <Hexagon size={64} className="mb-6 opacity-60" />
            <p className="text-xl font-medium">No posts yet</p>
            <p className="mt-2 text-sm">Create something awesome</p>
          </div>
        )}

        {posts.map((post, index) => {
          const isVideo =
            post.media_type?.startsWith("video") ||
            post.content_url?.toLowerCase().endsWith(".mp4") ||
            post.content_url?.toLowerCase().endsWith(".mov");

          const author = {
            name: post.author_name || "Anonymous",
            handle: post.author_did?.slice(-8) || "@unknown",
            avatar: post.author_avatar || null,
            verified: true,
            time: new Date(post.created_at).toLocaleString([], {
              hour: "numeric",
              minute: "2-digit",
              hour12: true,
            }),
          };

          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b border-zinc-900 last:border-b-0"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10">
                    <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 p-0.5">
                      {user?.picture ? (
                        <img
                          src={user.picture as string} // ← FIXED: type assertion
                          alt=""
                          className="w-full h-full rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <UserIcon className="w-full h-full p-2 text-white" />
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-black" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-base">{author.name}</span>
                      {author.verified && <span className="text-blue-400 text-xs">✓</span>}
                    </div>
                    <p className="text-xs text-zinc-500">
                      {author.handle} · {author.time}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-zinc-400">
                  <MoreVertical size={20} />
                </button>
              </div>

              {post.caption && (
                <p className="px-4 pb-2 text-[15px] leading-relaxed">{post.caption}</p>
              )}

              {post.signed_url && (
                <div className="bg-black">
                  {isVideo ? (
                    <video
                      src={post.signed_url}
                      controls
                      playsInline
                      className="w-full h-auto max-h-[80vh] object-contain"
                    />
                  ) : (
                    <img
                      src={post.signed_url}
                      alt=""
                      className="w-full h-auto object-contain"
                      loading="lazy"
                    />
                  )}
                </div>
              )}

              <div className="flex items-center justify-between px-5 py-3">
                <div className="flex gap-10">
                  <button className="flex items-center gap-1.5 text-zinc-300 hover:text-red-400">
                    <Heart size={26} />
                    <span className="text-sm">0</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-zinc-300 hover:text-blue-400">
                    <MessageCircle size={26} />
                    <span className="text-sm">0</span>
                  </button>
                  <button className="flex items-center gap-1.5 text-zinc-300 hover:text-green-400">
                    <Share2 size={26} />
                  </button>
                </div>
                <button className="text-zinc-300 hover:text-amber-400">
                  <Diamond size={26} />
                </button>
              </div>
            </motion.article>
          );
        })}

        {loading && (
          <div className="py-10 flex justify-center">
            <Loader2 className="animate-spin text-blue-500" size={36} />
          </div>
        )}

        <div ref={loaderRef} className="h-32" />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-lg border-t border-zinc-900">
        <div className="h-[env(safe-area-inset-bottom,0px)] bg-black/95" />
        <div className="flex justify-between items-center px-4 py-2 max-w-[420px] mx-auto">
          <Link href="/feed" className="flex flex-col items-center text-white active:opacity-70">
            <Home size={28} />
            <span className="text-[10px] mt-0.5 font-medium">Home</span>
          </Link>
          <Link href="/explore" className="flex flex-col items-center text-zinc-400 active:opacity-70">
            <Search size={28} />
            <span className="text-[10px] mt-0.5 font-medium">Explore</span>
          </Link>
          <button
            onClick={() => router.push("/studio")}
            className="relative -mt-14 bg-gradient-to-r from-blue-600 to-cyan-600 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl active:scale-95 transition"
          >
            <Plus size={34} className="text-white" strokeWidth={2.5} />
          </button>
          <Link href="/notifications" className="flex flex-col items-center text-zinc-400 active:opacity-70 relative">
            <Bell size={28} />
            <span className="text-[10px] mt-0.5 font-medium">Activity</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-zinc-400 active:opacity-70">
            <UserIcon size={28} />
            <span className="text-[10px] mt-0.5 font-medium">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}