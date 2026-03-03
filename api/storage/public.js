import { badRequest, methodNotAllowed, sendJson, serverError } from "../../lib/http.js";
import { supabaseServer } from "../../lib/supabaseServer.js";

const SAFE_BUCKET = /^[a-z0-9-]+$/;
const SAFE_PATH = /^[a-zA-Z0-9/_\-.]+$/;

const isSafeBucket = (value) => typeof value === "string" && SAFE_BUCKET.test(value);
const isSafePath = (value) => typeof value === "string" && SAFE_PATH.test(value);

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return methodNotAllowed(res, ["GET"]);
  }

  try {
    const bucket = Array.isArray(req.query.bucket) ? req.query.bucket[0] : req.query.bucket;
    const path = Array.isArray(req.query.path) ? req.query.path[0] : req.query.path;

    if (!isSafeBucket(bucket)) {
      return badRequest(res, "Invalid storage bucket");
    }

    if (!isSafePath(path)) {
      return badRequest(res, "Invalid storage path");
    }

    const { data, error } = await supabaseServer.storage.from(bucket).download(path);

    if (error || !data) {
      return sendJson(res, 404, { error: "File not found" });
    }

    const fileBuffer = Buffer.from(await data.arrayBuffer());

    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Referrer-Policy", "same-origin");
    res.setHeader("Cache-Control", "public, max-age=3600, stale-while-revalidate=86400");
    res.setHeader("Content-Type", data.type || "application/octet-stream");

    return res.status(200).send(fileBuffer);
  } catch (error) {
    return serverError(res, error);
  }
}
