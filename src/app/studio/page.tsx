
// "use client";

// import { useState, useRef } from "react";
// import { usePrivy, useSignMessage } from "@privy-io/react-auth";
// import {
//   Upload,
//   Hexagon,
//   ShieldCheck,
//   ArrowLeft,
//   Loader2,
//   Film,
//   Type,
//   Image as ImageIcon,
//   Cpu,
// } from "lucide-react";
// import Link from "next/link";
// import { supabase } from "@/lib/supabase";
// import { useRouter } from "next/navigation";
// import { motion } from "framer-motion";

// export default function SigningStudio() {
//   const { user } = usePrivy();
//   const { signMessage } = useSignMessage();
//   const router = useRouter();
//   const fileInputRef = useRef<HTMLInputElement>(null);

//   const [isSigning, setIsSigning] = useState(false);
//   const [preview, setPreview] = useState<string | null>(null);
//   const [file, setFile] = useState<File | null>(null);
//   const [fileType, setFileType] = useState<"image" | "video" | "text">("image");
//   const [caption, setCaption] = useState("");
//   const [error, setError] = useState<string | null>(null);

//   const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const selectedFile = e.target.files?.[0];
//     if (!selectedFile) return;

//     setError(null);

//     if (selectedFile.type.startsWith("video/")) {
//       const video = document.createElement("video");
//       video.preload = "metadata";
//       video.onloadedmetadata = () => {
//         window.URL.revokeObjectURL(video.src);
//         if (video.duration > 60) {
//           setError("Protocol Violation: Videos must be under 60 seconds.");
//           return;
//         }
//         setFileType("video");
//         setFile(selectedFile);
//         setPreview(URL.createObjectURL(selectedFile));
//       };
//       video.src = URL.createObjectURL(selectedFile);
//     } else if (selectedFile.type.startsWith("image/")) {
//       setFileType("image");
//       setFile(selectedFile);
//       setPreview(URL.createObjectURL(selectedFile));
//     } else {
//       setError("Only images and videos are supported.");
//     }
//   };

//   const handlePublish = async () => {
//     if ((fileType !== "text" && !file) || !user) {
//       setError("Please select a file or enter text.");
//       return;
//     }

//     setIsSigning(true);
//     setError(null);

//     try {
//       let finalContentUrl = "text_node";
//       let contentHash = "text_node";

//       // Compute SHA-256 hash
//       if (fileType !== "text" && file) {
//         const arrayBuffer = await file.arrayBuffer();
//         const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
//         const hashArray = Array.from(new Uint8Array(hashBuffer));
//         contentHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
//         console.log("Computed content hash:", contentHash);
//       } else if (fileType === "text") {
//         const encoder = new TextEncoder();
//         const data = encoder.encode(caption || "Untitled");
//         const hashBuffer = await crypto.subtle.digest("SHA-256", data);
//         const hashArray = Array.from(new Uint8Array(hashBuffer));
//         contentHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
//         console.log("Text content hash:", contentHash);
//       }

//       // Check if hash already exists (repost)
//       const { data: existing, error: checkErr } = await supabase
//         .from("artifacts")
//         .select("id, content_url")
//         .eq("content_hash", contentHash)
//         .order("created_at", { ascending: true })
//         .limit(1)
//         .maybeSingle();

//       if (checkErr && checkErr.code !== "PGRST116") {
//         throw new Error(`Hash check failed: ${checkErr.message}`);
//       }

//       if (existing) {
//         finalContentUrl = existing.content_url;
//         console.log("Repost → reusing URL:", finalContentUrl);
//       } else if (fileType !== "text" && file) {
//         // Upload new file
//         const safeId = user.id.replace(/:/g, "-");
//         const fileName = `artifacts/${safeId}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

//         console.log("Uploading new file:", fileName);

//         const presign = await fetch("/api/upload", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ fileName, fileType: file.type }),
//         });

//         if (!presign.ok) {
//           const txt = await presign.text();
//           throw new Error(`Presign failed (${presign.status}): ${txt}`);
//         }

//         const { url } = await presign.json();

//         const upload = await fetch(url, {
//           method: "PUT",
//           body: file,
//           headers: { "Content-Type": file.type },
//         });

//         if (!upload.ok) {
//           const txt = await upload.text();
//           throw new Error(`Upload failed (${upload.status}): ${txt}`);
//         }

//         finalContentUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
//         console.log("Upload success → URL:", finalContentUrl);
//       }

//       // Sign the hash
//       let signature: string;
//       try {
//         const result = await signMessage({ message: contentHash });
//         signature = result.signature;
//         console.log("Signature created:", signature);
//       } catch (signErr: any) {
//         console.error("Signing failed:", signErr);
//         setError(`Signing failed: ${signErr.message || "User rejected"}`);
//         return;
//       }

//       // Save to Supabase with media_type
//       console.log("Inserting to Supabase:", {
//         author_did: user.id,
//         content_url: finalContentUrl,
//         content_hash: contentHash,
//         signature,
//         caption,
//         media_type: fileType === "text" ? "text" : fileType,
//       });

//       const { data: inserted, error: insertErr } = await supabase
//         .from("artifacts")
//         .insert({
//           author_did: user.id,
//           content_url: finalContentUrl,
//           content_hash: contentHash,
//           signature,
//           caption,
//           media_type: fileType === "text" ? "text" : fileType, // ← added here
//         })
//         .select()
//         .single();

//       if (insertErr) {
//         console.error("Insert error:", insertErr);
//         throw new Error(`Supabase insert failed: ${insertErr.message} (code: ${insertErr.code})`);
//       }

//       console.log("Successfully inserted:", inserted);

//       setPreview(null);
//       setFile(null);
//       setCaption("");
//       router.push("/feed");
//     } catch (err: any) {
//       console.error("Publish failed:", err);
//       setError(`Failed: ${err.message || "Check console for details"}`);
//     } finally {
//       setIsSigning(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
//       <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,#1a1a1a_1px,transparent_0)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

//       <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-5 bg-black/60 backdrop-blur-xl border-b border-white/5">
//         <Link href="/feed" className="p-2.5 bg-zinc-900/50 border border-white/10 rounded-lg">
//           <ArrowLeft size={20} />
//         </Link>
//         <div className="flex gap-2">
//           {["image", "video", "text"].map((t) => (
//             <button
//               key={t}
//               onClick={() => {
//                 setFileType(t as any);
//                 setPreview(null);
//                 setFile(null);
//               }}
//               className={`p-2 rounded-lg transition-all ${
//                 fileType === t ? "bg-cyan-500 text-black" : "text-zinc-600 hover:text-zinc-400"
//               }`}
//             >
//               {t === "image" && <ImageIcon size={18} />}
//               {t === "video" && <Film size={18} />}
//               {t === "text" && <Type size={18} />}
//             </button>
//           ))}
//         </div>
//       </nav>

//       <div className="px-6 pt-10 max-w-lg mx-auto space-y-12 relative z-10">
//         <header className="space-y-3">
//           <h2 className="text-5xl font-black tracking-tight leading-[0.9]">Initialize<br />Artifact</h2>
//           <p className="text-xs text-zinc-500 tracking-wide font-medium">
//             Prepare {fileType} for cryptographic signing.
//           </p>
//         </header>

//         {fileType === "text" ? (
//           <textarea
//             value={caption}
//             onChange={(e) => setCaption(e.target.value)}
//             placeholder="Record text on the protocol..."
//             className="w-full h-64 bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 text-lg font-light outline-none focus:border-cyan-500/50 shadow-inner"
//           />
//         ) : (
//           <div
//             onClick={() => !preview && fileInputRef.current?.click()}
//             className={`relative aspect-[4/5] rounded-[2.5rem] border border-white/5 bg-zinc-950/50 flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all ${
//               preview ? "ring-1 ring-white/10 shadow-2xl" : ""
//             }`}
//           >
//             <div className="absolute top-6 left-6 w-5 h-5 border-t border-l border-cyan-500/40" />
//             <div className="absolute top-6 right-6 w-5 h-5 border-t border-r border-cyan-500/40" />
//             <div className="absolute bottom-6 left-6 w-5 h-5 border-b border-l border-cyan-500/40" />
//             <div className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-cyan-500/40" />

//             {preview ? (
//               fileType === "video" ? (
//                 <video src={preview} autoPlay muted loop className="w-full h-full object-cover" />
//               ) : (
//                 <img src={preview} className="w-full h-full object-cover" alt="preview" />
//               )
//             ) : (
//               <div className="text-center p-12">
//                 <div className="w-16 h-16 rounded-full glass flex items-center justify-center mx-auto mb-6">
//                   <Upload size={28} className="text-cyan-400" />
//                 </div>
//                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 font-black">
//                   Select {fileType}
//                 </p>
//               </div>
//             )}
//             <input
//               type="file"
//               ref={fileInputRef}
//               onChange={handleFileSelect}
//               className="hidden"
//               accept={fileType === "video" ? "video/*" : "image/*"}
//             />
//           </div>
//         )}

//         <div className="space-y-10">
//           {fileType !== "text" && (
//             <input
//               value={caption}
//               onChange={(e) => setCaption(e.target.value)}
//               placeholder="Artifact Designation..."
//               className="w-full bg-transparent border-b border-zinc-800 py-4 text-sm outline-none focus:border-cyan-500/50"
//             />
//           )}

//           <div className="p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
//             <div
//               className="absolute inset-0 opacity-[0.1]"
//               style={{ backgroundImage: "radial-gradient(#00FFFF 1px, transparent 1px)", backgroundSize: "16px 16px" }}
//             />
//             <div className="relative z-10 flex flex-col items-center">
//               <div className="flex items-center justify-between w-full mb-10 text-[9px] uppercase font-black tracking-widest text-zinc-500">
//                 <span className="flex items-center gap-2">
//                   <Cpu size={12} className="text-cyan-500" /> Digital Thumbprint
//                 </span>
//                 <span className="font-mono text-zinc-700 bg-black/40 px-2 py-0.5 rounded">SHA-256</span>
//               </div>
//               <div className="w-24 h-24 rounded-full border border-cyan-500/10 flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]">
//                 <Hexagon
//                   size={48}
//                   className={isSigning ? "animate-spin text-cyan-500" : "text-zinc-800"}
//                   strokeWidth={1}
//                 />
//                 <ShieldCheck size={16} className="absolute text-cyan-400" />
//               </div>
//               <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mt-10">
//                 {isSigning ? "Computing Proof..." : "Waiting for Sign..."}
//               </p>
//             </div>
//           </div>

//           <button
//             onClick={handlePublish}
//             disabled={(!file && fileType !== "text") || isSigning}
//             className="w-full py-6 bg-cyan-400 text-black font-black uppercase tracking-[0.4em] text-[13px] rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-20 active:scale-95 hover:bg-white"
//           >
//             {isSigning ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
//             Sign & Publish
//           </button>
//         </div>
//       </div>
//     </main>
//   );
// }




"use client";

import { useState, useRef } from "react";
import { usePrivy, useSignMessage } from "@privy-io/react-auth";
import {
  Upload,
  Hexagon,
  ShieldCheck,
  ArrowLeft,
  Loader2,
  Film,
  Type,
  Image as ImageIcon,
  Cpu,
} from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function SigningStudio() {
  const { user } = usePrivy();
  const { signMessage } = useSignMessage();
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSigning, setIsSigning] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<"image" | "video" | "text">("image");
  const [caption, setCaption] = useState("");

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type.startsWith("video/")) {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.onloadedmetadata = () => {
        window.URL.revokeObjectURL(video.src);
        if (video.duration > 60) {
          alert("Protocol Violation: Videos must be under 60 seconds.");
          return;
        }
        setFileType("video");
        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
      };
      video.src = URL.createObjectURL(selectedFile);
    } else {
      setFileType("image");
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handlePublish = async () => {
    if ((fileType !== "text" && !file) || !user) {
      alert("Please select a file or enter text.");
      return;
    }

    setIsSigning(true);

    try {
      let finalContentUrl = "text_node";
      let contentHash = "text_node";

      // Compute SHA-256 hash
      if (fileType !== "text" && file) {
        const arrayBuffer = await file.arrayBuffer();
        const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        contentHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        console.log("Computed content hash:", contentHash);
      } else if (fileType === "text") {
        const encoder = new TextEncoder();
        const data = encoder.encode(caption || "Untitled");
        const hashBuffer = await crypto.subtle.digest("SHA-256", data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        contentHash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
        console.log("Text content hash:", contentHash);
      }

      // Check if hash already exists (repost)
      const { data: existing, error: checkErr } = await supabase
        .from("artifacts")
        .select("id, content_url")
        .eq("content_hash", contentHash)
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (checkErr && checkErr.code !== "PGRST116") {
        throw new Error(`Hash check failed: ${checkErr.message}`);
      }

      if (existing) {
        finalContentUrl = existing.content_url;
        console.log("Repost → reusing URL:", finalContentUrl);
      } else if (fileType !== "text" && file) {
        // Upload new file
        const safeId = user.id.replace(/:/g, "-");
        const fileName = `artifacts/${safeId}/${Date.now()}-${file.name.replace(/\s+/g, "_")}`;

        console.log("Uploading new file:", fileName);

        const presign = await fetch("/api/upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileName, fileType: file.type }),
        });

        if (!presign.ok) {
          const txt = await presign.text();
          throw new Error(`Presign failed (${presign.status}): ${txt}`);
        }

        const { url } = await presign.json();

        const upload = await fetch(url, {
          method: "PUT",
          body: file,
          headers: { "Content-Type": file.type },
        });

        if (!upload.ok) {
          const txt = await upload.text();
          throw new Error(`Upload failed (${upload.status}): ${txt}`);
        }

        finalContentUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${fileName}`;
        console.log("Upload success → URL:", finalContentUrl);
      }

      // Sign the hash
      let signature: string;
      try {
        const result = await signMessage({ message: contentHash });
        signature = result.signature;
        console.log("Signature created:", signature);
      } catch (signErr: any) {
        console.error("Signing failed:", signErr);
        alert(`Signing failed: ${signErr.message || "User rejected"}`);
        return;
      }

      // Save to Supabase
      console.log("Inserting to Supabase:", {
        author_did: user.id,
        content_url: finalContentUrl,
        content_hash: contentHash,
        signature,
        caption,
        media_type: fileType,
      });

      const { data: inserted, error: insertErr } = await supabase
        .from("artifacts")
        .insert({
          author_did: user.id,
          content_url: finalContentUrl,
          content_hash: contentHash,
          signature,
          caption,
          media_type: fileType, // ← added here
        })
        .select()
        .single();

      if (insertErr) {
        console.error("Insert error:", insertErr);
        throw new Error(`Supabase insert failed: ${insertErr.message} (code: ${insertErr.code})`);
      }

      console.log("Successfully inserted:", inserted);

      setPreview(null);
      setFile(null);
      setCaption("");
      router.push("/feed");
    } catch (err: any) {
      console.error("Publish failed:", err);
      alert(`Failed: ${err.message || "Check console for details"}`);
    } finally {
      setIsSigning(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white font-sans overflow-x-hidden relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,#1a1a1a_1px,transparent_0)] bg-[size:32px_32px] opacity-40 pointer-events-none" />

      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-5 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <Link href="/feed" className="p-2.5 bg-zinc-900/50 border border-white/10 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div className="flex gap-2">
          {["image", "video", "text"].map((t) => (
            <button
              key={t}
              onClick={() => {
                setFileType(t as any);
                setPreview(null);
                setFile(null);
              }}
              className={`p-2 rounded-lg transition-all ${
                fileType === t ? "bg-cyan-500 text-black" : "text-zinc-600 hover:text-zinc-400"
              }`}
            >
              {t === "image" && <ImageIcon size={18} />}
              {t === "video" && <Film size={18} />}
              {t === "text" && <Type size={18} />}
            </button>
          ))}
        </div>
      </nav>

      <div className="px-6 pt-10 max-w-lg mx-auto space-y-12 relative z-10">
        <header className="space-y-3">
          <h2 className="text-5xl font-black tracking-tight leading-[0.9]">Initialize<br />Artifact</h2>
          <p className="text-xs text-zinc-500 tracking-wide font-medium">
            Prepare {fileType} for cryptographic signing.
          </p>
        </header>

        {fileType === "text" ? (
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Record text on the protocol..."
            className="w-full h-64 bg-zinc-950 border border-white/5 rounded-[2.5rem] p-8 text-lg font-light outline-none focus:border-cyan-500/50 shadow-inner"
          />
        ) : (
          <div
            onClick={() => !preview && fileInputRef.current?.click()}
            className={`relative aspect-[4/5] rounded-[2.5rem] border border-white/5 bg-zinc-950/50 flex flex-col items-center justify-center overflow-hidden cursor-pointer transition-all ${
              preview ? "ring-1 ring-white/10 shadow-2xl" : ""
            }`}
          >
            <div className="absolute top-6 left-6 w-5 h-5 border-t border-l border-cyan-500/40" />
            <div className="absolute top-6 right-6 w-5 h-5 border-t border-r border-cyan-500/40" />
            <div className="absolute bottom-6 left-6 w-5 h-5 border-b border-l border-cyan-500/40" />
            <div className="absolute bottom-6 right-6 w-5 h-5 border-b border-r border-cyan-500/40" />

            {preview ? (
              fileType === "video" ? (
                <video src={preview} autoPlay muted loop className="w-full h-full object-cover" />
              ) : (
                <img src={preview} className="w-full h-full object-cover" alt="preview" />
              )
            ) : (
              <div className="text-center p-12">
                <div className="w-16 h-16 rounded-full glass flex items-center justify-center mx-auto mb-6">
                  <Upload size={28} className="text-cyan-400" />
                </div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-zinc-400 font-black">
                  Select {fileType}
                </p>
              </div>
            )}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              accept={fileType === "video" ? "video/*" : "image/*"}
            />
          </div>
        )}

        <div className="space-y-10">
          {fileType !== "text" && (
            <input
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Artifact Designation..."
              className="w-full bg-transparent border-b border-zinc-800 py-4 text-sm outline-none focus:border-cyan-500/50"
            />
          )}

          <div className="p-8 bg-zinc-950/80 border border-white/5 rounded-[2.5rem] relative overflow-hidden group">
            <div
              className="absolute inset-0 opacity-[0.1]"
              style={{ backgroundImage: "radial-gradient(#00FFFF 1px, transparent 1px)", backgroundSize: "16px 16px" }}
            />
            <div className="relative z-10 flex flex-col items-center">
              <div className="flex items-center justify-between w-full mb-10 text-[9px] uppercase font-black tracking-widest text-zinc-500">
                <span className="flex items-center gap-2">
                  <Cpu size={12} className="text-cyan-500" /> Digital Thumbprint
                </span>
                <span className="font-mono text-zinc-700 bg-black/40 px-2 py-0.5 rounded">SHA-256</span>
              </div>
              <div className="w-24 h-24 rounded-full border border-cyan-500/10 flex items-center justify-center relative shadow-[inset_0_0_20px_rgba(6,182,212,0.05)]">
                <Hexagon
                  size={48}
                  className={isSigning ? "animate-spin text-cyan-500" : "text-zinc-800"}
                  strokeWidth={1}
                />
                <ShieldCheck size={16} className="absolute text-cyan-400" />
              </div>
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-zinc-500 mt-10">
                {isSigning ? "Computing Proof..." : "Waiting for Sign..."}
              </p>
            </div>
          </div>

          <button
            onClick={handlePublish}
            disabled={(!file && fileType !== "text") || isSigning}
            className="w-full py-6 bg-cyan-400 text-black font-black uppercase tracking-[0.4em] text-[13px] rounded-2xl shadow-[0_0_50px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-3 disabled:opacity-20 active:scale-95 hover:bg-white"
          >
            {isSigning ? <Loader2 className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
            Sign & Publish
          </button>
        </div>
      </div>
    </main>
  );
}