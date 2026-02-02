import { NextResponse } from "next/server";
import { S3Client, ListObjectsV2Command } from "@aws-sdk/client-s3";

const r2 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
  forcePathStyle: true,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  // Convert did:privy:xxx → safe folder prefix (same as upload)
  const safePrefix = `artifacts/${userId.replace(/:/g, "-")}/`;

  try {
    let totalBytes = 0;
    let objectCount = 0;
    let continuationToken: string | undefined;

    do {
      const command = new ListObjectsV2Command({
        Bucket: process.env.R2_BUCKET_NAME!,
        Prefix: safePrefix,
        ContinuationToken: continuationToken,
      });

      const response = await r2.send(command);

      if (response.Contents) {
        for (const obj of response.Contents) {
          if (obj.Size) {
            totalBytes += obj.Size;
            objectCount++;
          }
        }
      }

      continuationToken = response.NextContinuationToken;
    } while (continuationToken);

    // Format size nicely
    let sizeDisplay = "";
    if (totalBytes < 1024 * 1024) {
      sizeDisplay = `${(totalBytes / 1024).toFixed(2)} KB`;
    } else if (totalBytes < 1024 * 1024 * 1024) {
      sizeDisplay = `${(totalBytes / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      sizeDisplay = `${(totalBytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }

    return NextResponse.json({
      sizeBytes: totalBytes,
      sizeDisplay,
      objectCount,
    });
  } catch (error: any) {
    console.error("R2 size error:", error);
    return NextResponse.json(
      { error: "Failed to fetch storage usage", details: error.message },
      { status: 500 }
    );
  }
}