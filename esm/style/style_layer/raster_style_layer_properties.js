// This file is generated. Edit build/generate-style-code.js, then run `yarn run codegen`.

/* eslint-disable */
import styleSpec from '../../style-spec/reference/latest';
import { Properties, DataConstantProperty, DataDrivenProperty, CrossFadedProperty, ColorRampProperty } from '../properties';
const paint = new Properties({
  "raster-opacity": new DataConstantProperty(styleSpec["paint_raster"]["raster-opacity"]),
  "raster-hue-rotate": new DataConstantProperty(styleSpec["paint_raster"]["raster-hue-rotate"]),
  "raster-brightness-min": new DataConstantProperty(styleSpec["paint_raster"]["raster-brightness-min"]),
  "raster-brightness-max": new DataConstantProperty(styleSpec["paint_raster"]["raster-brightness-max"]),
  "raster-saturation": new DataConstantProperty(styleSpec["paint_raster"]["raster-saturation"]),
  "raster-contrast": new DataConstantProperty(styleSpec["paint_raster"]["raster-contrast"]),
  "raster-fade-duration": new DataConstantProperty(styleSpec["paint_raster"]["raster-fade-duration"])
});
export default {
  paint
};