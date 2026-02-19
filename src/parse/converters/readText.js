import getLowestIndex from './utils/getLowestIndex';
import findFirstUnclosed from './utils/findFirstUnclosed';
import { decodeCharacterReferences } from 'utils/html';

export default function readText(parser) {
  let index, disallowed, barrier;

  const remaining = parser.remaining();

  if (parser.textOnlyMode) {
    disallowed = parser.tags.map(t => t.open);
    disallowed = disallowed.concat(parser.tags.map(t => '\\' + t.open));

    index = getLowestIndex(remaining, disallowed);
  } else {
    barrier = parser.inside ? '</' + parser.inside : '<';

    if (parser.inside && !parser.interpolate[parser.inside]) {
        // to be able to parse the following <div><template><x-a><template></template></x-a></template></div>
        // we need to locate the first UNCLOSED(unbalanced) tag
        // so if we have parser.inside="template" and remaining="<x-a><template></template></x-a></template></div>" we should locate the last </template>
        index = remaining.findFirstUnclosed(parser.inside);
    } else {
      disallowed = parser.tags.map(t => t.open);
      disallowed = disallowed.concat(parser.tags.map(t => '\\' + t.open));

      // http://developers.whatwg.org/syntax.html#syntax-attributes
      if (parser.inAttribute === true) {
        // we're inside an unquoted attribute value
        disallowed.push(`"`, `'`, `=`, `<`, `>`, '`');
      } else if (parser.inAttribute) {
        // quoted attribute value
        disallowed.push(parser.inAttribute);
      } else {
        disallowed.push(barrier);
      }

      index = getLowestIndex(remaining, disallowed);
    }
  }

  if (!index) {
    return null;
  }

  if (index === -1) {
    index = remaining.length;
  }

  parser.pos += index;

  if ((parser.inside && parser.inside !== 'textarea') || parser.textOnlyMode) {
    return remaining.substr(0, index);
  } else {
    return decodeCharacterReferences(remaining.substr(0, index));
  }
}
