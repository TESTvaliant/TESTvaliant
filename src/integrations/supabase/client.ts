import type { Database } from "./types";

type AuthEvent = "SIGNED_IN" | "SIGNED_OUT" | "TOKEN_REFRESHED";

type ApiError = {
  message: string;
  code?: string | null;
  details?: string | null;
};

type StoredSession = {
  access_token: string;
  refresh_token?: string | null;
  expires_at?: number | null;
  expires_in?: number | null;
  token_type?: string | null;
  user?: any;
};

type SessionEnvelope = {
  session: StoredSession | null;
  user: any;
  isAdmin: boolean;
};

type FilterOperator = "eq" | "gte" | "lte";

type QueryFilter = {
  column: string;
  operator: FilterOperator;
  value: unknown;
};

type QueryOperation = "select" | "insert" | "update" | "delete";

type QuerySingleMode = "single" | "maybeSingle" | null;

type QueryOrder = {
  column: string;
  ascending: boolean;
} | null;

const AUTH_STORAGE_KEY = "supabase-auth";
const authSubscribers = new Set<(event: AuthEvent, session: StoredSession | null) => void>();

const normalizeError = (errorPayload: unknown, fallbackMessage: string): ApiError => {
  if (typeof errorPayload === "string") {
    return { message: errorPayload };
  }

  if (errorPayload && typeof errorPayload === "object") {
    const payload = errorPayload as Record<string, unknown>;
    return {
      message: typeof payload.message === "string" ? payload.message : fallbackMessage,
      code: typeof payload.code === "string" ? payload.code : null,
      details: typeof payload.details === "string" ? payload.details : null,
    };
  }

  return { message: fallbackMessage };
};

const readStoredSession = (): StoredSession | null => {
  const raw = localStorage.getItem(AUTH_STORAGE_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as StoredSession;
  } catch {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return null;
  }
};

const writeStoredSession = (session: StoredSession | null) => {
  if (!session) {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    return;
  }

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

const notifyAuthSubscribers = (event: AuthEvent, session: StoredSession | null) => {
  authSubscribers.forEach((callback) => {
    callback(event, session);
  });
};

const apiRequest = async <T>(
  url: string,
  init: RequestInit,
  includeAuth = true,
): Promise<{ data: T | null; error: ApiError | null }> => {
  const headers = new Headers(init.headers ?? {});

  if (!headers.has("Content-Type") && init.body && !(init.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (includeAuth) {
    const session = readStoredSession();
    if (session?.access_token) {
      headers.set("Authorization", `Bearer ${session.access_token}`);
    }
  }

  let response: Response;

  try {
    response = await fetch(url, {
      ...init,
      headers,
    });
  } catch {
    return {
      data: null,
      error: { message: "Network request failed" },
    };
  }

  let payload: any = null;

  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!response.ok) {
    return {
      data: null,
      error: normalizeError(payload?.error ?? payload, `Request failed with status ${response.status}`),
    };
  }

  if (payload?.error) {
    return {
      data: null,
      error: normalizeError(payload.error, "Request failed"),
    };
  }

  return {
    data: payload as T,
    error: null,
  };
};

const toBase64 = async (file: Blob) => {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
};

class ApiQueryBuilder {
  private table: string;
  private operation: QueryOperation = "select";
  private selectColumns = "*";
  private returningColumns: string | null = null;
  private filters: QueryFilter[] = [];
  private payload: unknown = null;
  private orderBy: QueryOrder = null;
  private rowLimit: number | null = null;
  private singleMode: QuerySingleMode = null;
  private executionPromise: Promise<{ data: any; error: ApiError | null }> | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(columns = "*") {
    if (this.operation === "insert" || this.operation === "update" || this.operation === "delete") {
      this.returningColumns = columns;
      return this;
    }

    this.operation = "select";
    this.selectColumns = columns;
    return this;
  }

  insert(payload: unknown) {
    this.operation = "insert";
    this.payload = payload;
    return this;
  }

  update(payload: unknown) {
    this.operation = "update";
    this.payload = payload;
    return this;
  }

  delete() {
    this.operation = "delete";
    return this;
  }

  eq(column: string, value: unknown) {
    this.filters.push({ column, operator: "eq", value });
    return this;
  }

  gte(column: string, value: unknown) {
    this.filters.push({ column, operator: "gte", value });
    return this;
  }

  lte(column: string, value: unknown) {
    this.filters.push({ column, operator: "lte", value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderBy = {
      column,
      ascending: options?.ascending !== false,
    };
    return this;
  }

  limit(limit: number) {
    this.rowLimit = limit;
    return this;
  }

  single() {
    this.singleMode = "single";
    return this;
  }

  maybeSingle() {
    this.singleMode = "maybeSingle";
    return this;
  }

  private async execute() {
    const response = await apiRequest<{ data: any; error: ApiError | null }>(
      "/api/db",
      {
        method: "POST",
        body: JSON.stringify({
          table: this.table,
          operation: this.operation,
          columns: this.selectColumns,
          filters: this.filters,
          order: this.orderBy,
          limit: this.rowLimit,
          payload: this.payload,
          returning: this.returningColumns,
          singleMode: this.singleMode,
        }),
      },
      true,
    );

    if (response.error) {
      return {
        data: null,
        error: response.error,
      };
    }

    return {
      data: response.data?.data ?? null,
      error: null,
    };
  }

  then(
    onfulfilled?: ((value: { data: any; error: ApiError | null }) => any) | null,
    onrejected?: ((reason: any) => any) | null,
  ) {
    if (!this.executionPromise) {
      this.executionPromise = this.execute();
    }

    return this.executionPromise.then(onfulfilled, onrejected);
  }
}

const auth = {
  onAuthStateChange(callback: (event: AuthEvent, session: StoredSession | null) => void) {
    authSubscribers.add(callback);

    return {
      data: {
        subscription: {
          unsubscribe: () => {
            authSubscribers.delete(callback);
          },
        },
      },
    };
  },

  async getSession() {
    const session = readStoredSession();

    if (!session?.access_token && !session?.refresh_token) {
      return {
        data: {
          session: null,
          user: null,
          isAdmin: false,
        },
        error: null,
      };
    }

    const response = await apiRequest<SessionEnvelope>(
      "/api/auth/session",
      {
        method: "POST",
        body: JSON.stringify({
          accessToken: session?.access_token ?? null,
          refreshToken: session?.refresh_token ?? null,
        }),
      },
      false,
    );

    if (response.error || !response.data) {
      writeStoredSession(null);
      notifyAuthSubscribers("SIGNED_OUT", null);

      return {
        data: {
          session: null,
          user: null,
          isAdmin: false,
        },
        error: null,
      };
    }

    writeStoredSession(response.data.session);

    return {
      data: {
        session: response.data.session,
        user: response.data.user,
        isAdmin: response.data.isAdmin,
      },
      error: null,
    };
  },

  async signInWithPassword(credentials: { email: string; password: string }) {
    const response = await apiRequest<SessionEnvelope>(
      "/api/auth/sign-in",
      {
        method: "POST",
        body: JSON.stringify(credentials),
      },
      false,
    );

    if (response.error || !response.data?.session) {
      return {
        data: {
          user: null,
          session: null,
          isAdmin: false,
        },
        error: response.error ?? { message: "Unable to sign in" },
      };
    }

    writeStoredSession(response.data.session);
    notifyAuthSubscribers("SIGNED_IN", response.data.session);

    return {
      data: {
        user: response.data.user,
        session: response.data.session,
        isAdmin: response.data.isAdmin,
      },
      error: null,
    };
  },

  async signUp(payload: { email: string; password: string; options?: { emailRedirectTo?: string } }) {
    const response = await apiRequest<SessionEnvelope>(
      "/api/auth/sign-up",
      {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          redirectUrl: payload.options?.emailRedirectTo,
        }),
      },
      false,
    );

    if (response.error) {
      return {
        data: {
          user: null,
          session: null,
          isAdmin: false,
        },
        error: response.error,
      };
    }

    if (response.data?.session) {
      writeStoredSession(response.data.session);
      notifyAuthSubscribers("SIGNED_IN", response.data.session);
    }

    return {
      data: {
        user: response.data?.user ?? null,
        session: response.data?.session ?? null,
        isAdmin: response.data?.isAdmin ?? false,
      },
      error: null,
    };
  },

  async signOut() {
    await apiRequest<{ success: boolean }>(
      "/api/auth/sign-out",
      {
        method: "POST",
      },
      true,
    );

    writeStoredSession(null);
    notifyAuthSubscribers("SIGNED_OUT", null);

    return {
      error: null,
    };
  },
};

const storage = {
  from(bucket: string) {
    return {
      async upload(path: string, file: Blob, options?: { cacheControl?: string; upsert?: boolean }) {
        const fileBase64 = await toBase64(file);

        const response = await apiRequest<{ data: { path: string; publicUrl: string }; error: ApiError | null }>(
          "/api/storage/upload",
          {
            method: "POST",
            body: JSON.stringify({
              bucket,
              path,
              fileBase64,
              contentType: file.type,
              cacheControl: options?.cacheControl,
              upsert: options?.upsert,
            }),
          },
          true,
        );

        if (response.error) {
          return {
            data: null,
            error: response.error,
          };
        }

        return {
          data: response.data?.data ?? null,
          error: null,
        };
      },

      getPublicUrl(path: string) {
        const publicUrl = `/api/storage/public?bucket=${encodeURIComponent(bucket)}&path=${encodeURIComponent(path)}`;

        return {
          data: {
            publicUrl,
          },
        };
      },
    };
  },
};

const functions = {
  async invoke(functionName: string, options?: { body?: unknown }) {
    if (functionName !== "send-inquiry") {
      return {
        data: null,
        error: {
          message: `Unsupported function: ${functionName}`,
        },
      };
    }

    const response = await apiRequest<{ success: boolean }>(
      "/api/functions/send-inquiry",
      {
        method: "POST",
        body: JSON.stringify(options?.body ?? {}),
      },
      false,
    );

    if (response.error) {
      return {
        data: null,
        error: response.error,
      };
    }

    return {
      data: response.data,
      error: null,
    };
  },
};

export const supabase = {
  auth,
  storage,
  functions,
  from(table: keyof Database["public"]["Tables"] | string) {
    return new ApiQueryBuilder(String(table));
  },
};
