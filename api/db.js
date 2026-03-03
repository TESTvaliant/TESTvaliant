import { getAdminFromRequest } from "../lib/auth.js";
import { supabaseServer } from "../lib/supabaseServer.js";
import { badRequest, methodNotAllowed, sendJson, serverError } from "../lib/http.js";

const ALLOWED_TABLES = new Set([
  "hero_content",
  "hero_images",
  "about_content",
  "about_stats",
  "founder_content",
  "learner_tracks",
  "open_learning_tracks",
  "youtube_channels",
  "testimonials",
  "testimonials_settings",
  "differentiators",
  "blogs",
  "faqs",
  "cta_content",
  "footer_content",
  "social_links",
  "google_reviews",
  "google_reviews_settings",
  "gallery_images",
  "inquiries",
]);

const PUBLIC_READ_TABLES = new Set([
  "hero_content",
  "hero_images",
  "about_content",
  "about_stats",
  "founder_content",
  "learner_tracks",
  "open_learning_tracks",
  "youtube_channels",
  "testimonials",
  "testimonials_settings",
  "differentiators",
  "blogs",
  "faqs",
  "cta_content",
  "footer_content",
  "social_links",
  "google_reviews",
  "google_reviews_settings",
  "gallery_images",
]);

const ADMIN_READ_TABLES = new Set(["inquiries"]);
const VALID_OPERATIONS = new Set(["select", "insert", "update", "delete"]);
const VALID_FILTER_OPERATORS = new Set(["eq", "gte", "lte"]);
const VALID_SINGLE_MODES = new Set(["single", "maybeSingle", null, undefined]);
const SAFE_IDENTIFIER = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const SAFE_COLUMN_SELECTION = /^[a-zA-Z0-9_.*,\s]+$/;

const isValidIdentifier = (value) => typeof value === "string" && SAFE_IDENTIFIER.test(value);
const isValidColumns = (value) => typeof value === "string" && SAFE_COLUMN_SELECTION.test(value);

const validateFilters = (filters) => {
  if (!Array.isArray(filters)) {
    return "Filters must be an array";
  }

  for (const filter of filters) {
    if (!filter || typeof filter !== "object") {
      return "Each filter must be an object";
    }

    if (!VALID_FILTER_OPERATORS.has(filter.operator)) {
      return `Unsupported filter operator: ${filter.operator}`;
    }

    if (!isValidIdentifier(filter.column)) {
      return `Invalid filter column: ${filter.column}`;
    }
  }

  return null;
};

const applyFilters = (query, filters) => {
  let nextQuery = query;

  for (const filter of filters) {
    nextQuery = nextQuery[filter.operator](filter.column, filter.value);
  }

  return nextQuery;
};

const applySingleMode = (query, singleMode) => {
  if (singleMode === "single") {
    return query.single();
  }

  if (singleMode === "maybeSingle") {
    return query.maybeSingle();
  }

  return query;
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return methodNotAllowed(res, ["POST"]);
  }

  try {
    const {
      table,
      operation,
      columns = "*",
      filters = [],
      order = null,
      limit = null,
      payload = null,
      returning = null,
      singleMode = null,
    } = req.body ?? {};

    if (!ALLOWED_TABLES.has(table)) {
      return badRequest(res, "Table is not allowed");
    }

    if (!VALID_OPERATIONS.has(operation)) {
      return badRequest(res, "Unsupported database operation");
    }

    if (!isValidColumns(columns)) {
      return badRequest(res, "Invalid select columns");
    }

    if (returning && !isValidColumns(returning)) {
      return badRequest(res, "Invalid returning columns");
    }

    const filtersError = validateFilters(filters);
    if (filtersError) {
      return badRequest(res, filtersError);
    }

    if (order) {
      if (typeof order !== "object" || !isValidIdentifier(order.column)) {
        return badRequest(res, "Invalid order definition");
      }
    }

    if (limit !== null && limit !== undefined) {
      if (!Number.isInteger(limit) || limit <= 0 || limit > 1000) {
        return badRequest(res, "Limit must be an integer between 1 and 1000");
      }
    }

    if (!VALID_SINGLE_MODES.has(singleMode)) {
      return badRequest(res, "Invalid single mode");
    }

    const isSelect = operation === "select";
    const isPublicRead = isSelect && PUBLIC_READ_TABLES.has(table);
    const isAdminRead = isSelect && ADMIN_READ_TABLES.has(table);
    const requiresAdmin = !isPublicRead || isAdminRead;

    if (requiresAdmin) {
      const adminResult = await getAdminFromRequest(req);

      if (adminResult.error) {
        const statusCode = adminResult.error === "Admin access required" ? 403 : 401;
        return sendJson(res, statusCode, { error: adminResult.error });
      }
    }

    let query = supabaseServer.from(table);

    if (operation === "select") {
      query = query.select(columns);
    }

    if (operation === "insert") {
      query = query.insert(payload);
      if (returning) {
        query = query.select(returning);
      }
    }

    if (operation === "update") {
      query = query.update(payload);
      if (returning) {
        query = query.select(returning);
      }
    }

    if (operation === "delete") {
      query = query.delete();
      if (returning) {
        query = query.select(returning);
      }
    }

    query = applyFilters(query, filters);

    if (isSelect && order?.column) {
      query = query.order(order.column, {
        ascending: order.ascending !== false,
      });
    }

    if (isSelect && limit) {
      query = query.limit(limit);
    }

    query = applySingleMode(query, singleMode);

    const { data, error } = await query;

    if (error) {
      return sendJson(res, 400, {
        data: null,
        error: {
          message: error.message,
          code: error.code ?? null,
          details: error.details ?? null,
        },
      });
    }

    return sendJson(res, 200, {
      data,
      error: null,
    });
  } catch (error) {
    return serverError(res, error);
  }
}
