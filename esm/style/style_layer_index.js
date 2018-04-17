import StyleLayer from './style_layer';
import createStyleLayer from './create_style_layer';
import { values } from '../util/util';
import featureFilter from '../style-spec/feature_filter';
import groupByLayout from '../style-spec/group_by_layout';

class StyleLayerIndex {
  constructor(layerConfigs) {
    if (layerConfigs) {
      this.replace(layerConfigs);
    }
  }

  replace(layerConfigs) {
    this._layerConfigs = {};
    this._layers = {};
    this.update(layerConfigs, []);
  }

  update(layerConfigs, removedIds) {
    for (const layerConfig of layerConfigs) {
      this._layerConfigs[layerConfig.id] = layerConfig;
      const layer = this._layers[layerConfig.id] = createStyleLayer(layerConfig);
      layer._featureFilter = featureFilter(layer.filter);
    }

    for (const id of removedIds) {
      delete this._layerConfigs[id];
      delete this._layers[id];
    }

    this.familiesBySource = {};
    const groups = groupByLayout(values(this._layerConfigs));

    for (const layerConfigs of groups) {
      const layers = layerConfigs.map(layerConfig => this._layers[layerConfig.id]);
      const layer = layers[0];

      if (layer.visibility === 'none') {
        continue;
      }

      const sourceId = layer.source || '';
      let sourceGroup = this.familiesBySource[sourceId];

      if (!sourceGroup) {
        sourceGroup = this.familiesBySource[sourceId] = {};
      }

      const sourceLayerId = layer.sourceLayer || '_geojsonTileLayer';
      let sourceLayerFamilies = sourceGroup[sourceLayerId];

      if (!sourceLayerFamilies) {
        sourceLayerFamilies = sourceGroup[sourceLayerId] = [];
      }

      sourceLayerFamilies.push(layers);
    }
  }

}

export default StyleLayerIndex;