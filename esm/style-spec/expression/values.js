import assert from 'assert';
import Color from '../util/color';
import { Collator } from './definitions/collator';
import { NullType, NumberType, StringType, BooleanType, ColorType, ObjectType, ValueType, CollatorType, array } from './types';
export function validateRGBA(r, g, b, a) {
  if (!(typeof r === 'number' && r >= 0 && r <= 255 && typeof g === 'number' && g >= 0 && g <= 255 && typeof b === 'number' && b >= 0 && b <= 255)) {
    const value = typeof a === 'number' ? [r, g, b, a] : [r, g, b];
    return `Invalid rgba value [${value.join(', ')}]: 'r', 'g', and 'b' must be between 0 and 255.`;
  }

  if (!(typeof a === 'undefined' || typeof a === 'number' && a >= 0 && a <= 1)) {
    return `Invalid rgba value [${[r, g, b, a].join(', ')}]: 'a' must be between 0 and 1.`;
  }

  return null;
}
export function isValue(mixed) {
  if (mixed === null) {
    return true;
  } else if (typeof mixed === 'string') {
    return true;
  } else if (typeof mixed === 'boolean') {
    return true;
  } else if (typeof mixed === 'number') {
    return true;
  } else if (mixed instanceof Color) {
    return true;
  } else if (mixed instanceof Collator) {
    return true;
  } else if (Array.isArray(mixed)) {
    for (const item of mixed) {
      if (!isValue(item)) {
        return false;
      }
    }

    return true;
  } else if (typeof mixed === 'object') {
    for (const key in mixed) {
      if (!isValue(mixed[key])) {
        return false;
      }
    }

    return true;
  } else {
    return false;
  }
}
export function typeOf(value) {
  if (value === null) {
    return NullType;
  } else if (typeof value === 'string') {
    return StringType;
  } else if (typeof value === 'boolean') {
    return BooleanType;
  } else if (typeof value === 'number') {
    return NumberType;
  } else if (value instanceof Color) {
    return ColorType;
  } else if (value instanceof Collator) {
    return CollatorType;
  } else if (Array.isArray(value)) {
    const length = value.length;
    let itemType;

    for (const item of value) {
      const t = typeOf(item);

      if (!itemType) {
        itemType = t;
      } else if (itemType === t) {
        continue;
      } else {
        itemType = ValueType;
        break;
      }
    }

    return array(itemType || ValueType, length);
  } else {
    assert(typeof value === 'object');
    return ObjectType;
  }
}
export { Color, Collator };