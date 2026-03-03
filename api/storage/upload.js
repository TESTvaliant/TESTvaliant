import { getAdminFromRequest } from "../../lib/auth.js";
import { badRequest, methodNotAllowed, sendJson, serverError } from "../../lib/http.js";
import { supabaseServer } from "../../lib/supabaseServer.js";

const SAFE_BUCKET = /^[a-z0-9-]+$/;
const SAFE_PATH = /^[a-zA-Z0-9/_\-.]+$/;

const isSafeBucket = (value) => typeof value === "string" && SAFE_BUCKET.test(value);
const isSafePath = (value) => typeof value === "string" && SAFE_PATH.test(value);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const adminResult = await getAdminFromRequest(req);

    if (adminResult.error) {
      const statusCode = adminResult.error === "Admin access required" ? 403 : 401;
      return sendJson(res, statusCode, { error: adminResult.error });
    }

    const {
      bucket,
      path,
      fileBase64,
      contentType,
      cacheControl = "3600",
      upsert = false,
    } = req.body ?? {};

    if (!isSafeBucket(bucket)) {
      return badRequest(res, "Invalid storage bucket");
    }

    if (!isSafePath(path)) {
      return badRequest(res, "Invalid storage path");
    }

    if (!fileBase64 || typeof fileBase64 !== "string") {
      return badRequest(res, "Missing file content");
    }

    const fileBuffer = Buffer.from(fileBase64, "base64");

    if (!fileBuffer.length) {
      return badRequest(res, "Invalid file content");
    }

    const { data, error } = await supabaseServer.storage.from(bucket).upload(path, fileBuffer, {
      contentType: typeof contentType === "string" ? contentType : undefined,
      cacheControl: String(cacheControl),
      upsert: Boolean(upsert),
    });

    if (error || !data?.path) {
      return sendJson(res, 400, {
        error: error?.message ?? "Upload failed",
      });
    }

    return sendJson(res, 200, {
      data: {
        path: data.path,
        publicUrl: `/api/storage/public?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(data.path)}`,
      },
      error: null,
    });
  } catch (error) {
    return serverError(res, error);
  }
}
