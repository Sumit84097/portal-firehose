
// "use client";

// import { useState, useEffect } from "react";
// import { usePrivy } from "@privy-io/react-auth";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   ShieldCheck,
//   Download,
//   Lock,
//   Loader2,
//   Hexagon,
//   AlertTriangle,
//   X,
//   HardDrive,
// } from "lucide-react";
// import { supabase } from "@/lib/supabase";
// import { useRouter } from "next/navigation";

// export default function Terminal() {
//   const { user, ready, exportWallet } = usePrivy();
//   const router = useRouter();

//   const [artifacts, setArtifacts] = useState<any[]>([]);
//   const [fetchError, setFetchError] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(true);
//   const [storageInfo, setStorageInfo] = useState<{
//     sizeDisplay: string;
//     objectCount: number;
//     sizeBytes: number;
//   } | null>(null);
//   const [exportingData, setExportingData] = useState(false);
//   const [keyExportStatus, setKeyExportStatus] = useState<string | null>(null);
//   const [showKeyConfirm, setShowKeyConfirm] = useState(false);

//   const [privacySettings, setPrivacySettings] = useState({
//     publicProfile: true,
//     p2pDiscovery: false,
//     localEncryption: true,
//     stripMetadata: false,
//   });

//   useEffect(() => {
//     if (!ready) return;

//     if (!user) {
//       router.replace("/");
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         const { data: arts, error: artError } = await supabase
//           .from("artifacts")
//           .select("*")
//           .eq("author_did", user.id)
//           .order("created_at", { ascending: false });

//         if (artError) throw artError;
//         setArtifacts(arts || []);

//         const r2Res = await fetch(`/api/r2-user-size?userId=${encodeURIComponent(user.id)}`);
//         if (!r2Res.ok) throw new Error(await r2Res.text());

//         const r2Data = await r2Res.json();
//         if (r2Data.error) throw new Error(r2Data.error);

//         setStorageInfo({
//           sizeDisplay: r2Data.sizeDisplay,
//           objectCount: r2Data.objectCount,
//           sizeBytes: r2Data.sizeBytes,
//         });
//       } catch (err: any) {
//         console.error("Terminal fetch error:", err);
//         setFetchError(err.message || "Failed to load data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [ready, user, router]);

//   const handleExportData = async () => {
//     if (!user || exportingData) return;
//     setExportingData(true);

//     try {
//       const exportData = {
//         did: user.id,
//         createdAt: user.createdAt,
//         exportedAt: new Date().toISOString(),
//         storage: storageInfo,
//         artifacts: artifacts.map((a) => ({
//           id: a.id,
//           caption: a.caption,
//           content_url: a.content_url,
//           signature: a.signature,
//           created_at: a.created_at,
//         })),
//       };

//       const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
//       const url = URL.createObjectURL(blob);
//       const link = document.createElement("a");
//       link.href = url;
//       link.download = `portal-full-export-${user.id.slice(-8)}.json`;
//       link.click();
//       URL.revokeObjectURL(url);
//     } catch (err: any) {
//       alert("Data export failed: " + err.message);
//     } finally {
//       setExportingData(false);
//     }
//   };

//   const handleKeyExport = async () => {
//     setShowKeyConfirm(false);
//     setKeyExportStatus("Starting export...");

//     try {
//       console.log("[KEY EXPORT START] exportWallet available:", !!exportWallet);

//       if (!exportWallet) {
//         throw new Error("exportWallet not available — check Privy SDK / dashboard");
//       }

//       console.log("[KEY EXPORT] Calling exportWallet()");
//       await exportWallet();  // This MUST be awaited directly in user gesture chain
//       console.log("[KEY EXPORT] Completed successfully");

//       setKeyExportStatus("Success! Private key exported — check Privy modal to copy.");
//     } catch (err: any) {
//       console.error("[KEY EXPORT ERROR]:", err);

//       let msg = err.message || "Unknown error";

//       if (err.message?.includes("User rejected")) {
//         msg = "Export cancelled by user";
//       } else if (err.message?.includes("disabled") || err.message?.includes("not allowed")) {
//         msg = "Key export is disabled in Privy dashboard — enable 'Allow key export'";
//       } else if (err.message?.includes("no wallet")) {
//         msg = "No wallet created yet — try creating one in Privy Home";
//       }

//       setKeyExportStatus(`Export failed: ${msg}`);
//     }
//   };

//   const toggleSetting = (key: keyof typeof privacySettings) => {
//     setPrivacySettings((prev) => ({ ...prev, [key]: !prev[key] }));
//   };

//   // ──────────────────────────────────────────────
//   // RENDER
//   // ──────────────────────────────────────────────

//   if (!ready) {
//     return (
//       <div className="min-h-screen bg-black flex items-center justify-center">
//         <Loader2 className="animate-spin text-cyan-500" size={64} />
//         <p className="ml-6 text-zinc-400 text-xl">Initializing terminal...</p>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
//         <Hexagon size={80} className="text-cyan-500 mb-8" />
//         <h2 className="text-4xl font-black mb-4">Sovereignty Terminal</h2>
//         <p className="text-zinc-400 mb-10 text-lg max-w-md">
//           Sign in to access your data export and private key controls.
//         </p>
//         <button
//           onClick={() => router.push("/")}
//           className="px-10 py-5 bg-cyan-500 text-black font-bold text-xl rounded-2xl hover:bg-cyan-400 transition"
//         >
//           Sign In
//         </button>
//       </div>
//     );
//   }

//   return (
//     <main className="min-h-screen bg-black text-white p-6 md:p-10 font-mono">
//       <header className="mb-12">
//         <h1 className="text-4xl md:text-5xl font-black tracking-tight">SOVEREIGNTY_CONFIG_V1</h1>
//         <p className="text-sm md:text-base text-zinc-500 mt-3">
//           TERMINAL — Prove ownership of your data
//         </p>
//       </header>

//       {fetchError && (
//         <div className="mb-10 p-6 bg-red-950/50 border border-red-500/30 rounded-2xl flex items-start gap-4">
//           <AlertTriangle className="text-red-400 mt-1" size={28} />
//           <div>
//             <h3 className="font-bold text-red-400">Error</h3>
//             <p className="text-red-300">{fetchError}</p>
//           </div>
//         </div>
//       )}

//       {/* DID Section */}
//       <section className="mb-12 bg-zinc-950 border border-cyan-500/20 rounded-2xl p-6 md:p-8">
//         <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
//           <div>
//             <p className="text-xs uppercase text-zinc-500">Decentralized ID</p>
//             <p className="text-lg md:text-2xl font-bold break-all mt-1">{user.id}</p>
//           </div>
//           <ShieldCheck className="text-cyan-400 flex-shrink-0" size={48} />
//         </div>
//         <p className="text-sm text-zinc-600 mt-4">
//           Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "N/A"}
//         </p>
//       </section>

//       {/* R2 Storage */}
//       <section className="mb-12">
//         <h2 className="text-2xl font-black mb-6 uppercase tracking-wider flex items-center gap-3">
//           <HardDrive size={24} className="text-cyan-400" />
//           R2 Storage Usage
//         </h2>
//         <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8">
//           {isLoading ? (
//             <div className="flex items-center py-8">
//               <Loader2 className="animate-spin text-cyan-500 mr-3" size={28} />
//               <p className="text-zinc-400">Calculating real usage from Cloudflare R2...</p>
//             </div>
//           ) : storageInfo ? (
//             <div className="space-y-6">
//               <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
//                 <div>
//                   <p className="text-sm text-zinc-400">Total Used</p>
//                   <p className="text-5xl md:text-6xl font-bold text-cyan-400 mt-2">
//                     {storageInfo.sizeDisplay}
//                   </p>
//                   <p className="text-sm text-zinc-500 mt-2">
//                     {storageInfo.objectCount} object{storageInfo.objectCount !== 1 ? "s" : ""}
//                   </p>
//                 </div>
//                 <div className="w-full md:w-64 h-4 bg-zinc-800 rounded-full overflow-hidden">
//                   <div
//                     className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-1000"
//                     style={{
//                       width: `${Math.min((storageInfo.sizeBytes / (100 * 1024 * 1024 * 1024)) * 100, 100)}%`,
//                     }}
//                   />
//                 </div>
//               </div>
//               <p className="text-sm text-zinc-600">
//                 This is your actual storage on Cloudflare R2 — fully under your control.
//               </p>
//             </div>
//           ) : (
//             <p className="text-zinc-500 text-center py-8">No storage data available</p>
//           )}
//         </div>
//       </section>

//       {/* Privacy Controls */}
//       <section className="mb-12">
//         <h2 className="text-2xl font-black mb-6 uppercase tracking-wider">Privacy Controls</h2>
//         <div className="space-y-5 bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8">
//           {Object.entries(privacySettings).map(([key, value]) => (
//             <div key={key} className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-0">
//               <span className="capitalize text-base">{key.replace(/([A-Z])/g, " $1")}</span>
//               <button
//                 onClick={() => toggleSetting(key as keyof typeof privacySettings)}
//                 className={`w-14 h-7 rounded-full transition-colors ${
//                   value ? "bg-cyan-500" : "bg-zinc-700"
//                 } p-1`}
//               >
//                 <div
//                   className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
//                     value ? "translate-x-7" : "translate-x-0"
//                   }`}
//                 />
//               </button>
//             </div>
//           ))}
//         </div>
//       </section>

//       {/* Export Actions */}
//       <section className="space-y-6">
//         <motion.button
//           whileTap={{ scale: 0.98 }}
//           onClick={handleExportData}
//           disabled={exportingData}
//           className="w-full py-6 bg-cyan-500 text-black font-black uppercase tracking-widest text-lg rounded-2xl flex items-center justify-center gap-4 shadow-xl disabled:opacity-50"
//         >
//           {exportingData ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />}
//           Download My Data (JSON)
//         </motion.button>

//         <motion.button
//           whileTap={{ scale: 0.98 }}
//           onClick={() => setShowKeyConfirm(true)}
//           className="w-full py-6 bg-zinc-800 border-2 border-red-500/40 text-red-400 font-black uppercase tracking-widest text-lg rounded-2xl flex items-center justify-center gap-4 hover:bg-zinc-700 transition-colors"
//         >
//           <Lock size={24} />
//           Reveal Master Private Key
//         </motion.button>

//         {keyExportStatus && (
//           <div
//             className={`p-4 rounded-xl text-center text-sm ${
//               keyExportStatus.includes("Success")
//                 ? "bg-green-900/50 text-green-300 border border-green-500/30"
//                 : "bg-red-900/50 text-red-300 border border-red-500/30"
//             }`}
//           >
//             {keyExportStatus}
//           </div>
//         )}
//       </section>

//       {/* Key Export Confirmation Modal */}
//       <AnimatePresence>
//         {showKeyConfirm && (
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4"
//           >
//             <motion.div
//               initial={{ scale: 0.9 }}
//               animate={{ scale: 1 }}
//               exit={{ scale: 0.9 }}
//               className="bg-zinc-900 border border-red-500/40 rounded-2xl p-8 max-w-md w-full relative"
//             >
//               <button
//                 onClick={() => setShowKeyConfirm(false)}
//                 className="absolute top-4 right-4 text-zinc-500 hover:text-white"
//               >
//                 <X size={28} />
//               </button>

//               <div className="flex items-start gap-5 mb-8">
//                 <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" size={40} />
//                 <div>
//                   <h3 className="text-2xl font-bold text-red-400 mb-4">Extreme Warning</h3>
//                   <p className="text-zinc-200 leading-relaxed">
//                     Exporting your private key gives <strong>anyone who has it full control</strong> over your wallet, identity, and any funds.
//                     <br /><br />
//                     <strong>Never share it. Never store it online.</strong>
//                     <br /><br />
//                     Only proceed if you accept complete responsibility.
//                   </p>
//                 </div>
//               </div>

//               <div className="flex gap-4 justify-end">
//                 <button
//                   onClick={() => setShowKeyConfirm(false)}
//                   className="px-8 py-4 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 transition"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   onClick={handleKeyExport}
//                   className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
//                 >
//                   I Understand — Export Key
//                 </button>
//               </div>
//             </motion.div>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       <p className="text-sm text-zinc-600 mt-16 text-center">
//         Powered by Project I • Secured by Privy • True ownership starts here
//       </p>
//     </main>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Download,
  Lock,
  Loader2,
  Hexagon,
  AlertTriangle,
  X,
  HardDrive,
  CheckCircle2,
  XCircle,
  Copy,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { verifyMessage } from "viem";

export default function Terminal() {
  const { user, ready, exportWallet } = usePrivy();
  const router = useRouter();

  const [artifacts, setArtifacts] = useState<any[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [storageInfo, setStorageInfo] = useState<{
    sizeDisplay: string;
    objectCount: number;
    sizeBytes: number;
  } | null>(null);
  const [exportingData, setExportingData] = useState(false);
  const [exportingKey, setExportingKey] = useState(false); // Fixed: was missing
  const [keyExportStatus, setKeyExportStatus] = useState<string | null>(null);
  const [showKeyConfirm, setShowKeyConfirm] = useState(false);

  // Verify tool state
  const [verifyMessageInput, setVerifyMessageInput] = useState("");
  const [verifySignatureInput, setVerifySignatureInput] = useState("");
  const [verifyAddressInput, setVerifyAddressInput] = useState("");
  const [verifyResult, setVerifyResult] = useState<"success" | "fail" | null>(null);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const [privacySettings, setPrivacySettings] = useState({
    publicProfile: true,
    p2pDiscovery: false,
    localEncryption: true,
    stripMetadata: false,
  });

  useEffect(() => {
    if (!ready) return;

    if (!user) {
      router.replace("/");
      return;
    }

    const fetchData = async () => {
      try {
        const { data: arts, error: artError } = await supabase
          .from("artifacts")
          .select("*")
          .eq("author_did", user.id)
          .order("created_at", { ascending: false });

        if (artError) throw artError;
        setArtifacts(arts || []);

        const r2Res = await fetch(`/api/r2-user-size?userId=${encodeURIComponent(user.id)}`);
        if (!r2Res.ok) throw new Error(await r2Res.text());

        const r2Data = await r2Res.json();
        if (r2Data.error) throw new Error(r2Data.error);

        setStorageInfo({
          sizeDisplay: r2Data.sizeDisplay,
          objectCount: r2Data.objectCount,
          sizeBytes: r2Data.sizeBytes,
        });
      } catch (err: any) {
        console.error("Terminal fetch error:", err);
        setFetchError(err.message || "Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [ready, user, router]);

  const handleExportData = async () => {
    if (!user || exportingData) return;
    setExportingData(true);

    try {
      const exportData = {
        did: user.id,
        createdAt: user.createdAt,
        exportedAt: new Date().toISOString(),
        storage: storageInfo,
        artifacts: artifacts.map((a) => ({
          id: a.id,
          caption: a.caption,
          content_url: a.content_url,
          content_hash: a.content_hash,
          signature: a.signature,
          created_at: a.created_at,
        })),
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `portal-full-export-${user.id.slice(-8)}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err: any) {
      alert("Data export failed: " + err.message);
    } finally {
      setExportingData(false);
    }
  };

  const handleKeyExport = async () => {
    setShowKeyConfirm(false);
    setKeyExportStatus("Starting export...");
    setExportingKey(true);

    try {
      if (!exportWallet) {
        throw new Error("exportWallet not available");
      }
      await exportWallet();
      setKeyExportStatus("Success! Private key exported via Privy modal.");
    } catch (err: any) {
      setKeyExportStatus(`Failed: ${err.message || "Unknown"}`);
    } finally {
      setExportingKey(false);
    }
  };

  // Fixed Verify function – force string conversion
  const verifySignature = async () => {
    if (!verifyMessageInput || !verifySignatureInput || !verifyAddressInput) {
      setVerifyResult(null);
      return;
    }

    setVerifyLoading(true);
    setVerifyResult(null);

    try {
      // Clean inputs
      const message = verifyMessageInput.trim();
      const signature = verifySignatureInput.trim();
      const address = verifyAddressInput.trim().toLowerCase();

      // Verify using viem
      const recovered = await verifyMessage({
        address: address as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      });

      // Force to string and normalize case (fixes the TypeError)
      const recoveredAddress = String(recovered).toLowerCase();

      const isValid = recoveredAddress === address;

      setVerifyResult(isValid ? "success" : "fail");
    } catch (err: any) {
      console.error("Verification error:", err);
      setVerifyResult("fail");
    } finally {
      setVerifyLoading(false);
    }
  };

  const toggleSetting = (key: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!ready) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-cyan-500" size={64} />
        <p className="ml-6 text-zinc-400 text-xl">Initializing terminal...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center px-6">
        <Hexagon size={80} className="text-cyan-500 mb-8" />
        <h2 className="text-4xl font-black mb-4">Sovereignty Terminal</h2>
        <p className="text-zinc-400 mb-10 text-lg max-w-md">
          Sign in to access your data export, storage overview, private key controls, and verification tool.
        </p>
        <button
          onClick={() => router.push("/")}
          className="px-10 py-5 bg-cyan-500 text-black font-bold text-xl rounded-2xl hover:bg-cyan-400 transition"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white p-6 md:p-10 font-mono">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">SOVEREIGNTY_CONFIG_V1</h1>
        <p className="text-sm md:text-base text-zinc-500 mt-3">
          TERMINAL — Prove ownership of your data
        </p>
      </header>

      {/* NEW: Show user's wallet address for easy copy-paste */}
      <div className="mb-8 p-4 bg-zinc-900 border border-cyan-500/20 rounded-xl">
        <p className="text-sm text-zinc-400 mb-2">Your wallet address (for verification):</p>
        <div className="flex items-center gap-3 flex-wrap">
          <code className="text-cyan-400 font-mono break-all">
            {user?.wallet?.address || "Not loaded — ensure you're logged in"}
          </code>
          {user?.wallet?.address && (
            <button
              onClick={() => {
                navigator.clipboard.writeText(user.wallet.address);
                alert("Address copied to clipboard!");
              }}
              className="p-2 bg-zinc-800 rounded hover:bg-zinc-700 transition flex items-center gap-1 text-sm"
            >
              <Copy size={16} /> Copy
            </button>
          )}
        </div>
      </div>

      {fetchError && (
        <div className="mb-10 p-6 bg-red-950/50 border border-red-500/30 rounded-2xl flex items-start gap-4">
          <AlertTriangle className="text-red-400 mt-1" size={28} />
          <div>
            <h3 className="font-bold text-red-400">Error</h3>
            <p className="text-red-300">{fetchError}</p>
          </div>
        </div>
      )}

      {/* DID & Info */}
      <section className="mb-12 bg-zinc-950 border border-cyan-500/20 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-xs uppercase text-zinc-500">Decentralized ID</p>
            <p className="text-lg md:text-2xl font-bold break-all mt-1">{user.id}</p>
          </div>
          <ShieldCheck className="text-cyan-400 flex-shrink-0" size={48} />
        </div>
        <p className="text-sm text-zinc-600 mt-4">
          Joined: {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN") : "N/A"}
        </p>
      </section>

      {/* R2 Storage */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-6 uppercase tracking-wider flex items-center gap-3">
          <HardDrive size={24} className="text-cyan-400" />
          R2 Storage Usage
        </h2>
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8">
          {isLoading ? (
            <div className="flex items-center py-8">
              <Loader2 className="animate-spin text-cyan-500 mr-3" size={28} />
              <p className="text-zinc-400">Calculating real usage from Cloudflare R2...</p>
            </div>
          ) : storageInfo ? (
            <div className="space-y-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-sm text-zinc-400">Total Used</p>
                  <p className="text-5xl md:text-6xl font-bold text-cyan-400 mt-2">
                    {storageInfo.sizeDisplay}
                  </p>
                  <p className="text-sm text-zinc-500 mt-2">
                    {storageInfo.objectCount} object{storageInfo.objectCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="w-full md:w-64 h-4 bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 transition-all duration-1000"
                    style={{
                      width: `${Math.min((storageInfo.sizeBytes / (100 * 1024 * 1024 * 1024)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <p className="text-sm text-zinc-600">
                This is your actual storage on Cloudflare R2 — fully under your control.
              </p>
            </div>
          ) : (
            <p className="text-zinc-500 text-center py-8">No storage data available</p>
          )}
        </div>
      </section>

      {/* Privacy Controls */}
      <section className="mb-12">
        <h2 className="text-2xl font-black mb-6 uppercase tracking-wider">Privacy Controls</h2>
        <div className="space-y-5 bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8">
          {Object.entries(privacySettings).map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-3 border-b border-zinc-800 last:border-0">
              <span className="capitalize text-base">{key.replace(/([A-Z])/g, " $1")}</span>
              <button
                onClick={() => toggleSetting(key as keyof typeof privacySettings)}
                className={`w-14 h-7 rounded-full transition-colors ${
                  value ? "bg-cyan-500" : "bg-zinc-700"
                } p-1`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition-transform ${
                    value ? "translate-x-7" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Export Actions */}
      <section className="space-y-6 mb-12">
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleExportData}
          disabled={exportingData}
          className="w-full py-6 bg-cyan-500 text-black font-black uppercase tracking-widest text-lg rounded-2xl flex items-center justify-center gap-4 shadow-xl disabled:opacity-50"
        >
          {exportingData ? <Loader2 className="animate-spin" size={24} /> : <Download size={24} />}
          Download My Data (JSON)
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowKeyConfirm(true)}
          disabled={exportingKey}
          className="w-full py-6 bg-zinc-800 border-2 border-cyan-500/40 text-cyan-400 font-black uppercase tracking-widest text-lg rounded-2xl flex items-center justify-center gap-4 hover:bg-zinc-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exportingKey ? <Loader2 className="animate-spin" size={24} /> : <Lock size={24} />}
          Reveal Master Private Key
        </motion.button>

        {keyExportStatus && (
          <div
            className={`p-4 rounded-xl text-center text-sm ${
              keyExportStatus.includes("Success")
                ? "bg-green-900/50 text-green-300 border border-green-500/30"
                : "bg-red-900/50 text-red-300 border border-red-500/30"
            }`}
          >
            {keyExportStatus}
          </div>
        )}
      </section>

      {/* NEW: Signature Verification Tool */}
      <section className="mt-12 mb-12">
        <h2 className="text-2xl font-black mb-6 uppercase tracking-wider flex items-center gap-3">
          <ShieldCheck size={24} className="text-cyan-400" />
          Verify Signature
        </h2>
        <div className="bg-zinc-950 border border-white/10 rounded-2xl p-6 md:p-8 space-y-6">
          <p className="text-sm text-zinc-400">
            Paste any post's hash, signature, and public address to verify ownership mathematically.
          </p>

          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm text-zinc-400 mb-2">Message / Hash</label>
              <input
                type="text"
                value={verifyMessageInput}
                onChange={(e) => setVerifyMessageInput(e.target.value)}
                placeholder="e.g. ce50cddaa746b26a81380ace3a1cb35ddd252bc1e6382653535f5f05160f3bc2"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-600 focus:border-cyan-500 outline-none pr-24"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(verifyMessageInput);
                  alert("Hash copied!");
                }}
                className="absolute right-3 top-10 px-3 py-1 bg-zinc-800 text-cyan-400 rounded hover:bg-zinc-700 text-xs"
              >
                Copy
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm text-zinc-400 mb-2">Signature (0x...)</label>
              <input
                type="text"
                value={verifySignatureInput}
                onChange={(e) => setVerifySignatureInput(e.target.value)}
                placeholder="0x..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-600 focus:border-cyan-500 outline-none pr-24"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(verifySignatureInput);
                  alert("Signature copied!");
                }}
                className="absolute right-3 top-10 px-3 py-1 bg-zinc-800 text-cyan-400 rounded hover:bg-zinc-700 text-xs"
              >
                Copy
              </button>
            </div>

            <div className="relative">
              <label className="block text-sm text-zinc-400 mb-2">Public Address (0x...)</label>
              <input
                type="text"
                value={verifyAddressInput}
                onChange={(e) => setVerifyAddressInput(e.target.value)}
                placeholder="0x..."
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-3 text-white placeholder-zinc-600 focus:border-cyan-500 outline-none pr-24"
              />
              <button
                onClick={() => {
                  if (user?.wallet?.address) {
                    setVerifyAddressInput(user.wallet.address);
                    alert("Your wallet address auto-filled!");
                  } else {
                    alert("Wallet address not loaded — ensure you're logged in");
                  }
                }}
                className="absolute right-3 top-10 px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700 text-xs font-bold"
              >
                Auto-fill Mine
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(verifyAddressInput);
                  alert("Address copied!");
                }}
                className="absolute right-24 top-10 px-3 py-1 bg-zinc-800 text-cyan-400 rounded hover:bg-zinc-700 text-xs"
              >
                Copy
              </button>
            </div>

            <button
              onClick={verifySignature}
              disabled={verifyLoading || !verifyMessageInput || !verifySignatureInput || !verifyAddressInput}
              className="w-full py-4 bg-cyan-500 text-black font-black uppercase rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
            >
              {verifyLoading ? <Loader2 className="animate-spin" size={20} /> : <ShieldCheck size={20} />}
              Verify Math
            </button>

            {verifyResult && (
              <div className={`p-5 rounded-xl text-center flex items-center justify-center gap-4 text-lg font-bold ${
                verifyResult === "success"
                  ? "bg-green-900/60 text-green-300 border border-green-500/40"
                  : "bg-red-900/60 text-red-300 border border-red-500/40"
              }`}>
                {verifyResult === "success" ? (
                  <>
                    <CheckCircle2 size={28} /> MATH VERIFIED — Signature is valid!
                  </>
                ) : (
                  <>
                    <XCircle size={28} /> INVALID — Signature does not match this address.
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Key Export Modal */}
      <AnimatePresence>
        {showKeyConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 px-4"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-zinc-900 border border-red-500/40 rounded-2xl p-8 max-w-md w-full relative"
            >
              <button
                onClick={() => setShowKeyConfirm(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-white"
              >
                <X size={28} />
              </button>

              <div className="flex items-start gap-5 mb-8">
                <AlertTriangle className="text-red-400 mt-1 flex-shrink-0" size={40} />
                <div>
                  <h3 className="text-2xl font-bold text-red-400 mb-4">Extreme Warning</h3>
                  <p className="text-zinc-200 leading-relaxed">
                    Exporting your private key gives <strong>anyone who has it full control</strong> over your wallet, identity, and any funds.
                    <br /><br />
                    <strong>Never share it. Never store it online.</strong>
                    <br /><br />
                    Only proceed if you accept complete responsibility.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowKeyConfirm(false)}
                  className="px-8 py-4 bg-zinc-800 text-zinc-300 rounded-xl hover:bg-zinc-700 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleKeyExport}
                  className="px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition"
                >
                  I Understand — Export Key
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="text-sm text-zinc-600 mt-16 text-center">
        Powered by Project I • Secured by Privy • True ownership starts here
      </p>
    </main>
  );
}