import { getArrayBuffer } from '../util/ajax';
import vt from '@mapbox/vector-tile';
import Protobuf from 'pbf';
import WorkerTile from './worker_tile';
import { extend } from '../util/util';
import perf from '../util/performance';

/**
 * @private
 */
function loadVectorTile(params, callback) {
  const xhr = getArrayBuffer(params.request, (err, response) => {
    if (err) {
      callback(err);
    } else if (response) {
      callback(null, {
        vectorTile: new vt.VectorTile(new Protobuf(response.data)),
        rawData: response.data,
        cacheControl: response.cacheControl,
        expires: response.expires
      });
    }
  });
  return () => {
    xhr.abort();
    callback();
  };
}
/**
 * The {@link WorkerSource} implementation that supports {@link VectorTileSource}.
 * This class is designed to be easily reused to support custom source types
 * for data formats that can be parsed/converted into an in-memory VectorTile
 * representation.  To do so, create it with
 * `new VectorTileWorkerSource(actor, styleLayers, customLoadVectorDataFunction)`.
 *
 * @private
 */


class VectorTileWorkerSource {
  /**
   * @param [loadVectorData] Optional method for custom loading of a VectorTile
   * object based on parameters passed from the main-thread Source. See
   * {@link VectorTileWorkerSource#loadTile}. The default implementation simply
   * loads the pbf at `params.url`.
   */
  constructor(actor, layerIndex, loadVectorData) {
    this.actor = actor;
    this.layerIndex = layerIndex;
    this.loadVectorData = loadVectorData || loadVectorTile;
    this.loading = {};
    this.loaded = {};
  }
  /**
   * Implements {@link WorkerSource#loadTile}. Delegates to
   * {@link VectorTileWorkerSource#loadVectorData} (which by default expects
   * a `params.url` property) for fetching and producing a VectorTile object.
   */


  loadTile(params, callback) {
    const uid = params.uid;
    if (!this.loading) this.loading = {};
    const workerTile = this.loading[uid] = new WorkerTile(params);
    workerTile.abort = this.loadVectorData(params, (err, response) => {
      delete this.loading[uid];

      if (err || !response) {
        return callback(err);
      }

      const rawTileData = response.rawData;
      const cacheControl = {};
      if (response.expires) cacheControl.expires = response.expires;
      if (response.cacheControl) cacheControl.cacheControl = response.cacheControl;
      const resourceTiming = {};

      if (params.request && params.request.collectResourceTiming) {
        const resourceTimingData = perf.getEntriesByName(params.request.url); // it's necessary to eval the result of getEntriesByName() here via parse/stringify
        // late evaluation in the main thread causes TypeError: illegal invocation

        if (resourceTimingData) resourceTiming.resourceTiming = JSON.parse(JSON.stringify(resourceTimingData));
      }

      workerTile.vectorTile = response.vectorTile;
      workerTile.parse(response.vectorTile, this.layerIndex, this.actor, (err, result) => {
        if (err || !result) return callback(err); // Transferring a copy of rawTileData because the worker needs to retain its copy.

        callback(null, extend({
          rawTileData: rawTileData.slice(0)
        }, result, cacheControl, resourceTiming));
      });
      this.loaded = this.loaded || {};
      this.loaded[uid] = workerTile;
    });
  }
  /**
   * Implements {@link WorkerSource#reloadTile}.
   */


  reloadTile(params, callback) {
    const loaded = this.loaded,
          uid = params.uid,
          vtSource = this;

    if (loaded && loaded[uid]) {
      const workerTile = loaded[uid];
      workerTile.showCollisionBoxes = params.showCollisionBoxes;

      const done = (err, data) => {
        const reloadCallback = workerTile.reloadCallback;

        if (reloadCallback) {
          delete workerTile.reloadCallback;
          workerTile.parse(workerTile.vectorTile, vtSource.layerIndex, vtSource.actor, reloadCallback);
        }

        callback(err, data);
      };

      if (workerTile.status === 'parsing') {
        workerTile.reloadCallback = done;
      } else if (workerTile.status === 'done') {
        workerTile.parse(workerTile.vectorTile, this.layerIndex, this.actor, done);
      }
    }
  }
  /**
   * Implements {@link WorkerSource#abortTile}.
   *
   * @param params
   * @param params.uid The UID for this tile.
   */


  abortTile(params, callback) {
    const loading = this.loading,
          uid = params.uid;

    if (loading && loading[uid] && loading[uid].abort) {
      loading[uid].abort();
      delete loading[uid];
    }

    callback();
  }
  /**
   * Implements {@link WorkerSource#removeTile}.
   *
   * @param params
   * @param params.uid The UID for this tile.
   */


  removeTile(params, callback) {
    const loaded = this.loaded,
          uid = params.uid;

    if (loaded && loaded[uid]) {
      delete loaded[uid];
    }

    callback();
  }

}

export default VectorTileWorkerSource;