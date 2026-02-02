
// "use client";

// import { motion } from "framer-motion";
// import { usePrivy } from "@privy-io/react-auth";
// import {
//   Plus,
//   Hexagon,
//   ShieldCheck,
//   User as UserIcon,
//   Menu,
//   Crown,
//   Copy,
//   Loader2,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState, useRef } from "react";
// import Link from "next/link";
// import { getShieldedFeed } from "@/app/actions/get-feed";

// export default function PortalFeed() {
//   const { authenticated, ready, user } = usePrivy();
//   const router = useRouter();

//   const [artifacts, setArtifacts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [fetchError, setFetchError] = useState<string | null>(null); // ← new: show errors
//   const [hasMore, setHasMore] = useState(true);
//   const [originalMap, setOriginalMap] = useState<Map<string, any>>(new Map());
//   const loaderRef = useRef<HTMLDivElement>(null);

//   const fetchArtifacts = async (afterId?: string | null) => {
//     if (!hasMore || !authenticated) return;

//     setLoading(true);
//     setFetchError(null);

//     try {
//       console.log("Fetching feed...", { afterId, userId: user?.id });

//       const result = await getShieldedFeed({
//         limit: 10,
//         afterId,
//       });

//       console.log("Feed result:", result); // ← debug: see what server returns

//       if (!result.success) {
//         throw new Error(result.error || "Feed fetch failed");
//       }

//       if (!result.data?.length) {
//         console.log("No more items");
//         setHasMore(false);
//       } else {
//         setArtifacts((prev) => [...prev, ...result.data]);

//         const newMap = new Map(originalMap);
//         result.data.forEach((post: any) => {
//           if (post.content_hash && post.content_hash !== "text_node") {
//             if (!newMap.has(post.content_hash) || new Date(post.created_at) < new Date(newMap.get(post.content_hash).created_at)) {
//               newMap.set(post.content_hash, post);
//             }
//           }
//         });
//         setOriginalMap(newMap);
//       }
//     } catch (err: any) {
//       console.error("Feed fetch error:", err);
//       setFetchError(err.message || "Failed to load feed");
//       setHasMore(false);
//     } finally {
//       setLoading(false); // ← always reset loading
//     }
//   };

//   // Initial fetch
//   useEffect(() => {
//     if (ready && authenticated) {
//       console.log("User ready & authenticated → starting feed fetch");
//       fetchArtifacts();
//     }
//   }, [ready, authenticated]);

//   // Infinite scroll
//   useEffect(() => {
//     if (!loaderRef.current || !hasMore || loading) return;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           const lastId = artifacts[artifacts.length - 1]?.id;
//           console.log("Loading more... last ID:", lastId);
//           fetchArtifacts(lastId);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     observer.observe(loaderRef.current);
//     return () => observer.disconnect();
//   }, [artifacts, hasMore, loading]);

//   // Redirect if not authenticated
//   useEffect(() => {
//     if (ready && !authenticated) {
//       console.log("Not authenticated → redirecting to /");
//       router.push("/");
//     }
//   }, [ready, authenticated, router]);

//   if (!ready) {
//     return (
//       <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
//         <Hexagon size={40} className="text-cyan-500 animate-spin" />
//         <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mt-4">Initializing...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-[100dvh] w-screen bg-black text-white font-sans flex flex-col overflow-hidden relative">
//       {/* Nav */}
//       <nav className="shrink-0 flex items-center justify-between px-6 py-6 bg-black border-b border-white/5 z-[100]">
//         <Link href="/profile" className="w-8 h-8 rounded-full border border-cyan-500/30 overflow-hidden bg-zinc-950 flex items-center justify-center">
//           {user && user.google && typeof (user.google as any).picture === 'string' && (user.google as any).picture ? (
//             <img 
//               src={(user.google as any).picture} 
//               alt="P" 
//               className="w-full h-full object-cover" 
//             />
//           ) : (
//             <UserIcon size={14} className="text-zinc-600" />
//           )}
//         </Link>
//         <div className="flex flex-col items-center">
//           <h1 className="text-[11px] font-black tracking-[0.5em] uppercase">Portal</h1>
//           <span className="text-[7px] text-cyan-500 tracking-[0.3em] uppercase font-bold">Firehose</span>
//         </div>
//         <Menu size={20} className="text-zinc-500" />
//       </nav>

//       {/* Feed */}
//       <main className="flex-1 overflow-y-auto px-4 pt-6 pb-40 scrollbar-hide">
//         <div className="max-w-md mx-auto space-y-12">
//           {/* Show error if fetch failed */}
//           {fetchError && (
//             <div className="text-center py-10 text-red-400">
//               {fetchError} — <button onClick={() => fetchArtifacts()} className="underline">Retry</button>
//             </div>
//           )}

//           {/* Loading state */}
//           {loading && artifacts.length === 0 && (
//             <div className="flex flex-col items-center justify-center py-20">
//               <Loader2 className="animate-spin text-cyan-500" size={48} />
//               <p className="mt-4 text-zinc-400">Loading firehose...</p>
//             </div>
//           )}

//           {/* Empty state */}
//           {!loading && artifacts.length === 0 && !fetchError && (
//             <div className="text-center py-20 text-zinc-500">
//               No content yet. Be the first to upload in Studio!
//             </div>
//           )}

//           {/* Artifacts list */}
//           {artifacts.map((post, index) => {
//             const isOriginal = originalMap.get(post.content_hash)?.id === post.id;
//             const originalPost = originalMap.get(post.content_hash);
//             const isVideo = post.media_type?.startsWith("video") || 
//                            post.content_url?.toLowerCase().endsWith('.mp4') || 
//                            post.content_url?.toLowerCase().endsWith('.mov') || 
//                            post.content_url?.toLowerCase().endsWith('.webm');

//             return (
//               <div key={post.id || `post-${index}`} className="group">
//                 <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950 border border-white/10 rounded-[2.5rem]">
//                   {post.signed_url ? (
//                     isVideo ? (
//                       <video
//                         src={post.signed_url}
//                         className="w-full h-full object-cover"
//                         loop
//                         muted
//                         playsInline
//                         autoPlay
//                         preload="metadata"
//                         onError={(e) => console.error("Video load error:", e)}
//                       />
//                     ) : (
//                       <img
//                         src={post.signed_url}
//                         className="w-full h-full object-cover"
//                         alt={post.caption || "artifact"}
//                         onError={(e) => console.error("Image load error:", e)}
//                       />
//                     )
//                   ) : post.content_url === "text_node" ? (
//                     <div className="w-full h-full flex items-center justify-center p-10 bg-[#080808]">
//                       <p className="text-lg font-light text-zinc-400 italic text-center leading-relaxed">
//                         "{post.caption}"
//                       </p>
//                     </div>
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center text-zinc-500">
//                       <p>Media not available</p>
//                     </div>
//                   )}

//                   {/* Creator/Reposter Badge */}
//                   <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
//                     <div
//                       className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
//                         isOriginal
//                           ? "bg-green-500/20 text-green-300 border border-green-500/30"
//                           : "bg-zinc-700/80 text-zinc-300 border border-zinc-600/50"
//                       }`}
//                     >
//                       {isOriginal ? (
//                         <>
//                           <Crown size={12} /> Creator
//                         </>
//                       ) : (
//                         <>
//                           <Copy size={12} /> Reposter
//                         </>
//                       )}
//                     </div>

//                     {!isOriginal && originalPost && (
//                       <Link
//                         href={`/profile?did=${originalPost.author_did}`}
//                         className="text-[9px] text-cyan-400 hover:underline"
//                       >
//                         Original by {originalPost.author_did.slice(-6)}
//                       </Link>
//                     )}
//                   </div>

//                   {/* Signature Badge */}
//                   <div className="absolute bottom-5 left-5 flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-cyan-500/30">
//                     <ShieldCheck size={12} className="text-cyan-400" />
//                     <span className="text-[9px] font-mono text-cyan-100 uppercase">
//                       {post.signature?.slice(0, 6)}...{post.signature?.slice(-4)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-4 px-4">
//                   {post.caption && post.content_url !== "text_node" && (
//                     <p className="text-sm text-zinc-200 mb-2">{post.caption}</p>
//                   )}
//                   <span className="text-[9px] text-zinc-700 uppercase tracking-widest font-black">
//                     Provenance: {post.author_did.slice(-8)}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}

//           {/* Infinite scroll loader */}
//           {hasMore && !loading && (
//             <div ref={loaderRef} className="py-12 flex justify-center">
//               <Loader2 className="animate-spin text-cyan-500" size={32} />
//             </div>
//           )}

//           {loading && (
//             <div className="py-12 flex justify-center">
//               <Loader2 className="animate-spin text-cyan-500" size={32} />
//             </div>
//           )}

//           {!hasMore && artifacts.length > 0 && (
//             <p className="text-center text-zinc-500 py-10">End of feed</p>
//           )}
//         </div>
//       </main>

//       {/* Dock */}
//       <div className="absolute bottom-12 left-0 right-0 z-[9999] flex justify-center px-6 pointer-events-none">
//         <div className="pointer-events-auto flex items-center justify-between w-full max-w-[340px] h-16 bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-full px-8 shadow-[0_20px_60px_rgba(0,0,0,1)] relative">
//           <Link href="/feed">
//             <Hexagon size={22} className="text-white" />
//           </Link>

//           <Link href="/studio" className="relative flex items-center h-full">
//             <motion.div
//               whileTap={{ scale: 0.9 }}
//               className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center text-black absolute -top-10 left-1/2 -translate-x-1/2 border-[5px] border-black shadow-[0_0_30px_rgba(6,182,212,0.5)]"
//             >
//               <Plus size={32} strokeWidth={3} />
//             </motion.div>
//           </Link>

//           <Link href="/profile">
//             <UserIcon size={22} className="text-zinc-500 hover:text-white transition-colors" />
//           </Link>
//         </div>
//       </div>
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

  // Infinite scroll
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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-950 text-white pb-20">
      {/* Header / Top Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3">
        <div className="flex items-center justify-between max-w-screen-md mx-auto">
          <div className="flex items-center gap-2">
            <Hexagon className="text-cyan-400" size={28} />
            <span className="text-xl font-black tracking-tight">PORTAL</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-white">
              <Search size={24} />
            </button>
            <button className="text-gray-400 hover:text-white">
              <Bell size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Feed Content */}
      <main className="pt-16 px-3 max-w-screen-md mx-auto">
        {posts.length === 0 && !loading && (
          <div className="text-center py-20 text-gray-500">
            No posts yet. Be the first to create something.
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
            verified: true, // dynamic later
            time: new Date(post.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
          };

          return (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-gray-800/50 overflow-hidden"
            >
              {/* Post Header */}
              <div className="flex items-center justify-between px-4 pt-4 pb-2">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    {author.avatar ? (
                      <img
                        src={author.avatar}
                        alt={author.name}
                        className="w-10 h-10 rounded-full object-cover border-2 border-cyan-500/30"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                        <UserIcon size={20} className="text-gray-400" />
                      </div>
                    )}

                    {author.verified && (
                      <div className="absolute -bottom-1 -right-1 bg-cyan-500 rounded-full p-0.5">
                        <CheckCircle2 size={14} className="text-black" />
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{author.name}</span>
                      {author.verified && (
                        <span className="bg-gradient-to-r from-cyan-500 to-blue-600 text-xs px-2 py-0.5 rounded-full font-medium">
                          Verified by Project I
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <span>@{author.handle}</span>
                      <span>•</span>
                      <span>{author.time}</span>
                    </div>
                  </div>
                </div>

                <button className="text-gray-400 hover:text-white">
                  <MoreVertical size={20} />
                </button>
              </div>

              {/* Media */}
              {post.signed_url && (
                <div className="relative">
                  {isVideo ? (
                    <div className="relative">
                      <video
                        src={post.signed_url}
                        className="w-full h-auto max-h-[500px] object-cover"
                        loop
                        muted
                        playsInline
                        preload="metadata"
                      />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                        <Play size={64} className="text-white drop-shadow-lg" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={post.signed_url}
                      alt={post.caption || "Post image"}
                      className="w-full h-auto max-h-[500px] object-cover"
                    />
                  )}
                </div>
              )}

              {/* Caption */}
              {post.caption && (
                <div className="px-4 py-3 text-gray-100">
                  {post.caption}
                </div>
              )}

              {/* Actions */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-gray-800/50">
                <div className="flex items-center gap-6">
                  <button className="flex items-center gap-1.5 text-gray-400 hover:text-pink-500 transition-colors">
                    <Heart size={22} />
                    <span className="text-sm">4.2k</span>
                  </button>

                  <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-400 transition-colors">
                    <MessageCircle size={22} />
                    <span className="text-sm">128</span>
                  </button>

                  <button className="flex items-center gap-1.5 text-gray-400 hover:text-green-400 transition-colors">
                    <Share2 size={22} />
                    <span className="text-sm">Upload</span>
                  </button>
                </div>

                <button className="flex items-center gap-1.5 text-gray-400 hover:text-purple-400 transition-colors">
                  <Diamond size={22} />
                  <span className="text-sm">Tip</span>
                </button>
              </div>
            </motion.article>
          );
        })}

        {/* Loading more */}
        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="animate-spin text-cyan-500" size={40} />
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <p className="text-center text-gray-500 py-10">End of feed</p>
        )}

        <div ref={loaderRef} className="h-20" />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-gray-800/50 z-50">
        <div className="max-w-screen-md mx-auto flex justify-around items-center py-3">
          <Link href="/" className="flex flex-col items-center text-cyan-400">
            <Home size={28} />
            <span className="text-xs mt-1">Home</span>
          </Link>

          <Link href="/explore" className="flex flex-col items-center text-gray-400 hover:text-white">
            <Compass size={28} />
            <span className="text-xs mt-1">Explore</span>
          </Link>

          <Link href="/studio" className="flex flex-col items-center -mt-10">
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center shadow-xl shadow-cyan-500/30">
              <Plus size={32} className="text-white" />
            </div>
          </Link>

          <Link href="/alerts" className="flex flex-col items-center text-gray-400 hover:text-white">
            <Bell size={28} />
            <span className="text-xs mt-1">Alerts</span>
          </Link>

          <Link href="/profile" className="flex flex-col items-center text-gray-400 hover:text-white">
            {user?.google?.picture ? (
              <img
                src={user.google.picture}
                alt="Profile"
                className="w-7 h-7 rounded-full object-cover border-2 border-cyan-500/30"
              />
            ) : (
              <UserIcon size={28} />
            )}
            <span className="text-xs mt-1">You</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}