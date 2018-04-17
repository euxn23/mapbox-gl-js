// This file is generated. Edit build/generate-style-code.js, then run `yarn run codegen`.

/* eslint-disable */
import styleSpec from '../../style-spec/reference/latest';
import { Properties, DataConstantProperty, DataDrivenProperty, CrossFadedProperty, ColorRampProperty } from '../properties';
const paint = new Properties({
  "background-color": new DataConstantProperty(styleSpec["paint_background"]["background-color"]),
  "background-pattern": new CrossFadedProperty(styleSpec["paint_background"]["background-pattern"]),
  "background-opacity": new DataConstantProperty(styleSpec["paint_background"]["background-opacity"])
});
export default {
  paint
};