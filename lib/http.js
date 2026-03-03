const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "same-origin",
  "Cache-Control": "no-store",
};

export const setSecurityHeaders = (res) => {
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });
};

export const sendJson = (res, statusCode, payload) => {
  setSecurityHeaders(res);
  res.status(statusCode).json(payload);
};

export const methodNotAllowed = (res, methods) => {
  res.setHeader("Allow", methods.join(", "));
  sendJson(res, 405, { error: "Method not allowed" });
};

export const badRequest = (res, message = "Invalid request") => {
  sendJson(res, 400, { error: message });
};

export const unauthorized = (res, message = "Unauthorized") => {
  sendJson(res, 401, { error: message });
};

export const forbidden = (res, message = "Forbidden") => {
  sendJson(res, 403, { error: message });
};

export const serverError = (res, error) => {
  console.error("API Error:", error);
  sendJson(res, 500, { error: "Internal server error" });
};
