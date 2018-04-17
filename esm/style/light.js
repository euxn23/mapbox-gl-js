import styleSpec from '../style-spec/reference/latest';
import { endsWith, extend, sphericalToCartesian } from '../util/util';
import { Evented } from '../util/evented';
import { validateStyle, validateLight, emitValidationErrors } from './validate_style';
import Color from '../style-spec/util/color';
import { number as interpolate } from '../style-spec/util/interpolate';
import { Properties, Transitionable, Transitioning, PossiblyEvaluated, DataConstantProperty } from './properties';

class LightPositionProperty {
  constructor() {
    this.specification = styleSpec.light.position;
  }

  possiblyEvaluate(value, parameters) {
    return sphericalToCartesian(value.expression.evaluate(parameters));
  }

  interpolate(a, b, t) {
    return {
      x: interpolate(a.x, b.x, t),
      y: interpolate(a.y, b.y, t),
      z: interpolate(a.z, b.z, t)
    };
  }

}

const properties = new Properties({
  "anchor": new DataConstantProperty(styleSpec.light.anchor),
  "position": new LightPositionProperty(),
  "color": new DataConstantProperty(styleSpec.light.color),
  "intensity": new DataConstantProperty(styleSpec.light.intensity)
});
const TRANSITION_SUFFIX = '-transition';
/*
 * Represents the light used to light extruded features.
 */

class Light extends Evented {
  constructor(lightOptions) {
    super();
    this._transitionable = new Transitionable(properties);
    this.setLight(lightOptions);
    this._transitioning = this._transitionable.untransitioned();
  }

  getLight() {
    return this._transitionable.serialize();
  }

  setLight(options) {
    if (this._validate(validateLight, options)) {
      return;
    }

    for (const name in options) {
      const value = options[name];

      if (endsWith(name, TRANSITION_SUFFIX)) {
        this._transitionable.setTransition(name.slice(0, -TRANSITION_SUFFIX.length), value);
      } else {
        this._transitionable.setValue(name, value);
      }
    }
  }

  updateTransitions(parameters) {
    this._transitioning = this._transitionable.transitioned(parameters, this._transitioning);
  }

  hasTransition() {
    return this._transitioning.hasTransition();
  }

  recalculate(parameters) {
    this.properties = this._transitioning.possiblyEvaluate(parameters);
  }

  _validate(validate, value) {
    return emitValidationErrors(this, validate.call(validateStyle, extend({
      value: value,
      // Workaround for https://github.com/mapbox/mapbox-gl-js/issues/2407
      style: {
        glyphs: true,
        sprite: true
      },
      styleSpec: styleSpec
    })));
  }

}

export default Light;