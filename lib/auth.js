import { supabaseServer } from "./supabaseServer.js";

const BEARER_PREFIX = "Bearer ";

const readBearerToken = (req) => {
  const headerValue = req.headers.authorization;

  if (!headerValue || !headerValue.startsWith(BEARER_PREFIX)) {
    return null;
  }

  return headerValue.slice(BEARER_PREFIX.length).trim() || null;
};

export const isUserAdmin = async (userId) => {
  const { data: role, error } = await supabaseServer
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (error || !role) {
    return false;
  }

  return true;
};

export const getUserFromAccessToken = async (accessToken) => {
  if (!accessToken) {
    return { user: null, error: "Missing access token" };
  }

  const { data, error } = await supabaseServer.auth.getUser(accessToken);

  if (error || !data?.user) {
    return { user: null, error: "Invalid or expired session" };
  }

  return { user: data.user, error: null };
};

export const getUserFromRequest = async (req) => {
  const token = readBearerToken(req);
  return getUserFromAccessToken(token);
};

export const getAdminFromRequest = async (req) => {
  const { user, error } = await getUserFromRequest(req);

  if (error || !user) {
    return { user: null, error: error ?? "Unauthorized" };
  }

  const isAdmin = await isUserAdmin(user.id);
  if (!isAdmin) {
    return { user: null, error: "Admin access required" };
  }

  return { user, error: null };
};
