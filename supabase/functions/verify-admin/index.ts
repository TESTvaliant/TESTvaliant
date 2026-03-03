// website for testvaliant
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { secretKey } = await req.json();
    const adminSecretKey = Deno.env.get("ADMIN_SECRET_KEY");

    console.log("Admin verification attempt");

    if (!adminSecretKey) {
      console.error("ADMIN_SECRET_KEY not configured");
      return new Response(
        JSON.stringify({ valid: false, error: "Admin key not configured" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const isValid = secretKey === adminSecretKey;
    console.log("Admin verification result:", isValid ? "success" : "failed");

    return new Response(
      JSON.stringify({ valid: isValid }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying admin:", error);
    return new Response(
      JSON.stringify({ valid: false, error: "Verification failed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});

