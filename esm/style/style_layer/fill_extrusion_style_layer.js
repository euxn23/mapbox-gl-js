import StyleLayer from '../style_layer';
import FillExtrusionBucket from '../../data/bucket/fill_extrusion_bucket';
import { multiPolygonIntersectsMultiPolygon } from '../../util/intersection_tests';
import { translateDistance, translate } from '../query_utils';
import properties from './fill_extrusion_style_layer_properties';
import { Transitionable, Transitioning, PossiblyEvaluated } from '../properties';

class FillExtrusionStyleLayer extends StyleLayer {
  constructor(layer) {
    super(layer, properties);
  }

  createBucket(parameters) {
    return new FillExtrusionBucket(parameters);
  }

  queryRadius() {
    return translateDistance(this.paint.get('fill-extrusion-translate'));
  }

  queryIntersectsFeature(queryGeometry, feature, geometry, zoom, transform, pixelsToTileUnits) {
    const translatedPolygon = translate(queryGeometry, this.paint.get('fill-extrusion-translate'), this.paint.get('fill-extrusion-translate-anchor'), transform.angle, pixelsToTileUnits);
    return multiPolygonIntersectsMultiPolygon(translatedPolygon, geometry);
  }

  hasOffscreenPass() {
    return this.paint.get('fill-extrusion-opacity') !== 0 && this.visibility !== 'none';
  }

  resize() {
    if (this.viewportFrame) {
      this.viewportFrame.destroy();
      this.viewportFrame = null;
    }
  }

}

export default FillExtrusionStyleLayer;