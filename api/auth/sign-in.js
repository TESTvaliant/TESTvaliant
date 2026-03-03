import { supabaseAnon } from "../../lib/supabaseAnon.js";
import { isUserAdmin } from "../../lib/auth.js";
import { badRequest, methodNotAllowed, sendJson, serverError } from "../../lib/http.js";
import { serializeSession } from "../../lib/session.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const { email, password } = req.body ?? {};

    if (!email || !password) {
      return badRequest(res, "Email and password are required");
    }

    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data?.session || !data?.user) {
      return sendJson(res, 401, { error: error?.message ?? "Invalid login credentials" });
    }

    const isAdmin = await isUserAdmin(data.user.id);

    return sendJson(res, 200, {
      session: serializeSession(data.session),
      user: data.user,
      isAdmin,
    });
  } catch (error) {
    return serverError(res, error);
  }
}
