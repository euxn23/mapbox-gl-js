// This file is generated. Edit build/generate-style-code.js, then run `yarn run codegen`.

/* eslint-disable */
import styleSpec from '../../style-spec/reference/latest';
import { Properties, DataConstantProperty, DataDrivenProperty, CrossFadedProperty, ColorRampProperty } from '../properties';
const paint = new Properties({
  "heatmap-radius": new DataDrivenProperty(styleSpec["paint_heatmap"]["heatmap-radius"]),
  "heatmap-weight": new DataDrivenProperty(styleSpec["paint_heatmap"]["heatmap-weight"]),
  "heatmap-intensity": new DataConstantProperty(styleSpec["paint_heatmap"]["heatmap-intensity"]),
  "heatmap-color": new ColorRampProperty(styleSpec["paint_heatmap"]["heatmap-color"]),
  "heatmap-opacity": new DataConstantProperty(styleSpec["paint_heatmap"]["heatmap-opacity"])
});
export default {
  paint
};