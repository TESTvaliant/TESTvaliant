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
const PUBLIC_CACHE_TTL_MS = 45_000;

const DEFAULT_SELECT_COLUMNS = {
  hero_content:
    "id,badge_text,description,explainer_line,heading_highlight,heading_line1,heading_line2,micro_text,subline,created_at,updated_at",
  hero_images: "id,src,alt,sort_order,created_at",
  about_content:
    "id,heading_line1,heading_highlight,heading_line2,paragraph1,paragraph2,paragraph3,paragraph4,paragraph5,youtube_url,created_at,updated_at",
  about_stats: "id,label,value,sort_order,created_at",
  founder_content:
    "id,name,title,image_url,quote,bio_paragraph1,bio_paragraph2,created_at,updated_at",
  learner_tracks: "id,youtube_id,title,sort_order,created_at",
  open_learning_tracks:
    "id,slug,title,intro_text,image_url,channel_name,channel_url,youtube_id,why_matters_title,why_matters_content,how_we_learn_title,how_we_learn_content,bottom_text,cta_text,cta_link,content,sort_order,created_at,updated_at",
  youtube_channels: "id,name,url,description,thumbnail,color_from,color_to,sort_order,created_at",
  testimonials: "id,name,role,role_color,image_url,story,sort_order,created_at",
  testimonials_settings: "id,youtube_url,created_at,updated_at",
  differentiators: "id,title,description,sort_order,created_at",
  blogs: "id,title,slug,excerpt,image_url,author,date,read_time,category,content,sort_order,created_at",
  faqs: "id,question,answer,sort_order,created_at",
  cta_content: "id,heading_line1,heading_highlight,description,created_at,updated_at",
  footer_content: "id,tagline,address,phone,email,copyright_text,created_at,updated_at",
  social_links: "id,platform,url,sort_order,created_at",
  google_reviews:
    "id,reviewer_name,reviewer_image_url,review_date,rating,review_text,sort_order,is_visible,created_at,updated_at",
  google_reviews_settings: "id,section_title,total_reviews_count,google_place_id,embed_code,created_at,updated_at",
  gallery_images: "id,image_url,alt_text,sort_order,created_at,updated_at",
  inquiries: "id,name,phone,email,message,created_at",
};

const publicReadCache = new Map();

const isValidIdentifier = (value) => typeof value === "string" && SAFE_IDENTIFIER.test(value);
const isValidColumns = (value) => typeof value === "string" && SAFE_COLUMN_SELECTION.test(value);

const buildCacheKey = (input) => JSON.stringify(input);

const getCachedPayload = (key) => {
  const entry = publicReadCache.get(key);
  if (!entry) {
    return null;
  }

  if (entry.expiresAt <= Date.now()) {
    publicReadCache.delete(key);
    return null;
  }

  return entry.payload;
};

const setCachedPayload = (key, table, payload) => {
  publicReadCache.set(key, {
    table,
    payload,
    expiresAt: Date.now() + PUBLIC_CACHE_TTL_MS,
  });
};

const invalidateTableCache = (table) => {
  for (const [key, entry] of publicReadCache.entries()) {
    if (entry.table === table) {
      publicReadCache.delete(key);
    }
  }
};

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
    const effectiveColumns =
      columns === "*" ? DEFAULT_SELECT_COLUMNS[table] ?? columns : columns;

    const cacheKey =
      isPublicRead && isSelect
        ? buildCacheKey({
            table,
            operation,
            columns: effectiveColumns,
            filters,
            order,
            limit,
            singleMode,
          })
        : null;

    if (cacheKey) {
      const cachedPayload = getCachedPayload(cacheKey);
      if (cachedPayload) {
        res.setHeader("X-Cache", "HIT");
        res.setHeader("Cache-Control", "public, max-age=30, s-maxage=45, stale-while-revalidate=300");
        return sendJson(res, 200, cachedPayload);
      }
    }

    if (requiresAdmin) {
      const adminResult = await getAdminFromRequest(req);

      if (adminResult.error) {
        const statusCode = adminResult.error === "Admin access required" ? 403 : 401;
        return sendJson(res, statusCode, { error: adminResult.error });
      }
    }

    let query = supabaseServer.from(table);

    if (operation === "select") {
      query = query.select(effectiveColumns);
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
    const responsePayload = {
      data,
      error: null,
    };

    if (cacheKey) {
      setCachedPayload(cacheKey, table, responsePayload);
      res.setHeader("X-Cache", "MISS");
      res.setHeader("Cache-Control", "public, max-age=30, s-maxage=45, stale-while-revalidate=300");
    }

    if (!isSelect) {
      invalidateTableCache(table);
    }

    return sendJson(res, 200, responsePayload);
  } catch (error) {
    return serverError(res, error);
  }
}
