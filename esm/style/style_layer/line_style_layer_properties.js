// This file is generated. Edit build/generate-style-code.js, then run `yarn run codegen`.

/* eslint-disable */
import styleSpec from '../../style-spec/reference/latest';
import { Properties, DataConstantProperty, DataDrivenProperty, CrossFadedProperty, ColorRampProperty } from '../properties';
const layout = new Properties({
  "line-cap": new DataConstantProperty(styleSpec["layout_line"]["line-cap"]),
  "line-join": new DataDrivenProperty(styleSpec["layout_line"]["line-join"]),
  "line-miter-limit": new DataConstantProperty(styleSpec["layout_line"]["line-miter-limit"]),
  "line-round-limit": new DataConstantProperty(styleSpec["layout_line"]["line-round-limit"])
});
const paint = new Properties({
  "line-opacity": new DataDrivenProperty(styleSpec["paint_line"]["line-opacity"]),
  "line-color": new DataDrivenProperty(styleSpec["paint_line"]["line-color"]),
  "line-translate": new DataConstantProperty(styleSpec["paint_line"]["line-translate"]),
  "line-translate-anchor": new DataConstantProperty(styleSpec["paint_line"]["line-translate-anchor"]),
  "line-width": new DataDrivenProperty(styleSpec["paint_line"]["line-width"]),
  "line-gap-width": new DataDrivenProperty(styleSpec["paint_line"]["line-gap-width"]),
  "line-offset": new DataDrivenProperty(styleSpec["paint_line"]["line-offset"]),
  "line-blur": new DataDrivenProperty(styleSpec["paint_line"]["line-blur"]),
  "line-dasharray": new CrossFadedProperty(styleSpec["paint_line"]["line-dasharray"]),
  "line-pattern": new CrossFadedProperty(styleSpec["paint_line"]["line-pattern"]),
  "line-gradient": new ColorRampProperty(styleSpec["paint_line"]["line-gradient"])
});
export default {
  paint,
  layout
};