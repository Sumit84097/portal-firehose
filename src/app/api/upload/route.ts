// import { NextResponse } from "next/server";
// import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// const r2 = new S3Client({
//   region: "auto",
//   endpoint: process.env.R2_ENDPOINT,
//   forcePathStyle: true, // MUST BE TRUE
//   credentials: {
//     accessKeyId: process.env.R2_ACCESS_KEY_ID!,
//     secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
//   },
// });

// export async function POST(req: Request) {
//   try {
//     const { fileName, fileType } = await req.json();

//     const command = new PutObjectCommand({
//       Bucket: process.env.R2_BUCKET_NAME,
//       Key: fileName,
//       ContentType: fileType, // This must match the browser exactly
//     });

//     // Generate link
//     const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

//     return NextResponse.json({ url: signedUrl });
//   } catch (error) {
//     return NextResponse.json({ error: "Signature Generation Failed" }, { status: 500 });
//   }
// }


// grok code

// src/app/api/upload/route.ts
import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true, // Required for R2 compatibility
});

export async function POST(req: Request) {
  try {
    const { fileName, fileType } = await req.json();

    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
    });

    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 3600 });

    return NextResponse.json({ url: signedUrl });
  } catch (error: any) {
    console.error("Presign error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate URL" }, { status: 500 });
  }
}