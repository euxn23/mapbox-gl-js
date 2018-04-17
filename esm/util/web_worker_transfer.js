import assert from 'assert';
import Grid from 'grid-index';
import Color from '../style-spec/util/color';
import { StylePropertyFunction, StyleExpression, ZoomDependentExpression, ZoomConstantExpression } from '../style-spec/expression';
import CompoundExpression from '../style-spec/expression/compound_expression';
import expressions from '../style-spec/expression/definitions';
import window from './window';
const {
  ImageData
} = window;
const registry = {};
/**
 * Register the given class as serializable.
 *
 * @param options
 * @param options.omit List of properties to omit from serialization (e.g., cached/computed properties)
 * @param options.shallow List of properties that should be serialized by a simple shallow copy, rather than by a recursive call to serialize().
 *
 * @private
 */

export function register(name, klass, options = {}) {
  assert(!registry[name], `${name} is already registered.`);
  Object.defineProperty(klass, '_classRegistryKey', {
    value: name,
    writeable: false
  });
  registry[name] = {
    klass,
    omit: options.omit || [],
    shallow: options.shallow || []
  };
}
register('Object', Object);

Grid.serialize = function serializeGrid(grid, transferables) {
  const ab = grid.toArrayBuffer();

  if (transferables) {
    transferables.push(ab);
  }

  return ab;
};

Grid.deserialize = function deserializeGrid(serialized) {
  return new Grid(serialized);
};

register('Grid', Grid);
register('Color', Color);
register('Error', Error);
register('StylePropertyFunction', StylePropertyFunction);
register('StyleExpression', StyleExpression, {
  omit: ['_evaluator']
});
register('ZoomDependentExpression', ZoomDependentExpression);
register('ZoomConstantExpression', ZoomConstantExpression);
register('CompoundExpression', CompoundExpression, {
  omit: ['_evaluate']
});

for (const name in expressions) {
  if (expressions[name]._classRegistryKey) continue;
  register(`Expression_${name}`, expressions[name]);
}
/**
 * Serialize the given object for transfer to or from a web worker.
 *
 * For non-builtin types, recursively serialize each property (possibly
 * omitting certain properties - see register()), and package the result along
 * with the constructor's `name` so that the appropriate constructor can be
 * looked up in `deserialize()`.
 *
 * If a `transferables` array is provided, add any transferable objects (i.e.,
 * any ArrayBuffers or ArrayBuffer views) to the list. (If a copy is needed,
 * this should happen in the client code, before using serialize().)
 *
 * @private
 */


export function serialize(input, transferables) {
  if (input === null || input === undefined || typeof input === 'boolean' || typeof input === 'number' || typeof input === 'string' || input instanceof Boolean || input instanceof Number || input instanceof String || input instanceof Date || input instanceof RegExp) {
    return input;
  }

  if (input instanceof ArrayBuffer) {
    if (transferables) {
      transferables.push(input);
    }

    return input;
  }

  if (ArrayBuffer.isView(input)) {
    const view = input;

    if (transferables) {
      transferables.push(view.buffer);
    }

    return view;
  }

  if (input instanceof ImageData) {
    if (transferables) {
      transferables.push(input.data.buffer);
    }

    return input;
  }

  if (Array.isArray(input)) {
    const serialized = [];

    for (const item of input) {
      serialized.push(serialize(item, transferables));
    }

    return serialized;
  }

  if (typeof input === 'object') {
    const klass = input.constructor;
    const name = klass._classRegistryKey;

    if (!name) {
      throw new Error(`can't serialize object of unregistered class`);
    }

    assert(registry[name]);
    const properties = {};

    if (klass.serialize) {
      // (Temporary workaround) allow a class to provide static
      // `serialize()` and `deserialize()` methods to bypass the generic
      // approach.
      // This temporary workaround lets us use the generic serialization
      // approach for objects whose members include instances of dynamic
      // StructArray types. Once we refactor StructArray to be static,
      // we can remove this complexity.
      properties._serialized = klass.serialize(input, transferables);
    } else {
      for (const key in input) {
        // any cast due to https://github.com/facebook/flow/issues/5393
        if (!input.hasOwnProperty(key)) continue;
        if (registry[name].omit.indexOf(key) >= 0) continue;
        const property = input[key];
        properties[key] = registry[name].shallow.indexOf(key) >= 0 ? property : serialize(property, transferables);
      }

      if (input instanceof Error) {
        properties.message = input.message;
      }
    }

    return {
      name,
      properties
    };
  }

  throw new Error(`can't serialize object of type ${typeof input}`);
}
export function deserialize(input) {
  if (input === null || input === undefined || typeof input === 'boolean' || typeof input === 'number' || typeof input === 'string' || input instanceof Boolean || input instanceof Number || input instanceof String || input instanceof Date || input instanceof RegExp || input instanceof ArrayBuffer || ArrayBuffer.isView(input) || input instanceof ImageData) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(i => deserialize(i));
  }

  if (typeof input === 'object') {
    const {
      name,
      properties
    } = input;

    if (!name) {
      throw new Error(`can't deserialize object of anonymous class`);
    }

    const {
      klass
    } = registry[name];

    if (!klass) {
      throw new Error(`can't deserialize unregistered class ${name}`);
    }

    if (klass.deserialize) {
      return klass.deserialize(properties._serialized);
    }

    const result = Object.create(klass.prototype);

    for (const key of Object.keys(properties)) {
      result[key] = registry[name].shallow.indexOf(key) >= 0 ? properties[key] : deserialize(properties[key]);
    }

    return result;
  }

  throw new Error(`can't deserialize object of type ${typeof input}`);
}