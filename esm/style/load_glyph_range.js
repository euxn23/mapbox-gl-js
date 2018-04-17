import { normalizeGlyphsURL } from '../util/mapbox';
import { getArrayBuffer, ResourceType } from '../util/ajax';
import parseGlyphPBF from './parse_glyph_pbf';
export default function (fontstack, range, urlTemplate, requestTransform, callback) {
  const begin = range * 256;
  const end = begin + 255;
  const request = requestTransform(normalizeGlyphsURL(urlTemplate).replace('{fontstack}', fontstack).replace('{range}', `${begin}-${end}`), ResourceType.Glyphs);
  getArrayBuffer(request, (err, response) => {
    if (err) {
      callback(err);
    } else if (response) {
      const glyphs = {};

      for (const glyph of parseGlyphPBF(response.data)) {
        glyphs[glyph.id] = glyph;
      }

      callback(null, glyphs);
    }
  });
}