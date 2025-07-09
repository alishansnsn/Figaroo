// HTML Sanitization Utility
export class HTMLSanitizer {
  private static allowedTags = [
    'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a', 'button', 'input', 'label', 'form', 'img', 'svg',
    'ul', 'ol', 'li', 'table', 'tr', 'td', 'th', 'thead', 'tbody',
    'section', 'article', 'header', 'footer', 'nav', 'aside',
    'br', 'hr', 'strong', 'em', 'b', 'i', 'u', 'code', 'pre'
  ];

  private static allowedAttributes = [
    'class', 'id', 'style', 'href', 'src', 'alt', 'title',
    'type', 'value', 'placeholder', 'disabled', 'readonly',
    'required', 'min', 'max', 'step', 'width', 'height',
    'aria-label', 'aria-describedby', 'role', 'tabindex'
  ];

  private static allowedStyles = [
    'color', 'background-color', 'font-size', 'font-weight',
    'text-align', 'margin', 'padding', 'border', 'border-radius',
    'width', 'height', 'display', 'flex', 'flex-direction',
    'justify-content', 'align-items', 'position', 'top', 'left',
    'right', 'bottom', 'opacity', 'transform', 'transition',
    'box-shadow', 'z-index', 'overflow', 'cursor'
  ];

  static sanitize(html: string): string {
    if (!html) return '';

    // Create a temporary DOM element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;

    // Recursively sanitize all elements
    this.sanitizeElement(tempDiv);

    return tempDiv.innerHTML;
  }

  private static sanitizeElement(element: Element): void {
    // Remove script tags and event handlers
    const scripts = element.querySelectorAll('script');
    scripts.forEach(script => script.remove());

    // Process all child elements
    const children = Array.from(element.children);
    children.forEach(child => {
      // Remove disallowed tags
      if (!this.allowedTags.includes(child.tagName.toLowerCase())) {
        child.remove();
        return;
      }

      // Sanitize attributes
      this.sanitizeAttributes(child);

      // Recursively sanitize child elements
      this.sanitizeElement(child);
    });

    // Remove event handlers from current element
    this.removeEventHandlers(element);
  }

  private static sanitizeAttributes(element: Element): void {
    const attributes = Array.from(element.attributes);
    
    attributes.forEach(attr => {
      const attrName = attr.name.toLowerCase();
      const attrValue = attr.value;

      // Remove disallowed attributes
      if (!this.allowedAttributes.includes(attrName)) {
        element.removeAttribute(attrName);
        return;
      }

      // Special handling for style attribute
      if (attrName === 'style') {
        const sanitizedStyles = this.sanitizeStyles(attrValue);
        if (sanitizedStyles) {
          element.setAttribute('style', sanitizedStyles);
        } else {
          element.removeAttribute('style');
        }
      }

      // Remove potentially dangerous attribute values
      if (attrValue.includes('javascript:') || attrValue.includes('data:')) {
        element.removeAttribute(attrName);
      }
    });
  }

  private static sanitizeStyles(styleString: string): string {
    const styles = styleString.split(';');
    const sanitizedStyles: string[] = [];

    styles.forEach(style => {
      const [property, value] = style.split(':').map(s => s.trim());
      if (property && value && this.allowedStyles.includes(property.toLowerCase())) {
        // Basic validation for CSS values
        if (!value.includes('expression') && !value.includes('javascript')) {
          sanitizedStyles.push(`${property}: ${value}`);
        }
      }
    });

    return sanitizedStyles.join('; ');
  }

  private static removeEventHandlers(element: Element): void {
    const eventAttributes = [
      'onclick', 'onmouseover', 'onmouseout', 'onload', 'onerror',
      'onfocus', 'onblur', 'onchange', 'onsubmit', 'onkeydown',
      'onkeyup', 'onkeypress', 'onmousedown', 'onmouseup'
    ];

    eventAttributes.forEach(attr => {
      if (element.hasAttribute(attr)) {
        element.removeAttribute(attr);
      }
    });
  }
} 