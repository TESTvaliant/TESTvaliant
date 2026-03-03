import { supabaseServer } from "../../lib/supabaseServer.js";
import { badRequest, methodNotAllowed, sendJson, serverError } from "../../lib/http.js";

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
const isValidPhone = (value) => /^[0-9+\-\s()]+$/.test(value);

const sanitizeInquiry = (payload) => {
  const name = String(payload?.name ?? "").trim();
  const phone = String(payload?.phone ?? "").trim();
  const email = String(payload?.email ?? "").trim();
  const message = String(payload?.message ?? "").trim();

  if (name.length < 2 || name.length > 100) {
    return { error: "Name must be between 2 and 100 characters" };
  }

  if (phone.length < 10 || phone.length > 15 || !isValidPhone(phone)) {
    return { error: "Please provide a valid phone number" };
  }

  if (email.length > 255 || !isValidEmail(email)) {
    return { error: "Please provide a valid email address" };
  }

  if (message.length < 10 || message.length > 1000) {
    return { error: "Message must be between 10 and 1000 characters" };
  }

  return {
    data: {
      name,
      phone,
      email,
      message,
    },
  };
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const validation = sanitizeInquiry(req.body ?? {});

    if (validation.error) {
      return badRequest(res, validation.error);
    }

    const { error } = await supabaseServer.from("inquiries").insert(validation.data);

    if (error) {
      return sendJson(res, 400, {
        error: "Failed to submit inquiry",
      });
    }

    return sendJson(res, 200, { success: true });
  } catch (error) {
    return serverError(res, error);
  }
}
