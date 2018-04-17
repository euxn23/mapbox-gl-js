import { endsWith, filterObject } from '../util/util';
import styleSpec from '../style-spec/reference/latest';
import { validateStyle, validateLayoutProperty, validatePaintProperty, emitValidationErrors } from './validate_style';
import { Evented } from '../util/evented';
import { Layout, Transitionable, Transitioning, Properties } from './properties';
const TRANSITION_SUFFIX = '-transition';

class StyleLayer extends Evented {
  constructor(layer, properties) {
    super();
    this.id = layer.id;
    this.metadata = layer.metadata;
    this.type = layer.type;
    this.minzoom = layer.minzoom;
    this.maxzoom = layer.maxzoom;
    this.visibility = 'visible';

    if (layer.type !== 'background') {
      this.source = layer.source;
      this.sourceLayer = layer['source-layer'];
      this.filter = layer.filter;
    }

    this._featureFilter = () => true;

    if (properties.layout) {
      this._unevaluatedLayout = new Layout(properties.layout);
    }

    this._transitionablePaint = new Transitionable(properties.paint);

    for (const property in layer.paint) {
      this.setPaintProperty(property, layer.paint[property], {
        validate: false
      });
    }

    for (const property in layer.layout) {
      this.setLayoutProperty(property, layer.layout[property], {
        validate: false
      });
    }

    this._transitioningPaint = this._transitionablePaint.untransitioned();
  }

  getLayoutProperty(name) {
    if (name === 'visibility') {
      return this.visibility;
    }

    return this._unevaluatedLayout.getValue(name);
  }

  setLayoutProperty(name, value, options) {
    if (value !== null && value !== undefined) {
      const key = `layers.${this.id}.layout.${name}`;

      if (this._validate(validateLayoutProperty, key, name, value, options)) {
        return;
      }
    }

    if (name === 'visibility') {
      this.visibility = value === 'none' ? value : 'visible';
      return;
    }

    this._unevaluatedLayout.setValue(name, value);
  }

  getPaintProperty(name) {
    if (endsWith(name, TRANSITION_SUFFIX)) {
      return this._transitionablePaint.getTransition(name.slice(0, -TRANSITION_SUFFIX.length));
    } else {
      return this._transitionablePaint.getValue(name);
    }
  }

  setPaintProperty(name, value, options) {
    if (value !== null && value !== undefined) {
      const key = `layers.${this.id}.paint.${name}`;

      if (this._validate(validatePaintProperty, key, name, value, options)) {
        return;
      }
    }

    if (endsWith(name, TRANSITION_SUFFIX)) {
      this._transitionablePaint.setTransition(name.slice(0, -TRANSITION_SUFFIX.length), value || undefined);
    } else {
      this._transitionablePaint.setValue(name, value);
    }
  }

  isHidden(zoom) {
    if (this.minzoom && zoom < this.minzoom) return true;
    if (this.maxzoom && zoom >= this.maxzoom) return true;
    return this.visibility === 'none';
  }

  updateTransitions(parameters) {
    this._transitioningPaint = this._transitionablePaint.transitioned(parameters, this._transitioningPaint);
  }

  hasTransition() {
    return this._transitioningPaint.hasTransition();
  }

  recalculate(parameters) {
    if (this._unevaluatedLayout) {
      this.layout = this._unevaluatedLayout.possiblyEvaluate(parameters);
    }

    this.paint = this._transitioningPaint.possiblyEvaluate(parameters);
  }

  serialize() {
    const output = {
      'id': this.id,
      'type': this.type,
      'source': this.source,
      'source-layer': this.sourceLayer,
      'metadata': this.metadata,
      'minzoom': this.minzoom,
      'maxzoom': this.maxzoom,
      'filter': this.filter,
      'layout': this._unevaluatedLayout && this._unevaluatedLayout.serialize(),
      'paint': this._transitionablePaint && this._transitionablePaint.serialize()
    };

    if (this.visibility === 'none') {
      output.layout = output.layout || {};
      output.layout.visibility = 'none';
    }

    return filterObject(output, (value, key) => {
      return value !== undefined && !(key === 'layout' && !Object.keys(value).length) && !(key === 'paint' && !Object.keys(value).length);
    });
  }

  _validate(validate, key, name, value, options) {
    if (options && options.validate === false) {
      return false;
    }

    return emitValidationErrors(this, validate.call(validateStyle, {
      key: key,
      layerType: this.type,
      objectKey: name,
      value: value,
      styleSpec: styleSpec,
      // Workaround for https://github.com/mapbox/mapbox-gl-js/issues/2407
      style: {
        glyphs: true,
        sprite: true
      }
    }));
  }

  hasOffscreenPass() {
    return false;
  }

  resize() {// noop
  }

}

export default StyleLayer;