import loadGlyphRange from '../style/load_glyph_range';
import TinySDF from '@mapbox/tiny-sdf';
import isChar from '../util/is_char_in_unicode_block';
import { asyncAll } from '../util/util';
import { AlphaImage } from '../util/image';

class GlyphManager {
  // exposed as statics to enable stubbing in unit tests
  constructor(requestTransform, localIdeographFontFamily) {
    this.requestTransform = requestTransform;
    this.localIdeographFontFamily = localIdeographFontFamily;
    this.entries = {};
  }

  setURL(url) {
    this.url = url;
  }

  getGlyphs(glyphs, callback) {
    const all = [];

    for (const stack in glyphs) {
      for (const id of glyphs[stack]) {
        all.push({
          stack,
          id
        });
      }
    }

    asyncAll(all, ({
      stack,
      id
    }, callback) => {
      let entry = this.entries[stack];

      if (!entry) {
        entry = this.entries[stack] = {
          glyphs: {},
          requests: {}
        };
      }

      let glyph = entry.glyphs[id];

      if (glyph !== undefined) {
        callback(null, {
          stack,
          id,
          glyph
        });
        return;
      }

      glyph = this._tinySDF(entry, stack, id);

      if (glyph) {
        callback(null, {
          stack,
          id,
          glyph
        });
        return;
      }

      const range = Math.floor(id / 256);

      if (range * 256 > 65535) {
        callback(new Error('glyphs > 65535 not supported'));
        return;
      }

      let requests = entry.requests[range];

      if (!requests) {
        requests = entry.requests[range] = [];
        GlyphManager.loadGlyphRange(stack, range, this.url, this.requestTransform, (err, response) => {
          if (response) {
            for (const id in response) {
              entry.glyphs[+id] = response[+id];
            }
          }

          for (const cb of requests) {
            cb(err, response);
          }

          delete entry.requests[range];
        });
      }

      requests.push((err, result) => {
        if (err) {
          callback(err);
        } else if (result) {
          callback(null, {
            stack,
            id,
            glyph: result[id] || null
          });
        }
      });
    }, (err, glyphs) => {
      if (err) {
        callback(err);
      } else if (glyphs) {
        const result = {};

        for (const {
          stack,
          id,
          glyph
        } of glyphs) {
          // Clone the glyph so that our own copy of its ArrayBuffer doesn't get transferred.
          (result[stack] || (result[stack] = {}))[id] = glyph && {
            id: glyph.id,
            bitmap: glyph.bitmap.clone(),
            metrics: glyph.metrics
          };
        }

        callback(null, result);
      }
    });
  }

  _tinySDF(entry, stack, id) {
    const family = this.localIdeographFontFamily;

    if (!family) {
      return;
    }

    if (!isChar['CJK Unified Ideographs'](id) && !isChar['Hangul Syllables'](id)) {
      // eslint-disable-line new-cap
      return;
    }

    let tinySDF = entry.tinySDF;

    if (!tinySDF) {
      let fontWeight = '400';

      if (/bold/i.test(stack)) {
        fontWeight = '900';
      } else if (/medium/i.test(stack)) {
        fontWeight = '500';
      } else if (/light/i.test(stack)) {
        fontWeight = '200';
      }

      tinySDF = entry.tinySDF = new GlyphManager.TinySDF(24, 3, 8, .25, family, fontWeight);
    }

    return {
      id,
      bitmap: new AlphaImage({
        width: 30,
        height: 30
      }, tinySDF.draw(String.fromCharCode(id))),
      metrics: {
        width: 24,
        height: 24,
        left: 0,
        top: -8,
        advance: 24
      }
    };
  }

}

GlyphManager.loadGlyphRange = loadGlyphRange;
GlyphManager.TinySDF = TinySDF;
export default GlyphManager;