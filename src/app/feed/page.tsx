
// "use client";

// import { motion } from "framer-motion";
// import { usePrivy } from "@privy-io/react-auth";
// import {
//   Heart,
//   MessageCircle,
//   Share2,
//   Diamond,
//   Play,
//   User as UserIcon,
//   Loader2,
//   CheckCircle2,
//   Hexagon,
//   Home,
//   Compass,
//   Bell,
//   Search,
//   MoreVertical,
//   Plus,
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

//   const fetchPosts = async (afterId?: string | null) => {
//     if (!hasMore) return;

//     setLoading(true);

//     try {
//       const result = await getShieldedFeed({
//         limit: 10,
//         afterId,
//       });

//       if (!result.success || !result.data?.length) {
//         setHasMore(false);
//         return;
//       }

//       setPosts((prev) => [...prev, ...result.data]);
//     } catch (err) {
//       console.error("Feed fetch failed:", err);
//       setHasMore(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (ready && authenticated) {
//       fetchPosts();
//     }
//   }, [ready, authenticated]);

//   // Infinite scroll
//   useEffect(() => {
//     if (!loaderRef.current || !hasMore) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !loading) {
//           const lastId = posts[posts.length - 1]?.id;
//           fetchPosts(lastId);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     observer.observe(loaderRef.current);
//     return () => observer.disconnect();
//   }, [posts, hasMore, loading]);

//   useEffect(() => {
//     if (ready && !authenticated) {
//       router.push("/");
//     }
//   }, [ready, authenticated, router]);

//   if (!ready) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <Loader2 className="animate-spin text-cyan-500" size={48} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black to-gray-950 text-white pb-20">
//       {/* Header / Top Bar */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3">
//         <div className="flex items-center justify-between max-w-screen-md mx-auto">
//           <div className="flex items-center gap-2">
//             <Hexagon className="text-cyan-400" size={28} />
//             <span className="text-xl font-black tracking-tight">PORTAL</span>
//           </div>
//           <div className="flex items-center gap-4">
//             <button className="text-gray-400 hover:text-white">
//               <Search size={24} />
//             </button>
//             <button className="text-gray-400 hover:text-white">
//               <Bell size={24} />
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Feed Content */}
//       <main className="pt-16 px-3 max-w-screen-md mx-auto">
//         {posts.length === 0 && !loading && (
//           <div className="text-center py-20 text-gray-500">
//             No posts yet. Be the first to create something.
//           </div>
//         )}

//         {posts.map((post) => {
//           const isVideo = post.media_type?.startsWith("video") ||
//                           post.content_url?.toLowerCase().endsWith('.mp4') ||
//                           post.content_url?.toLowerCase().endsWith('.mov');

//           const author = {
//             name: post.author_name || "Anonymous",
//             handle: post.author_did?.slice(-8) || "@unknown",
//             avatar: post.author_avatar || null,
//             verified: true,
//             time: new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
//           };

//           return (
//             <motion.article
//               key={post.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="mb-6 bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden"
//             >
//               {/* Post Header */}
//               <div className="flex items-center justify-between px-4 pt-4 pb-2">
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     {author.avatar ? (
//                       <img
//                         src={author.avatar}
//                         alt={author.name}
//                         className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/30"
//                       />
//                     ) : (
//                       <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
//                         <UserIcon size={20} className="text-gray-400" />
//                       </div>
//                     )}

//                     {author.verified && (
//                       <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-0.5">
//                         <CheckCircle2 size={14} className="text-black" />
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="font-semibold">{author.name}</span>
//                       {author.verified && (
//                         <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">
//                           Verified by Project I
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-gray-400">
//                       <span>@{author.handle}</span>
//                       <span>•</span>
//                       <span>{author.time}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <button className="text-gray-400 hover:text-white">
//                   <MoreVertical size={20} />
//                 </button>
//               </div>

//               {/* Media */}
//               {post.signed_url && (
//                 <div className="relative">
//                   {isVideo ? (
//                     <div className="relative">
//                       <video
//                         src={post.signed_url}
//                         className="w-full h-auto max-h-[500px] object-cover"
//                         loop
//                         muted
//                         playsInline
//                         preload="metadata"
//                       />
//                       <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
//                         <Play size={64} className="text-white drop-shadow-lg" />
//                       </div>
//                     </div>
//                   ) : (
//                     <img
//                       src={post.signed_url}
//                       alt={post.caption || "Post image"}
//                       className="w-full h-auto max-h-[500px] object-cover"
//                     />
//                   )}
//                 </div>
//               )}

//               {/* Caption */}
//               {post.caption && (
//                 <div className="px-4 py-3 text-gray-100">
//                   {post.caption}
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800/50">
//                 <div className="flex items-center gap-6">
//                   <button className="flex items-center gap-1.5 text-gray-400 hover:text-pink-500 transition-colors">
//                     <Heart size={22} />
//                     <span className="text-sm">4.2k</span>
//                   </button>

//                   <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors">
//                     <MessageCircle size={22} />
//                     <span className="text-sm">128</span>
//                   </button>

//                   <button className="flex items-center gap-1.5 text-gray-400 hover:text-green-400 transition-colors">
//                     <Share2 size={22} />
//                     <span className="text-sm">Upload</span>
//                   </button>
//                 </div>

//                 <button className="flex items-center gap-1.5 text-gray-400 hover:text-purple-400 transition-colors">
//                   <Diamond size={22} />
//                   <span className="text-sm">Tip</span>
//                 </button>
//               </div>
//             </motion.article>
//           );
//         })}

//         {/* Loading more */}
//         {loading && (
//           <div className="flex justify-center py-12">
//             <Loader2 className="animate-spin text-cyan-500" size={40} />
//           </div>
//         )}

//         {!hasMore && posts.length > 0 && (
//           <p className="text-center text-gray-500 py-10">End of feed</p>
//         )}

//         <div ref={loaderRef} className="h-20" />
//       </main>

//       {/* Bottom Navigation */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-gray-800/50 z-50">
//         <div className="max-w-screen-md mx-auto flex justify-around items-center py-3">
//           <Link href="/" className="flex flex-col items-center text-cyan-400">
//             <Home size={28} />
//             <span className="text-xs mt-1">Home</span>
//           </Link>

//           <Link href="/explore" className="flex flex-col items-center text-gray-400 hover:text-white">
//             <Compass size={28} />
//             <span className="text-xs mt-1">Explore</span>
//           </Link>

//           <Link href="/studio" className="flex flex-col items-center -mt-10">
//             <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-cyan-500/30">
//               <Plus size={32} className="text-white" />
//             </div>
//           </Link>

//           <Link href="/alerts" className="flex flex-col items-center text-gray-400 hover:text-white">
//             <Bell size={28} />
//             <span className="text-xs mt-1">Alerts</span>
//           </Link>

//           <Link href="/profile" className="flex flex-col items-center text-gray-400 hover:text-white">
//             {user && user.google && typeof (user.google as any).picture === 'string' && (user.google as any).picture ? (
//               <img
//                 src={(user.google as any).picture}
//                 alt="Profile"
//                 className="w-7 h-7 rounded-full object-cover border-2 border-cyan-500/30"
//               />
//             ) : (
//               <UserIcon size={28} />
//             )}
//             <span className="text-xs mt-1">You</span>
//           </Link>
//         </div>
//       </nav>
//     </div>
//   );
// }


// "use client";

// import { motion } from "framer-motion";
// import { usePrivy } from "@privy-io/react-auth";
// import {
//   Heart,
//   MessageCircle,
//   Share2,
//   Diamond,
//   Play,
//   User as UserIcon,
//   Loader2,
//   CheckCircle2,
//   Hexagon,
//   Home,
//   Compass,
//   Bell,
//   Search,
//   MoreVertical,
//   Plus,
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

//   const fetchPosts = async (afterId?: string | null) => {
//     if (!hasMore) return;

//     setLoading(true);

//     try {
//       const result = await getShieldedFeed({
//         limit: 10,
//         afterId,
//       });

//       if (!result.success || !result.data?.length) {
//         setHasMore(false);
//         return;
//       }

//       setPosts((prev) => [...prev, ...result.data]);
//     } catch (err) {
//       console.error("Feed fetch failed:", err);
//       setHasMore(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (ready && authenticated) {
//       fetchPosts();
//     }
//   }, [ready, authenticated]);

//   // Infinite scroll
//   useEffect(() => {
//     if (!loaderRef.current || !hasMore) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting && !loading) {
//           const lastId = posts[posts.length - 1]?.id;
//           fetchPosts(lastId);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     observer.observe(loaderRef.current);
//     return () => observer.disconnect();
//   }, [posts, hasMore, loading]);

//   useEffect(() => {
//     if (ready && !authenticated) {
//       router.push("/");
//     }
//   }, [ready, authenticated, router]);

//   if (!ready) {
//     return (
//       <div className="min-h-screen bg-gradient-to-b from-black to-indigo-950 flex items-center justify-center">
//         <Loader2 className="animate-spin text-cyan-400" size={48} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-purple-950 text-white pb-24">
//       {/* Header / Top Bar */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-cyan-900/30 px-4 py-3">
//         <div className="flex items-center justify-between max-w-screen-md mx-auto">
//           <div className="flex items-center gap-3">
//             <Hexagon className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" size={32} />
//             <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
//               PORTAL
//             </span>
//           </div>
//           <div className="flex items-center gap-5">
//             <button className="text-cyan-300 hover:text-cyan-100 transition-colors">
//               <Search size={24} />
//             </button>
//             <button className="text-cyan-300 hover:text-cyan-100 transition-colors relative">
//               <Bell size={24} />
//               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Main Feed Content */}
//       <main className="pt-20 px-3 max-w-screen-md mx-auto space-y-6">
//         {posts.length === 0 && !loading && (
//           <div className="text-center py-32 text-cyan-200/60">
//             <Hexagon size={64} className="mx-auto mb-6 opacity-50 animate-pulse" />
//             <p className="text-xl font-medium">The firehose is empty...</p>
//             <p className="mt-2">Be the first to ignite it in Studio</p>
//           </div>
//         )}

//         {posts.map((post) => {
//           const isVideo = post.media_type?.startsWith("video") ||
//                           post.content_url?.toLowerCase().endsWith('.mp4') ||
//                           post.content_url?.toLowerCase().endsWith('.mov');

//           const author = {
//             name: post.author_name || "Anonymous Creator",
//             handle: post.author_did?.slice(-8) || "@unknown",
//             avatar: post.author_avatar || null,
//             verified: true,
//             time: new Date(post.created_at).toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'})
//           };

//           return (
//             <motion.article
//               key={post.id}
//               initial={{ opacity: 0, y: 30 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.5 }}
//               className="mb-6 glass overflow-hidden"
//             >
//               {/* Post Header */}
//               <div className="flex items-center justify-between px-5 py-4">
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     {author.avatar ? (
//                       <img
//                         src={author.avatar}
//                         alt={author.name}
//                         className="w-12 h-12 rounded-full object-cover ring-2 ring-cyan-500/40 ring-offset-2 ring-offset-black"
//                       />
//                     ) : (
//                       <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center ring-2 ring-cyan-500/40 ring-offset-2 ring-offset-black">
//                         <UserIcon size={24} className="text-cyan-300" />
//                       </div>
//                     )}

//                     {author.verified && (
//                       <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full p-1 shadow-lg shadow-yellow-500/50">
//                         <CheckCircle2 size={14} className="text-black" />
//                       </div>
//                     )}
//                   </div>

//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="font-bold text-lg text-white">{author.name}</span>
//                       {author.verified && (
//                         <span className="bg-gradient-to-r from-yellow-500 to-amber-600 text-xs px-2.5 py-0.5 rounded-full font-medium text-black shadow-md">
//                           Verified by Project I
//                         </span>
//                       )}
//                     </div>
//                     <div className="flex items-center gap-2 text-sm text-cyan-200/70">
//                       <span>@{author.handle}</span>
//                       <span>•</span>
//                       <span>{author.time}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <button className="text-cyan-300 hover:text-cyan-100 transition-colors">
//                   <MoreVertical size={20} />
//                 </button>
//               </div>

//               {/* Media */}
//               {post.signed_url && (
//                 <div className="relative">
//                   {isVideo ? (
//                     <div className="relative">
//                       <video
//                         src={post.signed_url}
//                         className="w-full h-auto aspect-video object-cover"
//                         loop
//                         muted
//                         playsInline
//                         preload="metadata"
//                       />
//                       <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/60 to-transparent opacity-70 hover:opacity-90 transition-opacity">
//                         <Play size={80} className="text-white drop-shadow-2xl" />
//                       </div>
//                     </div>
//                   ) : (
//                     <img
//                       src={post.signed_url}
//                       alt={post.caption || "Post image"}
//                       className="w-full h-auto aspect-square object-cover"
//                     />
//                   )}
//                 </div>
//               )}

//               {/* Caption */}
//               {post.caption && (
//                 <div className="px-5 py-4 text-gray-100 leading-relaxed text-[15px]">
//                   {post.caption}
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="flex items-center justify-between px-5 py-4 border-t border-cyan-900/30 bg-black/40">
//                 <div className="flex items-center gap-8">
//                   <button className="flex items-center gap-2 text-gray-300 hover:text-pink-400 transition-colors">
//                     <Heart size={24} />
//                     <span className="text-sm font-medium">4.2k</span>
//                   </button>

//                   <button className="flex items-center gap-2 text-gray-300 hover:text-blue-400 transition-colors">
//                     <MessageCircle size={24} />
//                     <span className="text-sm font-medium">128</span>
//                   </button>

//                   <button className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors">
//                     <Share2 size={24} />
//                     <span className="text-sm font-medium">Upload</span>
//                   </button>
//                 </div>

//                 <button className="flex items-center gap-2 text-gray-300 hover:text-purple-400 transition-colors">
//                   <Diamond size={24} />
//                   <span className="text-sm font-medium">Tip</span>
//                 </button>
//               </div>
//             </motion.article>
//           );
//         })}

//         {/* Loading more */}
//         {loading && (
//           <div className="flex justify-center py-16">
//             <Loader2 className="animate-spin text-cyan-400" size={48} />
//           </div>
//         )}

//         {!hasMore && posts.length > 0 && (
//           <p className="text-center text-cyan-200/50 py-12">End of the firehose</p>
//         )}

//         <div ref={loaderRef} className="h-32" />
//       </main>

//       {/* Bottom Navigation */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/95 to-transparent border-t border-cyan-900/30 z-50 pb-safe">
//         <div className="max-w-screen-md mx-auto flex justify-around items-center py-4">
//           <Link href="/" className="flex flex-col items-center text-cyan-400">
//             <Home size={28} />
//             <span className="text-xs mt-1 font-medium">Home</span>
//           </Link>

//           <Link href="/explore" className="flex flex-col items-center text-gray-300 hover:text-cyan-300 transition-colors">
//             <Compass size={28} />
//             <span className="text-xs mt-1 font-medium">Explore</span>
//           </Link>

//           <Link href="/studio" className="flex flex-col items-center -mt-12 relative">
//             <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 rounded-full flex items-center justify-center shadow-2xl shadow-cyan-500/50 ring-4 ring-cyan-400/30 animate-pulse-slow">
//               <Plus size={40} className="text-white" />
//             </div>
//           </Link>

//           <Link href="/alerts" className="flex flex-col items-center text-gray-300 hover:text-cyan-300 transition-colors">
//             <Bell size={28} />
//             <span className="text-xs mt-1 font-medium">Alerts</span>
//           </Link>

//           <Link href="/profile" className="flex flex-col items-center text-gray-300 hover:text-cyan-300 transition-colors">
//             {user && user.google && typeof (user.google as any).picture === 'string' && (user.google as any).picture ? (
//               <img
//                 src={(user.google as any).picture}
//                 alt="Profile"
//                 className="w-8 h-8 rounded-full object-cover ring-2 ring-cyan-500/50"
//               />
//             ) : (
//               <UserIcon size={28} />
//             )}
//             <span className="text-xs mt-1 font-medium">You</span>
//           </Link>
//         </div>
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
      <div className="min-h-screen bg-[#0a0f1c] flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-400" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0f1c] text-white pb-24">
      {/* Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1c]/95 backdrop-blur-md border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-md mx-auto">
          <div className="flex items-center gap-2">
            <Diamond className="text-blue-400 fill-blue-400/20" size={28} />
            <span className="text-xl font-bold tracking-wider text-white">
              AETHER
            </span>
          </div>
          <div className="flex items-center gap-5">
            <button className="text-slate-400 hover:text-white transition-colors">
              <Search size={24} />
            </button>
            <button className="text-slate-400 hover:text-white transition-colors relative">
              <div className="flex flex-col gap-0.5">
                <div className="w-5 h-0.5 bg-current rounded-full"></div>
                <div className="w-3 h-0.5 bg-current rounded-full ml-auto"></div>
                <div className="w-4 h-0.5 bg-current rounded-full ml-auto"></div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Feed */}
      <main className="pt-16 px-0 max-w-screen-md mx-auto">
        {posts.length === 0 && !loading && (
          <div className="text-center py-32 text-slate-500">
            <Diamond size={64} className="mx-auto mb-6 opacity-20" />
            <p className="text-lg font-medium">The feed is empty...</p>
            <p className="mt-2 text-sm">Be the first to share</p>
          </div>
        )}

        {posts.map((post) => {
          const isVideo = post.media_type?.startsWith("video") ||
                          post.content_url?.toLowerCase().endsWith('.mp4') ||
                          post.content_url?.toLowerCase().endsWith('.mov');

          const author = {
            name: post.author_name || "Anonymous",
            handle: post.author_did?.slice(-8) || "unknown",
            avatar: post.author_avatar || null,
            verified: true,
            time: "2h ago"
          };

          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {author.avatar ? (
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-10 h-10 rounded-full object-cover ring-2 ring-green-500 ring-offset-2 ring-offset-[#0a0f1c]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center ring-2 ring-green-500 ring-offset-2 ring-offset-[#0a0f1c]">
                        <UserIcon size={20} className="text-slate-400" />
                      </div>
                    )}
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0a0f1c]" />
                  </div>

                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-[15px] text-white">{author.name}</span>
                      {author.verified && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30">
                          <CheckCircle2 size={12} className="text-amber-400" />
                          <span className="text-[11px] font-medium text-amber-400">Verified by Project I</span>
                        </span>
                      )}
                    </div>
                    <div className="text-[13px] text-slate-500 flex items-center gap-1">
                      <span>@{author.handle}</span>
                      <span>•</span>
                      <span>{author.time}</span>
                    </div>
                  </div>
                </div>

                <button className="text-slate-500 hover:text-white p-1">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Media */}
              {post.signed_url && (
                <div className="relative w-full">
                  {isVideo ? (
                    <div className="relative aspect-video bg-black">
                      <video
                        src={post.signed_url}
                        className="w-full h-full object-cover"
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Play size={28} className="text-white ml-1" fill="white" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 rounded text-xs font-medium text-white">
                        0:59
                      </div>
                    </div>
                  ) : (
                    <div className="relative aspect-[4/5] bg-slate-900">
                      <img
                        src={post.signed_url}
                        alt={post.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Action Bar */}
              <div className="px-4 py-3">
                <div className="flex items-center justify-between bg-slate-900/50 backdrop-blur-sm rounded-2xl px-4 py-3 border border-white/5">
                  <div className="flex items-center gap-6">
                    <button className="flex items-center gap-2 text-slate-300 hover:text-pink-500 transition-colors">
                      <Heart size={22} />
                      <span className="text-sm font-medium">4.2k</span>
                    </button>
                    <button className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
                      <MessageCircle size={22} />
                      <span className="text-sm font-medium">128</span>
                    </button>
                    <button className="text-slate-300 hover:text-green-400 transition-colors">
                      <Share2 size={22} />
                    </button>
                  </div>

                  <button className="flex items-center gap-2 text-slate-300 hover:text-cyan-400 transition-colors">
                    <Diamond size={20} className="text-cyan-400" />
                    <span className="text-sm font-medium">Tip</span>
                  </button>
                </div>
              </div>

              {/* Caption */}
              {post.caption && (
                <div className="px-4 pb-2">
                  <p className="text-[15px] leading-relaxed text-slate-200">
                    {post.caption}
                    <button className="text-slate-500 ml-1 hover:text-slate-300">...more</button>
                  </p>
                </div>
              )}
            </motion.article>
          );
        })}

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-blue-400" size={32} />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <p className="text-center text-slate-600 py-12 text-sm">You're all caught up</p>
        )}

        <div ref={loaderRef} className="h-20" />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0a0f1c]/98 backdrop-blur-xl border-t border-white/5 z-50 pb-safe">
        <div className="max-w-screen-md mx-auto flex justify-around items-end px-2 py-2">
          <Link href="/" className="flex flex-col items-center gap-1 py-2 px-4">
            <Home size={24} className="text-white" fill="white" />
            <span className="text-[11px] font-medium text-white">Home</span>
          </Link>

          <Link href="/explore" className="flex flex-col items-center gap-1 py-2 px-4 text-slate-500 hover:text-slate-300">
            <Compass size={24} />
            <span className="text-[11px] font-medium">Explore</span>
          </Link>

          <Link href="/studio" className="relative -top-5">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Plus size={32} className="text-white" strokeWidth={2.5} />
            </div>
          </Link>

          <Link href="/alerts" className="flex flex-col items-center gap-1 py-2 px-4 text-slate-500 hover:text-slate-300 relative">
            <Bell size={24} />
            <span className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full" />
            <span className="text-[11px] font-medium">Alerts</span>
          </Link>

          <Link href="/profile" className="flex flex-col items-center gap-1 py-2 px-4 text-slate-500 hover:text-slate-300">
            {user && user.google && typeof (user.google as any).picture === 'string' ? (
              <img
                src={(user.google as any).picture}
                alt="You"
                className="w-6 h-6 rounded-full object-cover ring-2 ring-slate-600"
              />
            ) : (
              <UserIcon size={24} />
            )}
            <span className="text-[11px] font-medium">You</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}