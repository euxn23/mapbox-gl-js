import validateStyleMin from '../style-spec/validate_style.min';
import { ErrorEvent } from '../util/evented';
export const validateStyle = validateStyleMin;
export const validateSource = validateStyleMin.source;
export const validateLight = validateStyleMin.light;
export const validateFilter = validateStyleMin.filter;
export const validatePaintProperty = validateStyleMin.paintProperty;
export const validateLayoutProperty = validateStyleMin.layoutProperty;
export function emitValidationErrors(emitter, errors) {
  let hasErrors = false;

  if (errors && errors.length) {
    for (const error of errors) {
      emitter.fire(new ErrorEvent(new Error(error.message)));
      hasErrors = true;
    }
  }

  return hasErrors;
}