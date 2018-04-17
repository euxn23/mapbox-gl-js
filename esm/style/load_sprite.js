import { getJSON, getImage, ResourceType } from '../util/ajax';
import browser from '../util/browser';
import { normalizeSpriteURL } from '../util/mapbox';
import { RGBAImage } from '../util/image';
export default function (baseURL, transformRequestCallback, callback) {
  let json, image, error;
  const format = browser.devicePixelRatio > 1 ? '@2x' : '';
  getJSON(transformRequestCallback(normalizeSpriteURL(baseURL, format, '.json'), ResourceType.SpriteJSON), (err, data) => {
    if (!error) {
      error = err;
      json = data;
      maybeComplete();
    }
  });
  getImage(transformRequestCallback(normalizeSpriteURL(baseURL, format, '.png'), ResourceType.SpriteImage), (err, img) => {
    if (!error) {
      error = err;
      image = img;
      maybeComplete();
    }
  });

  function maybeComplete() {
    if (error) {
      callback(error);
    } else if (json && image) {
      const imageData = browser.getImageData(image);
      const result = {};

      for (const id in json) {
        const {
          width,
          height,
          x,
          y,
          sdf,
          pixelRatio
        } = json[id];
        const data = new RGBAImage({
          width,
          height
        });
        RGBAImage.copy(imageData, data, {
          x,
          y
        }, {
          x: 0,
          y: 0
        }, {
          width,
          height
        });
        result[id] = {
          data,
          pixelRatio,
          sdf
        };
      }

      callback(null, result);
    }
  }
}