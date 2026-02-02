
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
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import Link from "next/link";

// export default function PortalFeed() {
//   const { authenticated, ready, user } = usePrivy();
//   const router = useRouter();
//   const [artifacts, setArtifacts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [originalMap, setOriginalMap] = useState<Map<string, any>>(new Map());

//   useEffect(() => {
//     const fetchArtifacts = async () => {
//       try {
//         // Fetch all artifacts, newest first
//         const { data: allPosts, error } = await supabase
//           .from("artifacts")
//           .select("*")
//           .order("created_at", { ascending: false }); // ← NEW: newest first

//         if (error) throw error;

//         // Build map of content_hash → earliest post
//         const earliestByHash = new Map<string, any>();
//         allPosts?.forEach((post) => {
//           if (post.content_hash && post.content_hash !== "text_node") {
//             if (!earliestByHash.has(post.content_hash)) {
//               earliestByHash.set(post.content_hash, post);
//             } else {
//               // Keep the oldest one
//               const currentEarliest = earliestByHash.get(post.content_hash);
//               if (new Date(post.created_at) < new Date(currentEarliest.created_at)) {
//                 earliestByHash.set(post.content_hash, post);
//               }
//             }
//           }
//         });

//         setOriginalMap(earliestByHash);
//         setArtifacts(allPosts || []);
//       } catch (err) {
//         console.error("Feed fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (ready && authenticated) fetchArtifacts();
//   }, [ready, authenticated]);

//   useEffect(() => {
//     if (ready && !authenticated) router.push("/");
//   }, [ready, authenticated, router]);

//   if (!ready || loading) {
//     return (
//       <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
//         <Hexagon size={40} className="text-cyan-500 animate-spin" />
//         <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mt-4">Syncing...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="h-[100dvh] w-screen bg-black text-white font-sans flex flex-col overflow-hidden relative">
//       {/* Nav */}
//       <nav className="shrink-0 flex items-center justify-between px-6 py-6 bg-black border-b border-white/5 z-[100]">
//         <Link href="/profile" className="w-8 h-8 rounded-full border border-cyan-500/30 overflow-hidden bg-zinc-950 flex items-center justify-center">
//           {user?.google?.picture ? (
//             <img src={user.google.picture} alt="P" className="w-full h-full object-cover" />
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
//           {artifacts.map((post) => {
//             const isOriginal = originalMap.get(post.content_hash)?.id === post.id;
//             const originalPost = originalMap.get(post.content_hash);

//             return (
//               <div key={post.id} className="group">
//                 <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950 border border-white/10 rounded-[2.5rem]">
//                   {post.content_url !== "text_node" ? (
//                     <img src={post.content_url} className="w-full h-full object-cover" alt="Art" />
//                   ) : (
//                     <div className="w-full h-full flex items-center justify-center p-10 bg-[#080808]">
//                       <p className="text-lg font-light text-zinc-400 italic text-center leading-relaxed">
//                         "{post.caption}"
//                       </p>
//                     </div>
//                   )}

//                   {/* Creator/Reposter Badge */}
//                   <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
//                     <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
//                       isOriginal
//                         ? "bg-green-500/20 text-green-300 border border-green-500/30"
//                         : "bg-zinc-700/80 text-zinc-300 border border-zinc-600/50"
//                     }`}>
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
//                       {post.signature.slice(0, 6)}...{post.signature.slice(-4)}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-4 px-4">
//                   {post.content_url !== "text_node" && (
//                     <p className="text-sm text-zinc-200 mb-2">{post.caption}</p>
//                   )}
//                   <span className="text-[9px] text-zinc-700 uppercase tracking-widest font-black">
//                     Provenance: {post.author_did.slice(-8)}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
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
// import { getShieldedFeed } from "@/app/actions/get-feed"; // ← your server action

// export default function PortalFeed() {
//   const { authenticated, ready, user } = usePrivy();
//   const router = useRouter();

//   const [artifacts, setArtifacts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [hasMore, setHasMore] = useState(true);
//   const [originalMap, setOriginalMap] = useState<Map<string, any>>(new Map());
//   const loaderRef = useRef<HTMLDivElement>(null);

//   const fetchArtifacts = async (afterId?: string | null) => {
//     if (!hasMore) return;

//     setLoading(true);

//     try {
//       console.log("Fetching feed...", { afterId });

//       const result = await getShieldedFeed({
//         limit: 10,
//         afterId,
//       });

//       console.log("Feed result:", result);

//       if (!result.success || !result.data?.length) {
//         console.log("No more items or error");
//         setHasMore(false);
//         return;
//       }

//       // Merge new items
//       setArtifacts((prev) => [...prev, ...result.data]);

//       // Update original map (earliest per hash)
//       const newMap = new Map(originalMap);
//       result.data.forEach((post: any) => {
//         if (post.content_hash && post.content_hash !== "text_node") {
//           if (!newMap.has(post.content_hash)) {
//             newMap.set(post.content_hash, post);
//           } else {
//             const current = newMap.get(post.content_hash);
//             if (new Date(post.created_at) < new Date(current.created_at)) {
//               newMap.set(post.content_hash, post);
//             }
//           }
//         }
//       });
//       setOriginalMap(newMap);
//     } catch (err) {
//       console.error("Feed fetch failed:", err);
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
//     if (!loaderRef.current || !hasMore) return;

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
//   }, [artifacts, hasMore]);

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
//           {user?.google?.picture ? (
//             <img src={user.google.picture} alt="P" className="w-full h-full object-cover" />
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
//           {artifacts.length === 0 && !loading && (
//             <div className="text-center py-20 text-zinc-500">
//               No content yet. Be the first to upload!
//             </div>
//           )}

//           {artifacts.map((post) => {
//             const isOriginal = originalMap.get(post.content_hash)?.id === post.id;
//             const originalPost = originalMap.get(post.content_hash);

//             return (
//               <div key={post.id} className="group">
//                 <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950 border border-white/10 rounded-[2.5rem]">
//                   {post.signed_url ? (
//                     post.media_type?.startsWith("video") ? (
//                       <video
//                         src={post.signed_url}
//                         className="w-full h-full object-cover"
//                         loop
//                         muted
//                         playsInline
//                         autoPlay
//                         preload="metadata"
//                       />
//                     ) : (
//                       <img
//                         src={post.signed_url}
//                         className="w-full h-full object-cover"
//                         alt={post.caption || "artifact"}
//                       />
//                     )
//                   ) : post.content_url === "text_node" ? (
//                     <div className="w-full h-full flex items-center justify-center p-10 bg-[#080808]">
//                       <p className="text-lg font-light text-zinc-400 italic text-center leading-relaxed">
//                         "{post.caption}"
//                       </p>
//                     </div>
//                   ) : null}

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
//           {hasMore && (
//             <div ref={loaderRef} className="py-12 flex justify-center">
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
  Plus,
  Hexagon,
  ShieldCheck,
  User as UserIcon,
  Menu,
  Crown,
  Copy,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { getShieldedFeed } from "@/app/actions/get-feed";

export default function PortalFeed() {
  const { authenticated, ready, user } = usePrivy();
  const router = useRouter();

  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null); // ← new: show errors
  const [hasMore, setHasMore] = useState(true);
  const [originalMap, setOriginalMap] = useState<Map<string, any>>(new Map());
  const loaderRef = useRef<HTMLDivElement>(null);

  const fetchArtifacts = async (afterId?: string | null) => {
    if (!hasMore || !authenticated) return;

    setLoading(true);
    setFetchError(null);

    try {
      console.log("Fetching feed...", { afterId, userId: user?.id });

      const result = await getShieldedFeed({
        limit: 10,
        afterId,
      });

      console.log("Feed result:", result); // ← debug: see what server returns

      if (!result.success) {
        throw new Error(result.error || "Feed fetch failed");
      }

      if (!result.data?.length) {
        console.log("No more items");
        setHasMore(false);
      } else {
        setArtifacts((prev) => [...prev, ...result.data]);

        const newMap = new Map(originalMap);
        result.data.forEach((post: any) => {
          if (post.content_hash && post.content_hash !== "text_node") {
            if (!newMap.has(post.content_hash) || new Date(post.created_at) < new Date(newMap.get(post.content_hash).created_at)) {
              newMap.set(post.content_hash, post);
            }
          }
        });
        setOriginalMap(newMap);
      }
    } catch (err: any) {
      console.error("Feed fetch error:", err);
      setFetchError(err.message || "Failed to load feed");
      setHasMore(false);
    } finally {
      setLoading(false); // ← always reset loading
    }
  };

  // Initial fetch
  useEffect(() => {
    if (ready && authenticated) {
      console.log("User ready & authenticated → starting feed fetch");
      fetchArtifacts();
    }
  }, [ready, authenticated]);

  // Infinite scroll
  useEffect(() => {
    if (!loaderRef.current || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const lastId = artifacts[artifacts.length - 1]?.id;
          console.log("Loading more... last ID:", lastId);
          fetchArtifacts(lastId);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [artifacts, hasMore, loading]);

  // Redirect if not authenticated
  useEffect(() => {
    if (ready && !authenticated) {
      console.log("Not authenticated → redirecting to /");
      router.push("/");
    }
  }, [ready, authenticated, router]);

  if (!ready) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
        <Hexagon size={40} className="text-cyan-500 animate-spin" />
        <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mt-4">Initializing...</p>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] w-screen bg-black text-white font-sans flex flex-col overflow-hidden relative">
      {/* Nav */}
      <nav className="shrink-0 flex items-center justify-between px-6 py-6 bg-black border-b border-white/5 z-[100]">
        <Link href="/profile" className="w-8 h-8 rounded-full border border-cyan-500/30 overflow-hidden bg-zinc-950 flex items-center justify-center">
          {user && user.google && typeof (user.google as any).picture === 'string' && (user.google as any).picture ? (
            <img 
              src={(user.google as any).picture} 
              alt="P" 
              className="w-full h-full object-cover" 
            />
          ) : (
            <UserIcon size={14} className="text-zinc-600" />
          )}
        </Link>
        <div className="flex flex-col items-center">
          <h1 className="text-[11px] font-black tracking-[0.5em] uppercase">Portal</h1>
          <span className="text-[7px] text-cyan-500 tracking-[0.3em] uppercase font-bold">Firehose</span>
        </div>
        <Menu size={20} className="text-zinc-500" />
      </nav>

      {/* Feed */}
      <main className="flex-1 overflow-y-auto px-4 pt-6 pb-40 scrollbar-hide">
        <div className="max-w-md mx-auto space-y-12">
          {/* Show error if fetch failed */}
          {fetchError && (
            <div className="text-center py-10 text-red-400">
              {fetchError} — <button onClick={() => fetchArtifacts()} className="underline">Retry</button>
            </div>
          )}

          {/* Loading state */}
          {loading && artifacts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="animate-spin text-cyan-500" size={48} />
              <p className="mt-4 text-zinc-400">Loading firehose...</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && artifacts.length === 0 && !fetchError && (
            <div className="text-center py-20 text-zinc-500">
              No content yet. Be the first to upload in Studio!
            </div>
          )}

          {/* Artifacts list */}
          {artifacts.map((post, index) => {
            const isOriginal = originalMap.get(post.content_hash)?.id === post.id;
            const originalPost = originalMap.get(post.content_hash);
            const isVideo = post.media_type?.startsWith("video") || 
                           post.content_url?.toLowerCase().endsWith('.mp4') || 
                           post.content_url?.toLowerCase().endsWith('.mov') || 
                           post.content_url?.toLowerCase().endsWith('.webm');

            return (
              <div key={post.id || `post-${index}`} className="group">
                <div className="relative aspect-[4/5] overflow-hidden bg-zinc-950 border border-white/10 rounded-[2.5rem]">
                  {post.signed_url ? (
                    isVideo ? (
                      <video
                        src={post.signed_url}
                        className="w-full h-full object-cover"
                        loop
                        muted
                        playsInline
                        autoPlay
                        preload="metadata"
                        onError={(e) => console.error("Video load error:", e)}
                      />
                    ) : (
                      <img
                        src={post.signed_url}
                        className="w-full h-full object-cover"
                        alt={post.caption || "artifact"}
                        onError={(e) => console.error("Image load error:", e)}
                      />
                    )
                  ) : post.content_url === "text_node" ? (
                    <div className="w-full h-full flex items-center justify-center p-10 bg-[#080808]">
                      <p className="text-lg font-light text-zinc-400 italic text-center leading-relaxed">
                        "{post.caption}"
                      </p>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-500">
                      <p>Media not available</p>
                    </div>
                  )}

                  {/* Creator/Reposter Badge */}
                  <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                    <div
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                        isOriginal
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : "bg-zinc-700/80 text-zinc-300 border border-zinc-600/50"
                      }`}
                    >
                      {isOriginal ? (
                        <>
                          <Crown size={12} /> Creator
                        </>
                      ) : (
                        <>
                          <Copy size={12} /> Reposter
                        </>
                      )}
                    </div>

                    {!isOriginal && originalPost && (
                      <Link
                        href={`/profile?did=${originalPost.author_did}`}
                        className="text-[9px] text-cyan-400 hover:underline"
                      >
                        Original by {originalPost.author_did.slice(-6)}
                      </Link>
                    )}
                  </div>

                  {/* Signature Badge */}
                  <div className="absolute bottom-5 left-5 flex items-center gap-2 px-3 py-1.5 glass rounded-full border border-cyan-500/30">
                    <ShieldCheck size={12} className="text-cyan-400" />
                    <span className="text-[9px] font-mono text-cyan-100 uppercase">
                      {post.signature?.slice(0, 6)}...{post.signature?.slice(-4)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 px-4">
                  {post.caption && post.content_url !== "text_node" && (
                    <p className="text-sm text-zinc-200 mb-2">{post.caption}</p>
                  )}
                  <span className="text-[9px] text-zinc-700 uppercase tracking-widest font-black">
                    Provenance: {post.author_did.slice(-8)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Infinite scroll loader */}
          {hasMore && !loading && (
            <div ref={loaderRef} className="py-12 flex justify-center">
              <Loader2 className="animate-spin text-cyan-500" size={32} />
            </div>
          )}

          {loading && (
            <div className="py-12 flex justify-center">
              <Loader2 className="animate-spin text-cyan-500" size={32} />
            </div>
          )}

          {!hasMore && artifacts.length > 0 && (
            <p className="text-center text-zinc-500 py-10">End of feed</p>
          )}
        </div>
      </main>

      {/* Dock */}
      <div className="absolute bottom-12 left-0 right-0 z-[9999] flex justify-center px-6 pointer-events-none">
        <div className="pointer-events-auto flex items-center justify-between w-full max-w-[340px] h-16 bg-zinc-900/90 backdrop-blur-3xl border border-white/10 rounded-full px-8 shadow-[0_20px_60px_rgba(0,0,0,1)] relative">
          <Link href="/feed">
            <Hexagon size={22} className="text-white" />
          </Link>

          <Link href="/studio" className="relative flex items-center h-full">
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="w-16 h-16 bg-cyan-400 rounded-full flex items-center justify-center text-black absolute -top-10 left-1/2 -translate-x-1/2 border-[5px] border-black shadow-[0_0_30px_rgba(6,182,212,0.5)]"
            >
              <Plus size={32} strokeWidth={3} />
            </motion.div>
          </Link>

          <Link href="/profile">
            <UserIcon size={22} className="text-zinc-500 hover:text-white transition-colors" />
          </Link>
        </div>
      </div>
    </div>
  );
}