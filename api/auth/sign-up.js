import { supabaseAnon } from "../../lib/supabaseAnon.js";
import { isUserAdmin } from "../../lib/auth.js";
import { badRequest, methodNotAllowed, sendJson, serverError } from "../../lib/http.js";
import { serializeSession } from "../../lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const { email, password, redirectUrl } = req.body ?? {};

    if (!email || !password) {
      return badRequest(res, "Email and password are required");
    }

    const { data, error } = await supabaseAnon.auth.signUp({
      email,
      password,
      options: redirectUrl
        ? {
            emailRedirectTo: redirectUrl,
          }
        : undefined,
    });

    if (error) {
      return sendJson(res, 400, { error: error.message });
    }

    const isAdmin = data?.user ? await isUserAdmin(data.user.id) : false;

    return sendJson(res, 200, {
      session: serializeSession(data?.session ?? null),
      user: data?.user ?? null,
      isAdmin,
    });
  } catch (error) {
    return serverError(res, error);
  }
}
