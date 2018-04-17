import StyleLayer from '../style_layer';
import properties from './background_style_layer_properties';
import { Transitionable, Transitioning, PossiblyEvaluated } from '../properties';

class BackgroundStyleLayer extends StyleLayer {
  constructor(layer) {
    super(layer, properties);
  }

}

export default BackgroundStyleLayer;