import DEMData from '../data/dem_data';

class RasterDEMTileWorkerSource {
  constructor() {
    this.loading = {};
    this.loaded = {};
  }

  loadTile(params, callback) {
    const uid = params.uid,
          encoding = params.encoding;
    const dem = new DEMData(uid);
    this.loading[uid] = dem;
    dem.loadFromImage(params.rawImageData, encoding);
    delete this.loading[uid];
    this.loaded = this.loaded || {};
    this.loaded[uid] = dem;
    callback(null, dem);
  }

  removeTile(params) {
    const loaded = this.loaded,
          uid = params.uid;

    if (loaded && loaded[uid]) {
      delete loaded[uid];
    }
  }

}

export default RasterDEMTileWorkerSource;