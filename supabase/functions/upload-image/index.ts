// website for testvaliant
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-admin-key",
};

// Allowed MIME types for image uploads
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/svg+xml",
];

// Maximum file size (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify admin authentication using the admin secret key
    const adminKey = req.headers.get("x-admin-key");
    const expectedAdminKey = Deno.env.get("ADMIN_SECRET_KEY");
    
    if (!adminKey || adminKey !== expectedAdminKey) {
      console.error("Unauthorized: Invalid or missing admin key");
      return new Response(
        JSON.stringify({ error: "Unauthorized: Admin authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = formData.get("folder") as string || "general";

    if (!file) {
      console.error("No file provided");
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      console.error(`Invalid file type: ${file.type}`);
      return new Response(
        JSON.stringify({ error: `Invalid file type. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      console.error(`File too large: ${file.size} bytes`);
      return new Response(
        JSON.stringify({ error: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB` }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate folder name to prevent path traversal
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
    if (sanitizedFolder !== folder) {
      console.error(`Invalid folder name: ${folder}`);
      return new Response(
        JSON.stringify({ error: "Invalid folder name. Only alphanumeric characters, underscores, and hyphens allowed." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Uploading file: ${file.name}, size: ${file.size}, type: ${file.type}, folder: ${sanitizedFolder}`);

    // Create Supabase client with service role for storage operations
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Generate unique filename with sanitized extension
    const fileExt = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
    const fileName = `${sanitizedFolder}/${crypto.randomUUID()}.${fileExt}`;

    // Upload to storage
    const { data, error } = await supabase.storage
      .from("site-images")
      .upload(fileName, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("Upload error:", error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from("site-images")
      .getPublicUrl(fileName);

    console.log(`Upload successful: ${urlData.publicUrl}`);

    return new Response(
      JSON.stringify({ url: urlData.publicUrl }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

