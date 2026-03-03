// website for testvaliant
import DOMPurify from 'dompurify';

/**
 * Sanitizes HTML content to prevent XSS attacks.
 * Only allows safe HTML tags and attributes commonly used in blog content.
 */
export const sanitizeHtml = (html: string): string => {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: [
      'p', 'h2', 'h3', 'h4', 'strong', 'em', 'u', 
      'ul', 'ol', 'li', 
      'blockquote', 'code', 'pre',
      'br', 'span', 'div', 'mark',
      'a', 'img', 'hr', 'sub', 'sup'
    ],
    ALLOWED_ATTR: ['class', 'href', 'target', 'rel', 'src', 'alt', 'title', 'id', 'style', 'data-color'],
  });
};

