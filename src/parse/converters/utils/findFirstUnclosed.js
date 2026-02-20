const regExpCache = {};

export default function findFirstUnclosed(str, tagName) {
  const needle = '<\\/?' + tagName;
  const regex = regExpCache[needle] || (regExpCache[needle] = new RegExp(needle, 'g'));

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
