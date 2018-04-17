import { bindAll } from '../util/util';
import vector from '../source/vector_tile_source';
import raster from '../source/raster_tile_source';
import rasterDem from '../source/raster_dem_tile_source';
import geojson from '../source/geojson_source';
import video from '../source/video_source';
import image from '../source/image_source';
import canvas from '../source/canvas_source';
const sourceTypes = {
  vector,
  raster,
  'raster-dem': rasterDem,
  geojson,
  video,
  image,
  canvas
};
/*
 * Creates a tiled data source instance given an options object.
 *
 * @param id
 * @param {Object} source A source definition object compliant with
 * [`mapbox-gl-style-spec`](https://www.mapbox.com/mapbox-gl-style-spec/#sources) or, for a third-party source type,
  * with that type's requirements.
 * @param {Dispatcher} dispatcher
 * @returns {Source}
 */

export const create = function (id, specification, dispatcher, eventedParent) {
  const source = new sourceTypes[specification.type](id, specification, dispatcher, eventedParent);

  if (source.id !== id) {
    throw new Error(`Expected Source id to be ${id} instead of ${source.id}`);
  }

  bindAll(['load', 'abort', 'unload', 'serialize', 'prepare'], source);
  return source;
};
export const getType = function (name) {
  return sourceTypes[name];
};
export const setType = function (name, type) {
  sourceTypes[name] = type;
};