
// "use client";

// import { motion } from "framer-motion";
// import { usePrivy } from "@privy-io/react-auth";
// import {
//   Hexagon,
//   ShieldCheck,
//   Globe,
//   CheckCircle2,
//   Maximize2,
//   User as UserIcon,
//   Calendar,
//   LogOut,
//   Cpu,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import { supabase } from "@/lib/supabase";
// import Link from "next/link";

// export default function SovereignProfile() {
//   const { user, authenticated, ready, logout } = usePrivy();
//   const router = useRouter();

//   const [artifacts, setArtifacts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProtocolData = async () => {
//       if (!user?.id) return;

//       try {
//         const { data, error } = await supabase
//           .from("artifacts")
//           .select("*")
//           .eq("author_did", user.id)
//           .order("created_at", { ascending: false });

//         if (error) throw error;
//         if (data) setArtifacts(data);
//       } catch (err) {
//         console.error("Protocol Sync Error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (ready && authenticated) fetchProtocolData();
//   }, [ready, authenticated, user]);

//   const handleExitProtocol = async () => {
//     try {
//       await logout();
//       window.location.assign("/");
//     } catch (error) {
//       console.error("Exit Error:", error);
//     }
//   };

//   useEffect(() => {
//     if (ready && !authenticated) router.push("/");
//   }, [ready, authenticated, router]);

//   if (!ready || loading) {
//     return (
//       <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
//         <Hexagon size={40} className="text-cyan-500 animate-spin" />
//         <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mt-4 font-black">
//           Syncing Ledger
//         </p>
//       </div>
//     );
//   }

//   const latestArtifact = artifacts[0];
//   const artifactCount = artifacts.length;
//   const joinDate = user?.createdAt ? new Date(user.createdAt).getFullYear() : "2026";

//   return (
//     <div className="min-h-screen bg-[#000] text-white font-sans overflow-x-hidden relative">
//       <div
//         className="fixed inset-0 z-0 opacity-20 pointer-events-none"
//         style={{
//           backgroundImage: `linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)`,
//           backgroundSize: "30px 30px",
//         }}
//       />

//       <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-8 bg-black/60 backdrop-blur-md border-b border-white/5">
//         <motion.button
//           whileTap={{ scale: 0.9 }}
//           onClick={handleExitProtocol}
//           className="flex items-center gap-2 px-3 py-2 bg-red-500/5 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all group"
//         >
//           <LogOut size={18} className="text-red-500" />
//           <span className="text-[9px] font-black uppercase tracking-widest text-red-500/80 group-hover:text-red-500 transition-colors">
//             Exit
//           </span>
//         </motion.button>

//         <div className="flex items-center gap-2">
//           <h1 className="text-[12px] font-black tracking-[0.5em] uppercase text-white">Sovereign ID</h1>
//           <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00ffff] animate-pulse" />
//         </div>

//         <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 p-0.5 bg-zinc-900">
//           {user?.google?.picture ? (
//             <img src={user.google.picture} alt="me" className="rounded-full w-full h-full object-cover" />
//           ) : (
//             <UserIcon size={18} className="m-auto text-zinc-700 mt-2" />
//           )}
//         </div>
//       </nav>

//       <main className="relative z-10 px-5 max-w-lg mx-auto pb-48 pt-6 space-y-6">
//         <div className="grid grid-cols-2 gap-4">
//           <div className="bg-[#080808] border border-white/5 rounded-[1.8rem] p-6 flex flex-col items-center relative overflow-hidden group">
//             <div className="absolute top-3 right-3 text-cyan-500/30"><ShieldCheck size={14} /></div>
//             <div className="w-20 h-20 rounded-full border border-cyan-500/20 p-1.5 mb-5 shadow-[0_0_30px_rgba(6,182,212,0.1)]">
//               {user?.google?.picture ? (
//                 <img src={user.google.picture} className="w-full h-full rounded-full object-cover" alt="avatar" />
//               ) : (
//                 <div className="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center">
//                   <UserIcon size={24} />
//                 </div>
//               )}
//             </div>
//             <div className="bg-zinc-900/80 px-3 py-1 rounded-md mb-3 border border-white/5 w-full text-center">
//               <p className="text-[8px] font-mono text-zinc-500 uppercase tracking-tighter truncate">
//                 DID: {user?.id.slice(0, 18)}...
//               </p>
//             </div>
//             <div className="bg-cyan-950/20 px-4 py-1.5 rounded-full border border-cyan-500/20">
//               <span className="text-[8px] text-cyan-400 font-black uppercase tracking-[0.2em]">
//                 Since {joinDate}
//               </span>
//             </div>
//           </div>

//           <div className="bg-[#080808] border border-white/5 rounded-[1.8rem] p-6 relative overflow-hidden">
//             <div className="absolute -bottom-6 -right-6 opacity-5 text-cyan-400 rotate-12"><Globe size={120} /></div>
//             <p className="text-[9px] uppercase font-black text-zinc-600 tracking-widest mb-6">Network Health</p>
//             <div className="space-y-5">
//               <div className="flex items-center justify-between">
//                 <div className="max-w-[85px]">
//                   <p className="text-[11px] font-bold text-zinc-200 truncate">
//                     {user?.google?.email || user?.email?.address}
//                   </p>
//                   <p className="text-[7px] text-zinc-600 uppercase font-black">Identity Node</p>
//                 </div>
//                 <CheckCircle2 size={16} className="text-cyan-400" />
//               </div>
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-[11px] font-bold text-zinc-200">{artifactCount}</p>
//                   <p className="text-[7px] text-zinc-600 uppercase font-black">Signed Blocks</p>
//                 </div>
//                 <div className="w-4 h-4 rounded-full border border-cyan-500/20 flex items-center justify-center">
//                   <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00ffff]" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="bg-[#080808] border border-white/5 rounded-[2.2rem] p-8 relative overflow-hidden group shadow-2xl">
//           <div className="absolute top-6 right-8 z-20">
//             <span className="bg-cyan-500 text-black px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(6,182,212,0.4)]">
//               Featured Artifact
//             </span>
//           </div>

//           {latestArtifact ? (
//             <div className="relative z-10 space-y-10">
//               <div className="w-full aspect-video rounded-3xl overflow-hidden border border-white/5 shadow-inner">
//                 <img
//                   src={latestArtifact.content_url}
//                   className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
//                   alt="Featured"
//                 />
//               </div>
//               <div className="px-1">
//                 <h2 className="text-2xl font-black tracking-tighter leading-tight text-white mb-4">
//                   {latestArtifact.caption || "Untitled Protocol Data"}
//                 </h2>
//                 <div className="flex items-center gap-4 text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em]">
//                   <div className="flex items-center gap-1.5 text-cyan-500">
//                     <ShieldCheck size={12} />
//                     <span>Verified</span>
//                   </div>
//                   <div className="w-1 h-1 rounded-full bg-zinc-800" />
//                   <div className="flex items-center gap-1.5">
//                     <Calendar size={12} />
//                     <span>{new Date(latestArtifact.created_at).toLocaleDateString("en-IN")}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="py-24 text-center">
//               <Hexagon size={48} strokeWidth={0.5} className="mx-auto text-zinc-800 mb-4 animate-pulse" />
//               <p className="text-[10px] uppercase font-black text-zinc-700 tracking-widest">
//                 Protocol Awaiting Feed
//               </p>
//             </div>
//           )}
//         </div>

//         <div className="pt-4 space-y-6">
//           <div className="flex items-center justify-between px-2">
//             <div className="flex items-center gap-3">
//               <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
//               <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Protocol Archive</h3>
//             </div>
//             <button className="text-[9px] font-black uppercase text-zinc-700 tracking-widest hover:text-white transition-colors">
//               V 1.0.4
//             </button>
//           </div>

//           <div className="grid grid-cols-2 gap-4">
//             {artifacts.length > 0 ? (
//               artifacts.slice(0, 4).map((art) => (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   key={art.id}
//                   className="relative aspect-square rounded-[1.8rem] overflow-hidden border border-white/5 bg-zinc-950 group"
//                 >
//                   <img
//                     src={art.content_url}
//                     className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
//                     alt="Art"
//                   />
//                   <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-white/10">
//                     <p className="text-[7px] font-mono text-cyan-400 uppercase tracking-tighter">
//                       {art.signature.slice(0, 12)}
//                     </p>
//                   </div>
//                 </motion.div>
//               ))
//             ) : (
//               <div className="col-span-2 py-16 border-2 border-dashed border-zinc-900 rounded-[2rem] text-center text-[10px] uppercase text-zinc-800 tracking-[0.3em] font-bold">
//                 Zero Proofs Found
//               </div>
//             )}
//           </div>
//         </div>

//         {/* NEW: Link to Terminal */}
//         <div className="pt-8 px-2">
//           <Link href="/terminal">
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full py-6 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 text-cyan-300 font-black uppercase tracking-widest text-lg rounded-2xl flex items-center justify-center gap-4 hover:from-cyan-500/30 hover:to-cyan-600/30 transition-all shadow-[0_0_30px_rgba(6,182,212,0.15)]"
//             >
//               <Cpu size={24} />
//               Sovereignty Terminal — Export Data & Keys
//             </motion.div>
//           </Link>
//         </div>
//       </main>

//       <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-[100]">
//         <div className="max-w-lg mx-auto">
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => router.push("/studio")}
//             className="w-full py-6 bg-cyan-400 text-black flex items-center justify-center gap-4 rounded-2xl shadow-[0_20px_50px_rgba(6,182,212,0.3)] transition-all group"
//           >
//             <Maximize2 size={18} className="group-hover:rotate-90 transition-transform duration-500" />
//             <span className="text-[13px] font-black uppercase tracking-[0.5em]">Manage Dashboard</span>
//           </motion.button>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import { usePrivy, useSignMessage } from "@privy-io/react-auth";
// import { motion } from "framer-motion";
// import {
//   Hexagon,
//   ShieldCheck,
//   Globe,
//   CheckCircle2,
//   Maximize2,
//   User,
//   Calendar,
//   LogOut,
//   Cpu,
//   Edit,
//   Check,
//   X,
//   Loader2,
// } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { supabase } from "@/lib/supabase";

// export default function SovereignProfile() {
//   const { user, authenticated, ready, logout, signMessage } = usePrivy();
//   const router = useRouter();

//   const [artifacts, setArtifacts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [profile, setProfile] = useState<any>(null);
//   const [isEditingUsername, setIsEditingUsername] = useState(false);
//   const [newUsername, setNewUsername] = useState("");
//   const [claimStatus, setClaimStatus] = useState<"idle" | "signing" | "success" | "error">("idle");
//   const [claimError, setClaimError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       if (!user?.id) return;

//       try {
//         const { data: profileData } = await supabase
//           .from("profiles")
//           .select("*")
//           .eq("did", user.id)
//           .maybeSingle();

//         setProfile(profileData || {});

//         if (!profileData?.username) {
//           setIsEditingUsername(true);
//         }

//         const { data: arts } = await supabase
//           .from("artifacts")
//           .select("*")
//           .eq("author_did", user.id)
//           .order("created_at", { ascending: false });

//         setArtifacts(arts || []);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (ready && authenticated) fetchData();
//   }, [ready, authenticated, user]);

//   const handleClaimUsername = async () => {
//     if (!user || !newUsername.trim()) return;

//     const cleanHandle = newUsername.trim().toLowerCase().replace(/^@/, "");
//     if (!/^[a-z0-9_]{3,20}$/.test(cleanHandle)) {
//       setClaimError("Username must be 3–20 chars (letters, numbers, underscore only)");
//       return;
//     }

//     setClaimStatus("signing");
//     setClaimError(null);

//     try {
//       // Check username taken
//       const { data: usernameTaken } = await supabase
//         .from("profiles")
//         .select("did")
//         .eq("username", cleanHandle)
//         .maybeSingle();

//       if (usernameTaken) {
//         throw new Error("Username already claimed");
//       }

//       // Check if profile exists
//       const { data: existing } = await supabase
//         .from("profiles")
//         .select("id")
//         .eq("did", user.id)
//         .maybeSingle();

//       // Sign message
//       const walletAddress = user.wallet?.address || "unknown";
//       const message = `I claim @${cleanHandle} for my public key ${walletAddress}`;
//       const { signature } = await signMessage({ message });

//       if (existing) {
//         // Update
//         const { error } = await supabase
//           .from("profiles")
//           .update({
//             username: cleanHandle,
//             username_claim_signature: signature,
//             username_claim_message: message,
//           })
//           .eq("id", existing.id);

//         if (error) throw error;
//       } else {
//         // Insert new - Supabase auto-generates id now
//         const { error } = await supabase
//           .from("profiles")
//           .insert({
//             did: user.id,
//             username: cleanHandle,
//             username_claim_signature: signature,
//             username_claim_message: message,
//           });

//         if (error) throw error;
//       }

//       // Refresh profile
//       setProfile((prev: any) => ({
//         ...prev,
//         username: cleanHandle,
//         username_claim_signature: signature,
//         username_claim_message: message,
//       }));

//       setIsEditingUsername(false);
//       setClaimStatus("success");
//     } catch (err: any) {
//       console.error("Claim failed:", err);
//       setClaimError(err.message || "Claim failed - check console");
//       setClaimStatus("error");
//     }
//   };

//   const handleExitProtocol = async () => {
//     await logout();
//     router.push("/");
//   };

//   useEffect(() => {
//     if (ready && !authenticated) router.push("/");
//   }, [ready, authenticated, router]);

//   if (!ready || loading) {
//     return (
//       <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
//         <Loader2 className="animate-spin text-cyan-500" size={40} />
//         <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mt-4 font-black">
//           Syncing Ledger
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-[#000] text-white font-sans overflow-x-hidden relative">
//       {/* Background grid */}
//       <div
//         className="fixed inset-0 z-0 opacity-20 pointer-events-none"
//         style={{
//           backgroundImage: `linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)`,
//           backgroundSize: "30px 30px",
//         }}
//       />

//       {/* Top Nav */}
//       <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-8 bg-black/60 backdrop-blur-md border-b border-white/5">
//         <motion.button
//           whileTap={{ scale: 0.9 }}
//           onClick={handleExitProtocol}
//           className="flex items-center gap-2 px-3 py-2 bg-red-500/5 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all group"
//         >
//           <LogOut size={18} className="text-red-500" />
//           <span className="text-[9px] font-black uppercase tracking-widest text-red-500/80 group-hover:text-red-500 transition-colors">
//             Exit
//           </span>
//         </motion.button>

//         <div className="flex items-center gap-2">
//           <h1 className="text-[12px] font-black tracking-[0.5em] uppercase text-white">Sovereign ID</h1>
//           <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00ffff] animate-pulse" />
//         </div>

//         <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 p-0.5 bg-zinc-900">
//           {user?.google?.picture ? (
//             <img src={user.google.picture} alt="me" className="rounded-full w-full h-full object-cover" />
//           ) : (
//             <User size={18} className="m-auto text-zinc-700 mt-2" />
//           )}
//         </div>
//       </nav>

//       <main className="relative z-10 px-5 max-w-lg mx-auto pb-48 pt-6 space-y-6">
//         {/* Username Claim Section */}
//         <section className="bg-zinc-950 border border-cyan-500/20 rounded-2xl p-6">
//           <div className="flex items-center justify-between mb-4">
//             <h3 className="text-xl font-black flex items-center gap-2">
//               <Globe size={20} className="text-cyan-400" />
//               Username Claim
//             </h3>
//             {profile?.username && (
//               <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
//                 <CheckCircle2 size={16} /> Verified
//               </div>
//             )}
//           </div>

//           {profile?.username ? (
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-2xl font-black text-cyan-300">@{profile.username}</p>
//                 <p className="text-xs text-zinc-500 mt-1">Signed ownership deed</p>
//               </div>
//               <button
//                 onClick={() => setIsEditingUsername(true)}
//                 className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700"
//               >
//                 <Edit size={18} />
//               </button>
//             </div>
//           ) : isEditingUsername ? (
//             <div className="space-y-4">
//               <div className="flex items-center gap-2">
//                 <span className="text-cyan-400 font-bold text-xl">@</span>
//                 <input
//                   type="text"
//                   value={newUsername}
//                   onChange={(e) => setNewUsername(e.target.value)}
//                   placeholder="yourhandle"
//                   className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-600 focus:border-cyan-500 outline-none"
//                 />
//               </div>

//               {claimError && <p className="text-red-400 text-sm">{claimError}</p>}

//               <div className="flex gap-3">
//                 <button
//                   onClick={handleClaimUsername}
//                   disabled={claimStatus === "signing" || !newUsername.trim()}
//                   className="flex-1 py-3 bg-cyan-500 text-black font-bold rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
//                 >
//                   {claimStatus === "signing" ? (
//                     <Loader2 className="animate-spin" size={18} />
//                   ) : (
//                     <Check size={18} />
//                   )}
//                   Claim Username
//                 </button>

//                 <button
//                   onClick={() => setIsEditingUsername(false)}
//                   className="px-4 py-3 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700"
//                 >
//                   <X size={18} />
//                 </button>
//               </div>

//               {claimStatus === "success" && (
//                 <p className="text-green-400 text-sm text-center">Username claimed successfully!</p>
//               )}
//             </div>
//           ) : (
//             <button
//               onClick={() => setIsEditingUsername(true)}
//               className="w-full py-4 bg-cyan-500/20 text-cyan-300 font-bold rounded-xl border border-cyan-500/30 hover:bg-cyan-500/30 transition"
//             >
//               Claim Your @Username
//             </button>
//           )}
//         </section>

//         {/* Rest of profile */}
//         <div className="text-center text-zinc-600 py-10">
//           <p>Artifacts: {artifacts.length}</p>
//           <p>Other profile sections go here...</p>
//         </div>

// <div className="pt-8 px-2">
//           <Link href="/terminal">
//             <motion.div
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               className="w-full py-6 bg-gradient-to-r from-cyan-500/20 to-cyan-600/20 border border-cyan-500/30 text-cyan-300 font-black uppercase tracking-widest text-lg rounded-2xl flex items-center justify-center gap-4 hover:from-cyan-500/30 hover:to-cyan-600/30 transition-all shadow-[0_0_30px_rgba(6,182,212,0.15)]"
//             >
//               <Cpu size={24} />
//               Sovereignty Terminal — Export Data & Keys
//             </motion.div>
//           </Link>
//         </div>

//       </main>

//       <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-[100]">
//         <div className="max-w-lg mx-auto">
//        <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={() => router.push("/studio")}
//             className="w-full py-6 bg-cyan-400 text-black flex items-center justify-center gap-4 rounded-2xl shadow-[0_20px_50px_rgba(6,182,212,0.3)] transition-all group"
//           >
//             <Maximize2 size={18} className="group-hover:rotate-90 transition-transform duration-500" />
//             <span className="text-[13px] font-black uppercase tracking-[0.5em]">Manage Dashboard</span>
//           </motion.button>
//         </div>
//       </div>
//     </div>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { usePrivy, useSignMessage } from "@privy-io/react-auth";
import { motion } from "framer-motion";
import {
  Hexagon,
  ShieldCheck,
  Globe,
  CheckCircle2,
  Maximize2,
  User,
  Calendar,
  LogOut,
  Cpu,
  Edit,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { claimUsernameServer } from "@/app/actions/claim-username";

export default function SovereignProfile() {
  const { user, authenticated, ready, logout, signMessage } = usePrivy();
  const router = useRouter();

  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [claimStatus, setClaimStatus] = useState<"idle" | "signing" | "success" | "error">("idle");
  const [claimError, setClaimError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) return;

      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("did", user.id)
          .maybeSingle();

        setProfile(profileData || {});

        if (profileData?.username) {
          setNewUsername(profileData.username);
        } else {
          setIsEditingUsername(true);
        }

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

    if (ready && authenticated) fetchData();
  }, [ready, authenticated, user]);

  const handleClaimUsername = async () => {
    if (!user || !newUsername.trim()) return;

    const cleanHandle = newUsername.trim().toLowerCase().replace(/^@/, "");
    if (!/^[a-z0-9_]{3,20}$/.test(cleanHandle)) {
      setClaimError("Username must be 3–20 characters (letters, numbers, underscore only)");
      return;
    }

    setClaimStatus("signing");
    setClaimError(null);

    try {
      const walletAddress = user.wallet?.address || "unknown";
      const message = `I claim @${cleanHandle} for my public key ${walletAddress}`;

      const { signature } = await signMessage({ message });

      const result = await claimUsernameServer({
        did: user.id,
        username: cleanHandle,
        message,
        signature,
        walletAddress,
        avatarUrl: user && user.google && typeof (user.google as any).picture === 'string' ? (user.google as any).picture : null,
      });

      if (!result.success) {
        throw new Error(result.error || "Claim failed on server");
      }

      setProfile((prev: any) => ({
        ...prev,
        username: cleanHandle,
        username_claim_signature: signature,
        username_claim_message: message,
        wallet_address: walletAddress,
        avatar_url: user && user.google && typeof (user.google as any).picture === 'string' ? (user.google as any).picture : prev?.avatar_url || null,
      }));

      setIsEditingUsername(false);
      setClaimStatus("success");
    } catch (err: any) {
      console.error("Claim error:", err);
      setClaimError(err.message || "Failed to claim username – please try again");
      setClaimStatus("error");
    }
  };

  const handleExitProtocol = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  useEffect(() => {
    if (ready && !authenticated) router.push("/");
  }, [ready, authenticated, router]);

  if (!ready || loading) {
    return (
      <div className="h-screen w-screen bg-black flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={40} />
        <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 mt-4 font-black">
          Syncing Ledger...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#000] text-white font-sans overflow-x-hidden relative">
      {/* Background grid */}
      <div
        className="fixed inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#111 1px, transparent 1px), linear-gradient(90deg, #111 1px, transparent 1px)`,
          backgroundSize: "30px 30px",
        }}
      />

      {/* Top Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-8 bg-black/60 backdrop-blur-md border-b border-white/5">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handleExitProtocol}
          className="flex items-center gap-2 px-3 py-2 bg-red-500/5 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-all group"
        >
          <LogOut size={18} className="text-red-500" />
          <span className="text-[9px] font-black uppercase tracking-widest text-red-500/80 group-hover:text-red-500 transition-colors">
            Exit Protocol
          </span>
        </motion.button>

        <div className="flex items-center gap-2">
          <h1 className="text-[12px] font-black tracking-[0.5em] uppercase text-white">Sovereign ID</h1>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_10px_#00ffff] animate-pulse" />
        </div>

        <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 p-0.5 bg-zinc-900">
          {user && user.google && typeof (user.google as any).picture === 'string' && (user.google as any).picture ? (
            <img 
              src={(user.google as any).picture} 
              alt="avatar" 
              className="rounded-full w-full h-full object-cover" 
            />
          ) : (
            <User size={18} className="m-auto text-zinc-700 mt-2" />
          )}
        </div>
      </nav>

      <main className="relative z-10 px-5 max-w-lg mx-auto pb-48 pt-6 space-y-6">
        {/* Username Claim Section */}
        <section className="bg-zinc-950 border border-cyan-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-black flex items-center gap-2">
              <Globe size={20} className="text-cyan-400" />
              Username Claim
            </h3>

            {profile?.username && (
              <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                <CheckCircle2 size={16} />
                Verified
              </div>
            )}
          </div>

          {profile?.username && !isEditingUsername ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-black text-cyan-300">@{profile.username}</p>
                <p className="text-xs text-zinc-500 mt-1">Signed ownership deed</p>
              </div>
              <button
                onClick={() => setIsEditingUsername(true)}
                className="p-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
              >
                <Edit size={18} />
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-cyan-400 font-bold text-xl">@</span>
                <input
                  type="text"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="yourhandle"
                  className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-600 focus:border-cyan-500 outline-none"
                  disabled={claimStatus === "signing"}
                />
              </div>

              {claimError && <p className="text-red-400 text-sm">{claimError}</p>}

              <div className="flex gap-3">
                <button
                  onClick={handleClaimUsername}
                  disabled={claimStatus === "signing" || !newUsername.trim()}
                  className="flex-1 py-3 bg-cyan-500 text-black font-bold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                >
                  {claimStatus === "signing" ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Signing & Claiming...
                    </>
                  ) : (
                    <>
                      <Check size={18} />
                      Claim Username
                    </>
                  )}
                </button>

                {isEditingUsername && (
                  <button
                    onClick={() => setIsEditingUsername(false)}
                    className="px-4 py-3 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700 transition-colors"
                    disabled={claimStatus === "signing"}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {claimStatus === "success" && (
                <p className="text-green-400 text-sm text-center font-medium">
                  Username claimed successfully!
                </p>
              )}
            </div>
          )}
        </section>

        {/* Placeholder for other content */}
        <div className="text-center text-zinc-600 py-10">
          <p className="text-lg">Your artifacts and profile details will appear here</p>
          <p className="text-sm mt-2">Total artifacts: {artifacts.length}</p>
        </div>
      </main>

      {/* Floating dashboard button */}
      <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-[100]">
        <div className="max-w-lg mx-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push("/studio")}
            className="w-full py-6 bg-cyan-400 text-black flex items-center justify-center gap-4 rounded-2xl shadow-[0_20px_50px_rgba(6,182,212,0.3)] transition-all group"
          >
            <Maximize2 size={18} className="group-hover:rotate-90 transition-transform duration-500" />
            <span className="text-[13px] font-black uppercase tracking-[0.5em]">
              Manage Dashboard
            </span>
          </motion.button>
        </div>
      </div>
    </div>
  );
}