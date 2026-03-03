// website for testvaliant
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface InquiryRequest {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("RESEND_API_KEY not configured");
      throw new Error("Email service not configured");
    }

    // Initialize Supabase client with service role for inserting
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const resend = new Resend(resendApiKey);
    const { name, phone, email, message }: InquiryRequest = await req.json();

    // Validate required fields
    if (!name || !phone || !email || !message) {
      throw new Error("Missing required fields");
    }

    // Validate field lengths for security
    if (name.length > 100 || email.length > 255 || phone.length > 15 || message.length > 1000) {
      throw new Error("Field length exceeds maximum allowed");
    }

    console.log("Saving inquiry to database...");

    // Save to database
    const { error: dbError } = await supabase
      .from("inquiries")
      .insert({ name, phone, email, message });

    if (dbError) {
      console.error("Database insert error:", dbError);
      throw new Error("Failed to save inquiry");
    }

    console.log("Inquiry saved. Sending email to:", email);

    const destinationEmail = "testtheenglishschoolofthought@gmail.com";

    const emailResponse = await resend.emails.send({
      from: "TestValiant Inquiries <onboarding@resend.dev>",
      to: [destinationEmail],
      subject: `New Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">New Inquiry Received</h1>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h2 style="color: #555; margin-top: 0;">Contact Details</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          </div>
          
          <div style="background-color: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #555; margin-top: 0;">Message</h2>
            <p style="line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <p style="color: #888; font-size: 12px; margin-top: 20px; text-align: center;">
            This inquiry was submitted through the TestValiant website.
          </p>
        </div>
      `,
      reply_to: email,
    });

    console.log("Inquiry email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: unknown) {
    console.error("Error in send-inquiry function:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);

