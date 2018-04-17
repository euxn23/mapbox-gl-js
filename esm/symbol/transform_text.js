import { plugin as rtlTextPlugin } from '../source/rtl_text_plugin';
export default function (text, layer, feature) {
  const transform = layer.layout.get('text-transform').evaluate(feature);

  if (transform === 'uppercase') {
    text = text.toLocaleUpperCase();
  } else if (transform === 'lowercase') {
    text = text.toLocaleLowerCase();
  }

  if (rtlTextPlugin.applyArabicShaping) {
    text = rtlTextPlugin.applyArabicShaping(text);
  }

  return text;
}