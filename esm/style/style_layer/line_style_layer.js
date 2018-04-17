import Point from '@mapbox/point-geometry';
import StyleLayer from '../style_layer';
import LineBucket from '../../data/bucket/line_bucket';
import { RGBAImage } from '../../util/image';
import { multiPolygonIntersectsBufferedMultiLine } from '../../util/intersection_tests';
import { getMaximumPaintValue, translateDistance, translate } from '../query_utils';
import properties from './line_style_layer_properties';
import { extend } from '../../util/util';
import EvaluationParameters from '../evaluation_parameters';
import renderColorRamp from '../../util/color_ramp';
import { Transitionable, Transitioning, Layout, PossiblyEvaluated, DataDrivenProperty } from '../properties';

class LineFloorwidthProperty extends DataDrivenProperty {
  possiblyEvaluate(value, parameters) {
    parameters = new EvaluationParameters(Math.floor(parameters.zoom), {
      now: parameters.now,
      fadeDuration: parameters.fadeDuration,
      zoomHistory: parameters.zoomHistory,
      transition: parameters.transition
    });
    return super.possiblyEvaluate(value, parameters);
  }

  evaluate(value, globals, feature) {
    globals = extend({}, globals, {
      zoom: Math.floor(globals.zoom)
    });
    return super.evaluate(value, globals, feature);
  }

}

const lineFloorwidthProperty = new LineFloorwidthProperty(properties.paint.properties['line-width'].specification);
lineFloorwidthProperty.useIntegerZoom = true;

class LineStyleLayer extends StyleLayer {
  constructor(layer) {
    super(layer, properties);
  }

  setPaintProperty(name, value, options) {
    super.setPaintProperty(name, value, options);

    if (name === 'line-gradient') {
      this._updateGradient();
    }
  }

  _updateGradient() {
    const expression = this._transitionablePaint._values['line-gradient'].value.expression;
    this.gradient = renderColorRamp(expression, 'lineProgress');
    this.gradientTexture = null;
  }

  recalculate(parameters) {
    super.recalculate(parameters);
    this.paint._values['line-floorwidth'] = lineFloorwidthProperty.possiblyEvaluate(this._transitioningPaint._values['line-width'].value, parameters);
  }

  createBucket(parameters) {
    return new LineBucket(parameters);
  }

  queryRadius(bucket) {
    const lineBucket = bucket;
    const width = getLineWidth(getMaximumPaintValue('line-width', this, lineBucket), getMaximumPaintValue('line-gap-width', this, lineBucket));
    const offset = getMaximumPaintValue('line-offset', this, lineBucket);
    return width / 2 + Math.abs(offset) + translateDistance(this.paint.get('line-translate'));
  }

  queryIntersectsFeature(queryGeometry, feature, geometry, zoom, transform, pixelsToTileUnits) {
    const translatedPolygon = translate(queryGeometry, this.paint.get('line-translate'), this.paint.get('line-translate-anchor'), transform.angle, pixelsToTileUnits);
    const halfWidth = pixelsToTileUnits / 2 * getLineWidth(this.paint.get('line-width').evaluate(feature), this.paint.get('line-gap-width').evaluate(feature));
    const lineOffset = this.paint.get('line-offset').evaluate(feature);

    if (lineOffset) {
      geometry = offsetLine(geometry, lineOffset * pixelsToTileUnits);
    }

    return multiPolygonIntersectsBufferedMultiLine(translatedPolygon, geometry, halfWidth);
  }

}

export default LineStyleLayer;

function getLineWidth(lineWidth, lineGapWidth) {
  if (lineGapWidth > 0) {
    return lineGapWidth + 2 * lineWidth;
  } else {
    return lineWidth;
  }
}

function offsetLine(rings, offset) {
  const newRings = [];
  const zero = new Point(0, 0);

  for (let k = 0; k < rings.length; k++) {
    const ring = rings[k];
    const newRing = [];

    for (let i = 0; i < ring.length; i++) {
      const a = ring[i - 1];
      const b = ring[i];
      const c = ring[i + 1];
      const aToB = i === 0 ? zero : b.sub(a)._unit()._perp();
      const bToC = i === ring.length - 1 ? zero : c.sub(b)._unit()._perp();

      const extrude = aToB._add(bToC)._unit();

      const cosHalfAngle = extrude.x * bToC.x + extrude.y * bToC.y;

      extrude._mult(1 / cosHalfAngle);

      newRing.push(extrude._mult(offset)._add(b));
    }

    newRings.push(newRing);
  }

  return newRings;
}