
/**
 * Validates a YouTube video ID (typically 11 characters, alphanumeric with hyphens and underscores)
 */
export const isValidYoutubeId = (id: string): boolean => {
  if (!id || typeof id !== 'string') return false;
  // YouTube IDs are typically 11 characters: alphanumeric, hyphens, and underscores
  return /^[a-zA-Z0-9_-]{10,12}$/.test(id);
};

/**
 * Validates a YouTube embed URL
 */
export const isValidYoutubeUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    const validHosts = ['youtube.com', 'www.youtube.com', 'youtu.be', 'www.youtu.be'];
    return validHosts.some(host => parsed.hostname === host || parsed.hostname.endsWith('.' + host));
  } catch {
    return false;
  }
};

/**
 * Sanitizes a YouTube ID by extracting only valid characters
 * Returns null if the ID is completely invalid
 */
export const sanitizeYoutubeId = (id: string): string | null => {
  if (!id || typeof id !== 'string') return null;
  const sanitized = id.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 12);
  return isValidYoutubeId(sanitized) ? sanitized : null;
};

/**
 * Extracts and validates a YouTube embed URL
 * Returns a safe fallback if validation fails
 */
export const getSafeYoutubeEmbedUrl = (input: string, fallbackId = 'dQw4w9WgXcQ'): string => {
  if (!input || typeof input !== 'string') {
    return `https://www.youtube.com/embed/${fallbackId}`;
  }

  // If it's a full URL, validate it
  if (input.startsWith('http://') || input.startsWith('https://')) {
    if (isValidYoutubeUrl(input)) {
      return input;
    }
    return `https://www.youtube.com/embed/${fallbackId}`;
  }

  // If it's just an ID, validate it
  const sanitizedId = sanitizeYoutubeId(input);
  if (sanitizedId) {
    return `https://www.youtube.com/embed/${sanitizedId}`;
  }

  return `https://www.youtube.com/embed/${fallbackId}`;
};

