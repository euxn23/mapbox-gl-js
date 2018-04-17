import { pick } from '../util/util';
import { getJSON, ResourceType } from '../util/ajax';
import browser from '../util/browser';
import { normalizeSourceURL as normalizeURL } from '../util/mapbox';
export default function (options, requestTransformFn, callback) {
  const loaded = function (err, tileJSON) {
    if (err) {
      return callback(err);
    } else if (tileJSON) {
      const result = pick(tileJSON, ['tiles', 'minzoom', 'maxzoom', 'attribution', 'mapbox_logo', 'bounds']);

      if (tileJSON.vector_layers) {
        result.vectorLayers = tileJSON.vector_layers;
        result.vectorLayerIds = result.vectorLayers.map(layer => {
          return layer.id;
        });
      }

      callback(null, result);
    }
  };

  if (options.url) {
    getJSON(requestTransformFn(normalizeURL(options.url), ResourceType.Source), loaded);
  } else {
    browser.frame(() => loaded(null, options));
  }
}