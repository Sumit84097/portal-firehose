
// // "use client";

// // import { motion } from "framer-motion";
// // import { usePrivy } from "@privy-io/react-auth";
// // import {
// //   Heart,
// //   MessageCircle,
// //   Share2,
// //   Diamond,
// //   Play,
// //   User as UserIcon,
// //   Loader2,
// //   CheckCircle2,
// //   Hexagon,
// //   Home,
// //   Compass,
// //   Bell,
// //   Search,
// //   MoreVertical,
// //   Plus,
// // } from "lucide-react";
// // import { useRouter } from "next/navigation";
// // import { useEffect, useState, useRef } from "react";
// // import Link from "next/link";
// // import { getShieldedFeed } from "@/app/actions/get-feed";

// // export default function PortalFeed() {
// //   const { authenticated, ready, user } = usePrivy();
// //   const router = useRouter();

// //   const [posts, setPosts] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(true);
// //   const [hasMore, setHasMore] = useState(true);
// //   const loaderRef = useRef<HTMLDivElement>(null);

// //   const fetchPosts = async (afterId?: string | null) => {
// //     if (!hasMore) return;

// //     setLoading(true);

// //     try {
// //       const result = await getShieldedFeed({
// //         limit: 10,
// //         afterId,
// //       });

// //       if (!result.success || !result.data?.length) {
// //         setHasMore(false);
// //         return;
// //       }

// //       setPosts((prev) => [...prev, ...result.data]);
// //     } catch (err) {
// //       console.error("Feed fetch failed:", err);
// //       setHasMore(false);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (ready && authenticated) {
// //       fetchPosts();
// //     }
// //   }, [ready, authenticated]);

// //   useEffect(() => {
// //     if (!loaderRef.current || !hasMore) return;

// //     const observer = new IntersectionObserver(
// //       (entries) => {
// //         if (entries[0].isIntersecting && !loading) {
// //           const lastId = posts[posts.length - 1]?.id;
// //           fetchPosts(lastId);
// //         }
// //       },
// //       { threshold: 0.1 }
// //     );

// //     observer.observe(loaderRef.current);
// //     return () => observer.disconnect();
// //   }, [posts, hasMore, loading]);

// //   useEffect(() => {
// //     if (ready && !authenticated) {
// //       router.push("/");
// //     }
// //   }, [ready, authenticated, router]);

// //   if (!ready) {
// //     return (
// //       <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-gray-950 flex items-center justify-center">
// //         <Loader2 className="animate-spin text-blue-400" size={48} />
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-gray-950 text-white pb-safe">
// //       {/* Top Bar */}
// //       <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-blue-900/30 px-4 py-3">
// //         <div className="flex items-center justify-between max-w-screen-md mx-auto">
// //           <div className="flex items-center gap-3">
// //             <Hexagon className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" size={32} />
// //             <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
// //               PORTAL
// //             </span>
// //           </div>
// //           <div className="flex items-center gap-5">
// //             <button className="text-blue-300 hover:text-white transition-colors">
// //               <Search size={24} />
// //             </button>
// //             <button className="text-blue-300 hover:text-white transition-colors relative">
// //               <Bell size={24} />
// //               <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
// //             </button>
// //           </div>
// //         </div>
// //       </header>

// //       {/* Feed – cinematic, immersive */}
// //       <main className="pt-20 px-0 max-w-screen-md mx-auto space-y-10">
// //         {posts.length === 0 && !loading && (
// //           <div className="text-center py-32 text-slate-400">
// //             <Hexagon size={64} className="mx-auto mb-6 opacity-40 animate-pulse" />
// //             <p className="text-xl font-medium">The feed is quiet...</p>
// //             <p className="mt-2">Create your first moment</p>
// //           </div>
// //         )}

// //         {posts.map((post) => {
// //           const isVideo = post.media_type?.startsWith("video") ||
// //                           post.content_url?.toLowerCase().endsWith('.mp4') ||
// //                           post.content_url?.toLowerCase().endsWith('.mov');

// //           const author = {
// //             name: post.author_name || "Anonymous",
// //             handle: post.author_did?.slice(-8) || "@unknown",
// //             avatar: post.author_avatar || null,
// //             verified: true,
// //             time: new Date(post.created_at).toLocaleString([], {hour: 'numeric', minute:'2-digit', hour12: true})
// //           };

// //           return (
// //             <motion.div
// //               key={post.id}
// //               initial={{ opacity: 0, y: 20 }}
// //               animate={{ opacity: 1, y: 0 }}
// //               className="glass-post"
// //             >
// //               {/* Header */}
// //               <div className="flex items-center justify-between px-4 pt-4 pb-2">
// //                 <div className="flex items-center gap-3">
// //                   <div className="relative">
// //                     {author.avatar ? (
// //                       <img
// //                         src={author.avatar}
// //                         alt={author.name}
// //                         className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30 ring-offset-2 ring-offset-[var(--bg-mid)]"
// //                       />
// //                     ) : (
// //                       <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center ring-2 ring-blue-500/30 ring-offset-2 ring-offset-[var(--bg-mid)]">
// //                         <UserIcon size={22} className="text-blue-300" />
// //                       </div>
// //                     )}

// //                     <div className="online-dot" />
// //                   </div>

// //                   <div>
// //                     <div className="flex items-center gap-2">
// //                       <span className="font-bold text-base">{author.name}</span>
// //                       {author.verified && (
// //                         <span className="verified-pill">
// //                           Verified by Project I
// //                         </span>
// //                       )}
// //                     </div>
// //                     <div className="text-xs text-slate-400 flex items-center gap-1.5">
// //                       <span>@{author.handle}</span>
// //                       <span>•</span>
// //                       <span>{author.time}</span>
// //                     </div>
// //                   </div>
// //                 </div>

// //                 <button className="text-slate-400 hover:text-white">
// //                   <MoreVertical size={20} />
// //                 </button>
// //               </div>

// //               {/* Media – edge-to-edge */}
// //               {post.signed_url && (
// //                 <div className="media-full-bleed">
// //                   {isVideo ? (
// //                     <div className="relative">
// //                       <video
// //                         src={post.signed_url}
// //                         className="w-full aspect-video object-cover"
// //                         loop
// //                         muted
// //                         playsInline
// //                         preload="metadata"
// //                       />
// //                       <div className="absolute inset-0 flex items-center justify-center bg-black/40">
// //                         <Play size={64} className="text-white opacity-90 drop-shadow-xl" />
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <img
// //                       src={post.signed_url}
// //                       alt={post.caption}
// //                       className="w-full object-cover"
// //                     />
// //                   )}
// //                 </div>
// //               )}

// //               {/* Caption */}
// //               {post.caption && (
// //                 <p className="px-4 py-4 text-[15px] leading-relaxed text-slate-100">
// //                   {post.caption}
// //                 </p>
// //               )}

// //               {/* Action Pill */}
// //               <div className="action-bar">
// //                 <div className="flex items-center gap-10">
// //                   <button className="flex items-center gap-2 text-slate-300 hover:text-pink-400 transition-colors">
// //                     <Heart size={22} />
// //                     <span className="text-sm font-medium">4.2k</span>
// //                   </button>
// //                   <button className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
// //                     <MessageCircle size={22} />
// //                     <span className="text-sm font-medium">128</span>
// //                   </button>
// //                   <button className="flex items-center gap-2 text-slate-300 hover:text-green-400 transition-colors">
// //                     <Share2 size={22} />
// //                   </button>
// //                 </div>

// //                 <button className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors">
// //                   <Diamond size={22} />
// //                   <span className="text-sm font-medium">Tip</span>
// //                 </button>
// //               </div>
// //             </motion.div>
// //           );
// //         })}

// //         {loading && (
// //           <div className="flex justify-center py-16">
// //             <Loader2 className="animate-spin text-blue-400" size={48} />
// //           </div>
// //         )}

// //         {!hasMore && posts.length > 0 && (
// //           <p className="text-center text-slate-400 py-12">You're all caught up</p>
// //         )}

// //         <div ref={loaderRef} className="h-32" />
// //       </main>

// //       {/* Bottom Nav */}
// //       <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-blue-900/30 z-50 pb-safe">
// //         <div className="max-w-screen-md mx-auto flex justify-around items-center py-4">
// //           <Link href="/" className="flex flex-col items-center text-blue-400">
// //             <Home size={28} />
// //             <span className="text-xs mt-1 font-medium">Home</span>
// //           </Link>

// //           <Link href="/explore" className="flex flex-col items-center text-slate-300 hover:text-blue-300">
// //             <Compass size={28} />
// //             <span className="text-xs mt-1 font-medium">Explore</span>
// //           </Link>

// //           <Link href="/studio" className="relative -mt-14">
// //             <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center glow-plus animate-pulse-slow">
// //               <Plus size={40} className="text-white" />
// //             </div>
// //           </Link>

// //           <Link href="/alerts" className="flex flex-col items-center text-slate-300 hover:text-blue-300">
// //             <Bell size={28} />
// //             <span className="text-xs mt-1 font-medium">Alerts</span>
// //           </Link>

// //           <Link href="/profile" className="flex flex-col items-center text-slate-300 hover:text-blue-300">
// //             {user && user.google && typeof (user.google as any).picture === 'string' ? (
// //               <img
// //                 src={(user.google as any).picture}
// //                 alt="You"
// //                 className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/50"
// //               />
// //             ) : (
// //               <UserIcon size={28} />
// //             )}
// //             <span className="text-xs mt-1 font-medium">You</span>
// //           </Link>
// //         </div>
// //       </nav>
// //     </div>
// //   );
// // }




// "use client";

// import { motion } from "framer-motion";
// import { usePrivy } from "@privy-io/react-auth";
// import { Heart, Diamond, Loader2, Hexagon, Plus, User as UserIcon, ShieldCheck } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import { getShieldedFeed } from "@/app/actions/get-feed";

// export default function PortalFeed() {
//   const { authenticated, ready, user } = usePrivy();
//   const router = useRouter();
//   const [posts, setPosts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const loaderRef = useRef<HTMLDivElement>(null);

//   useEffect(() => {
//     const fetchPosts = async () => {
//       const result = await getShieldedFeed({ limit: 15 });
//       if (result.success) setPosts(result.data);
//       setLoading(false);
//     };
//     if (ready && authenticated) fetchPosts();
//   }, [ready, authenticated]);

//   if (!ready || loading) return (
//     <div className="h-screen bg-[#050505] flex items-center justify-center">
//       <Loader2 className="animate-spin text-cyan-500" size={32} strokeWidth={1} />
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-[#050505] text-white selection:bg-cyan-500/30">
//       {/* Minimal Header */}
//       <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/60 backdrop-blur-xl">
//         <div className="max-w-2xl mx-auto px-6 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <Hexagon className="text-cyan-500" size={20} fill="currentColor" fillOpacity={0.1} />
//             <span className="text-sm font-black tracking-[0.3em] uppercase">Portal</span>
//           </div>
//           <Link href="/terminal" className="text-[10px] font-mono text-zinc-500 hover:text-cyan-400 transition-colors uppercase tracking-widest">
//             Sovereignty Config
//           </Link>
//         </div>
//       </header>

//       <main className="pt-24 pb-32 max-w-2xl mx-auto px-4 space-y-20">
//         {posts.map((post) => (
//           <motion.div 
//             key={post.id} 
//             initial={{ opacity: 0, y: 20 }} 
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             className="group"
//           >
//             {/* Gallery Header */}
//             <div className="flex items-center justify-between mb-4 px-2">
//               <div className="flex items-center gap-3">
//                 <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 overflow-hidden">
//                   {post.author_avatar ? (
//                     <img src={post.author_avatar} className="w-full h-full object-cover" />
//                   ) : (
//                     <UserIcon size={14} className="m-auto mt-2 text-zinc-700" />
//                   )}
//                 </div>
//                 <span className="text-xs font-bold tracking-tight">@{post.author_username}</span>
//               </div>
//               <div className="flex items-center gap-2 px-2 py-1 rounded bg-cyan-500/5 border border-cyan-500/10">
//                 <ShieldCheck size={10} className="text-cyan-400" />
//                 <span className="text-[9px] font-mono text-cyan-400 uppercase tracking-tighter">Math Verified</span>
//               </div>
//             </div>

//             {/* Media Frame */}
//             <div className="relative aspect-[4/5] bg-zinc-900 border border-white/5 overflow-hidden rounded-sm">
//               <img 
//                 src={post.signed_url} 
//                 className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-105" 
//                 alt={post.caption} 
//               />
//               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
//               {/* Overlay Actions */}
//               <div className="absolute bottom-6 right-6 flex flex-col gap-3 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
//                 <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-cyan-500 hover:text-black transition-all">
//                   <Heart size={20} />
//                 </button>
//                 <button className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
//                   <Diamond size={20} />
//                 </button>
//               </div>
//             </div>

//             {/* Content info */}
//             <div className="mt-4 px-2 space-y-2">
//               <p className="text-sm text-zinc-300 font-light leading-relaxed">{post.caption}</p>
//               <div className="pt-2 border-t border-white/5">
//                 <p className="text-[9px] font-mono text-zinc-600 uppercase truncate">
//                   Sig: {post.signature}
//                 </p>
//               </div>
//             </div>
//           </motion.div>
//         ))}
//       </main>

//       {/* Floating Bottom Navigation */}
//       <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
//         <div className="flex items-center gap-8 px-8 py-4 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
//           <Link href="/feed" className="text-cyan-400"><Hexagon size={24} /></Link>
//           <Link href="/studio" className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center hover:scale-110 transition-transform">
//             <Plus size={24} strokeWidth={3} />
//           </Link>
//           <Link href="/profile" className="text-zinc-500 hover:text-white transition-colors"><UserIcon size={24} /></Link>
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
//       <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-gray-950 flex items-center justify-center">
//         <Loader2 className="animate-spin text-blue-400" size={48} />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-gray-950 text-white pb-safe">
//       {/* Top Bar */}
//       <header className="fixed top-0 left-0 right-0 z-50 bg-black/70 backdrop-blur-xl border-b border-blue-900/30 px-4 py-3">
//         <div className="flex items-center justify-between max-w-screen-md mx-auto">
//           <div className="flex items-center gap-3">
//             <Hexagon className="text-blue-400 drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]" size={32} />
//             <span className="text-2xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
//               PORTAL
//             </span>
//           </div>
//           <div className="flex items-center gap-5">
//             <button className="text-blue-300 hover:text-white transition-colors">
//               <Search size={24} />
//             </button>
//             <button className="text-blue-300 hover:text-white transition-colors relative">
//               <Bell size={24} />
//               <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
//             </button>
//           </div>
//         </div>
//       </header>

//       {/* Feed – cinematic, immersive */}
//       <main className="pt-20 px-0 max-w-screen-md mx-auto space-y-10">
//         {posts.length === 0 && !loading && (
//           <div className="text-center py-32 text-slate-400">
//             <Hexagon size={64} className="mx-auto mb-6 opacity-40 animate-pulse" />
//             <p className="text-xl font-medium">The feed is quiet...</p>
//             <p className="mt-2">Create your first moment</p>
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
//             time: new Date(post.created_at).toLocaleString([], {hour: 'numeric', minute:'2-digit', hour12: true})
//           };

//           return (
//             <motion.div
//               key={post.id}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="glass-post"
//             >
//               {/* Header */}
//               <div className="flex items-center justify-between px-4 pt-4 pb-2">
//                 <div className="flex items-center gap-3">
//                   <div className="relative">
//                     {author.avatar ? (
//                       <img
//                         src={author.avatar}
//                         alt={author.name}
//                         className="w-11 h-11 rounded-full object-cover ring-2 ring-blue-500/30 ring-offset-2 ring-offset-[var(--bg-mid)]"
//                       />
//                     ) : (
//                       <div className="w-11 h-11 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center ring-2 ring-blue-500/30 ring-offset-2 ring-offset-[var(--bg-mid)]">
//                         <UserIcon size={22} className="text-blue-300" />
//                       </div>
//                     )}

//                     <div className="online-dot" />
//                   </div>

//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="font-bold text-base">{author.name}</span>
//                       {author.verified && (
//                         <span className="verified-pill">
//                           Verified by Project I
//                         </span>
//                       )}
//                     </div>
//                     <div className="text-xs text-slate-400 flex items-center gap-1.5">
//                       <span>@{author.handle}</span>
//                       <span>•</span>
//                       <span>{author.time}</span>
//                     </div>
//                   </div>
//                 </div>

//                 <button className="text-slate-400 hover:text-white">
//                   <MoreVertical size={20} />
//                 </button>
//               </div>

//               {/* Media – edge-to-edge */}
//               {post.signed_url && (
//                 <div className="media-full-bleed">
//                   {isVideo ? (
//                     <div className="relative">
//                       <video
//                         src={post.signed_url}
//                         className="w-full aspect-video object-cover"
//                         loop
//                         muted
//                         playsInline
//                         preload="metadata"
//                       />
//                       <div className="absolute inset-0 flex items-center justify-center bg-black/40">
//                         <Play size={64} className="text-white opacity-90 drop-shadow-xl" />
//                       </div>
//                     </div>
//                   ) : (
//                     <img
//                       src={post.signed_url}
//                       alt={post.caption}
//                       className="w-full object-cover"
//                     />
//                   )}
//                 </div>
//               )}

//               {/* Caption */}
//               {post.caption && (
//                 <p className="px-4 py-4 text-[15px] leading-relaxed text-slate-100">
//                   {post.caption}
//                 </p>
//               )}

//               {/* Action Pill */}
//               <div className="action-bar">
//                 <div className="flex items-center gap-10">
//                   <button className="flex items-center gap-2 text-slate-300 hover:text-pink-400 transition-colors">
//                     <Heart size={22} />
//                     <span className="text-sm font-medium">4.2k</span>
//                   </button>
//                   <button className="flex items-center gap-2 text-slate-300 hover:text-blue-400 transition-colors">
//                     <MessageCircle size={22} />
//                     <span className="text-sm font-medium">128</span>
//                   </button>
//                   <button className="flex items-center gap-2 text-slate-300 hover:text-green-400 transition-colors">
//                     <Share2 size={22} />
//                   </button>
//                 </div>

//                 <button className="flex items-center gap-2 text-slate-300 hover:text-purple-400 transition-colors">
//                   <Diamond size={22} />
//                   <span className="text-sm font-medium">Tip</span>
//                 </button>
//               </div>
//             </motion.div>
//           );
//         })}

//         {loading && (
//           <div className="flex justify-center py-16">
//             <Loader2 className="animate-spin text-blue-400" size={48} />
//           </div>
//         )}

//         {!hasMore && posts.length > 0 && (
//           <p className="text-center text-slate-400 py-12">You're all caught up</p>
//         )}

//         <div ref={loaderRef} className="h-32" />
//       </main>

//       {/* Bottom Nav */}
//       <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-2xl border-t border-blue-900/30 z-50 pb-safe">
//         <div className="max-w-screen-md mx-auto flex justify-around items-center py-4">
//           <Link href="/" className="flex flex-col items-center text-blue-400">
//             <Home size={28} />
//             <span className="text-xs mt-1 font-medium">Home</span>
//           </Link>

//           <Link href="/explore" className="flex flex-col items-center text-slate-300 hover:text-blue-300">
//             <Compass size={28} />
//             <span className="text-xs mt-1 font-medium">Explore</span>
//           </Link>

//           <Link href="/studio" className="relative -mt-14">
//             <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-full flex items-center justify-center glow-plus animate-pulse-slow">
//               <Plus size={40} className="text-white" />
//             </div>
//           </Link>

//           <Link href="/alerts" className="flex flex-col items-center text-slate-300 hover:text-blue-300">
//             <Bell size={28} />
//             <span className="text-xs mt-1 font-medium">Alerts</span>
//           </Link>

//           <Link href="/profile" className="flex flex-col items-center text-slate-300 hover:text-blue-300">
//             {user && user.google && typeof (user.google as any).picture === 'string' ? (
//               <img
//                 src={(user.google as any).picture}
//                 alt="You"
//                 className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/50"
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

  const fetchPosts = async (afterId?: string | null) => {
    if (!hasMore) return;
    setLoading(true);
    try {
      const result = await getShieldedFeed({ limit: 10, afterId });
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

  if (!ready) return null;

  return (
    <div className="fixed inset-0 bg-black text-white font-sans overflow-hidden flex flex-col">
      
      {/* 1. HEADER: Strictly 3 columns using Grid so items CANNOT overlap */}
      <header className="h-14 border-b border-white/10 grid grid-cols-3 items-center px-4 shrink-0 bg-black z-50">
        <div className="flex justify-start">
          <div className="w-8 h-8 rounded-full bg-zinc-900 border border-white/10 overflow-hidden flex items-center justify-center">
            {user?.google?.picture ? (
              <img 
                src={user.google.picture} 
                className="w-full h-full object-cover" 
                alt="Profile picture"
              />
            ) : (
              <UserIcon size={16} className="text-zinc-500" />
            )}
          </div>
        </div>
        
        <div className="flex justify-center">
          <h1 className="text-[12px] font-black tracking-[0.4em] uppercase">PORTAL</h1>
        </div>
        
        <div className="flex justify-end">
          <button className="p-1">
            <Menu size={24} />
          </button>
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
                    <img 
                      src={post.author_avatar} 
                      className="w-full h-full object-cover" 
                      alt="Author avatar"
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-900" />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold leading-none">
                    @{post.author_username}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-1 uppercase font-medium">
                    {new Date(post.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                </div>
              </div>
              <MoreHorizontal size={20} className="text-zinc-500" />
            </div>

            {/* Content Image: Exact Square */}
            <div className="w-full aspect-square bg-zinc-950 flex items-center justify-center">
              {post.signed_url && (
                <img 
                  src={post.signed_url} 
                  className="w-full h-full object-cover" 
                  alt="artifact" 
                />
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
                <span className="font-bold mr-2 text-white">
                  @{post.author_username}
                </span>
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
        
        {loading && (
          <div className="flex justify-center p-8">
            <Loader2 className="animate-spin" />
          </div>
        )}
        
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
        <Link href="/feed" className="text-white">
          <Home size={26} strokeWidth={2} />
        </Link>
        <Search size={26} className="text-zinc-500" strokeWidth={2} />
        <Bell size={26} className="text-zinc-500" strokeWidth={2} />
        <Link href="/profile" className="text-zinc-500">
          <UserIcon size={26} strokeWidth={2} />
        </Link>
      </nav>
    </div>
  );
}