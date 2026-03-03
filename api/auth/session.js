import { getUserFromAccessToken, isUserAdmin } from "../../lib/auth.js";
import { supabaseAnon } from "../../lib/supabaseAnon.js";
import { methodNotAllowed, sendJson, serverError } from "../../lib/http.js";
import { serializeSession } from "../../lib/session.js";

const buildTokenSession = ({ accessToken, refreshToken, user }) => ({
  access_token: accessToken,
  refresh_token: refreshToken ?? null,
  expires_in: null,
  expires_at: null,
  token_type: "bearer",
  user,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const { accessToken, refreshToken } = req.body ?? {};

    if (!accessToken && !refreshToken) {
      return sendJson(res, 200, {
        session: null,
        user: null,
        isAdmin: false,
      });
    }

    let user = null;
    let session = null;
    let nextAccessToken = accessToken ?? null;
    let nextRefreshToken = refreshToken ?? null;

    if (nextAccessToken) {
      const authResult = await getUserFromAccessToken(nextAccessToken);
      user = authResult.user;
    }

    if (!user && nextRefreshToken) {
      const { data: refreshData, error: refreshError } = await supabaseAnon.auth.refreshSession({
        refresh_token: nextRefreshToken,
      });

      if (!refreshError && refreshData?.session) {
        session = refreshData.session;
        nextAccessToken = refreshData.session.access_token;
        nextRefreshToken = refreshData.session.refresh_token;

        const authResult = await getUserFromAccessToken(nextAccessToken);
        user = authResult.user;
      }
    }

    if (!user) {
      return sendJson(res, 200, {
        session: null,
        user: null,
        isAdmin: false,
      });
    }

    const isAdmin = await isUserAdmin(user.id);
    const effectiveSession = session ?? buildTokenSession({ accessToken: nextAccessToken, refreshToken: nextRefreshToken, user });

    return sendJson(res, 200, {
      session: serializeSession(effectiveSession),
      user,
      isAdmin,
    });
  } catch (error) {
    return serverError(res, error);
  }
}
