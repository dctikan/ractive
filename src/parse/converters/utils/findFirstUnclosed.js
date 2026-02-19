export function findFirstUnclosed(tagName) {
  // 1. Escape the tag name just in case
  const escapedTag = tagName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  // 2. Build the Regex dynamically
  const regex = new RegExp("<\\/?" + escapedTag, "g");

  let match;
  let depth = 0;

  while ((match = regex.exec(str)) !== null) {
    // Check if it starts with </ (closing) or < (opening)
    if (match[0].startsWith('</')) {
      if (depth === 0) return match.index;
      depth--;
    } else {
      depth++;
    }
  }
  return -1;
}
