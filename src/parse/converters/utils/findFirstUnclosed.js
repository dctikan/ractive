const regExpCache = {};

export default function findFirstUnclosed(str, tagName) {
  const needle = '<\\/?' + tagName;
  const regex = regExpCache[needle] || (regExpCache[needle] = new RegExp(needle, 'g'));
  //since we use 'g' flag we must make sure to reset lastIndex otherwise next time it will start from the last position
  regex.lastIndex = 0; // Essential reset!

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
