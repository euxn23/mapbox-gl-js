// This file is generated. Edit build/generate-style-code.js, then run `yarn run codegen`.

/* eslint-disable */
import styleSpec from '../../style-spec/reference/latest';
import { Properties, DataConstantProperty, DataDrivenProperty, CrossFadedProperty, ColorRampProperty } from '../properties';
const paint = new Properties({
  "fill-extrusion-opacity": new DataConstantProperty(styleSpec["paint_fill-extrusion"]["fill-extrusion-opacity"]),
  "fill-extrusion-color": new DataDrivenProperty(styleSpec["paint_fill-extrusion"]["fill-extrusion-color"]),
  "fill-extrusion-translate": new DataConstantProperty(styleSpec["paint_fill-extrusion"]["fill-extrusion-translate"]),
  "fill-extrusion-translate-anchor": new DataConstantProperty(styleSpec["paint_fill-extrusion"]["fill-extrusion-translate-anchor"]),
  "fill-extrusion-pattern": new CrossFadedProperty(styleSpec["paint_fill-extrusion"]["fill-extrusion-pattern"]),
  "fill-extrusion-height": new DataDrivenProperty(styleSpec["paint_fill-extrusion"]["fill-extrusion-height"]),
  "fill-extrusion-base": new DataDrivenProperty(styleSpec["paint_fill-extrusion"]["fill-extrusion-base"])
});
export default {
  paint
};