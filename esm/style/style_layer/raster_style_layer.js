import StyleLayer from '../style_layer';
import properties from './raster_style_layer_properties';
import { Transitionable, Transitioning, PossiblyEvaluated } from '../properties';

class RasterStyleLayer extends StyleLayer {
  constructor(layer) {
    super(layer, properties);
  }

}

export default RasterStyleLayer;