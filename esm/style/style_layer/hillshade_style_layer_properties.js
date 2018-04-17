// This file is generated. Edit build/generate-style-code.js, then run `yarn run codegen`.

/* eslint-disable */
import styleSpec from '../../style-spec/reference/latest';
import { Properties, DataConstantProperty, DataDrivenProperty, CrossFadedProperty, ColorRampProperty } from '../properties';
const paint = new Properties({
  "hillshade-illumination-direction": new DataConstantProperty(styleSpec["paint_hillshade"]["hillshade-illumination-direction"]),
  "hillshade-illumination-anchor": new DataConstantProperty(styleSpec["paint_hillshade"]["hillshade-illumination-anchor"]),
  "hillshade-exaggeration": new DataConstantProperty(styleSpec["paint_hillshade"]["hillshade-exaggeration"]),
  "hillshade-shadow-color": new DataConstantProperty(styleSpec["paint_hillshade"]["hillshade-shadow-color"]),
  "hillshade-highlight-color": new DataConstantProperty(styleSpec["paint_hillshade"]["hillshade-highlight-color"]),
  "hillshade-accent-color": new DataConstantProperty(styleSpec["paint_hillshade"]["hillshade-accent-color"])
});
export default {
  paint
};