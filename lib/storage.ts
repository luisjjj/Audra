import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

function client() {
  const endpoint = process.env.R2_ENDPOINT || (process.env.R2_ACCOUNT_ID ? `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com` : undefined);
  if (!endpoint || !process.env.R2_ACCESS_KEY_ID) throw new Error("R2 not configured");
  return new S3Client({
    region: "auto",
    endpoint,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
}

export const isStorageConfigured = () => !!process.env.R2_ACCESS_KEY_ID && !!process.env.R2_BUCKET;

export async function getUploadUrl(key: string, contentType: string, expiresIn = 3600) {
  const c = client();
  const cmd = new PutObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key, ContentType: contentType });
  return getSignedUrl(c, cmd, { expiresIn });
}

export async function getDownloadUrl(key: string, expiresIn = 900) {
  const c = client();
  const cmd = new GetObjectCommand({ Bucket: process.env.R2_BUCKET!, Key: key });
  return getSignedUrl(c, cmd, { expiresIn });
}
