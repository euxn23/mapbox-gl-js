// This file is generated. Edit build/generate-style-code.js, then run `yarn run codegen`.

/* eslint-disable */
import styleSpec from '../../style-spec/reference/latest';
import { Properties, DataConstantProperty, DataDrivenProperty, CrossFadedProperty, ColorRampProperty } from '../properties';
const paint = new Properties({
  "fill-antialias": new DataConstantProperty(styleSpec["paint_fill"]["fill-antialias"]),
  "fill-opacity": new DataDrivenProperty(styleSpec["paint_fill"]["fill-opacity"]),
  "fill-color": new DataDrivenProperty(styleSpec["paint_fill"]["fill-color"]),
  "fill-outline-color": new DataDrivenProperty(styleSpec["paint_fill"]["fill-outline-color"]),
  "fill-translate": new DataConstantProperty(styleSpec["paint_fill"]["fill-translate"]),
  "fill-translate-anchor": new DataConstantProperty(styleSpec["paint_fill"]["fill-translate-anchor"]),
  "fill-pattern": new CrossFadedProperty(styleSpec["paint_fill"]["fill-pattern"])
});
export default {
  paint
};