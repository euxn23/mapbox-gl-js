import { StringType, BooleanType, CollatorType } from '../types';
export class Collator {
  constructor(caseSensitive, diacriticSensitive, locale) {
    if (caseSensitive) this.sensitivity = diacriticSensitive ? 'variant' : 'case';else this.sensitivity = diacriticSensitive ? 'accent' : 'base';
    this.locale = locale;
    this.collator = new Intl.Collator(this.locale ? this.locale : [], {
      sensitivity: this.sensitivity,
      usage: 'search'
    });
  }

  compare(lhs, rhs) {
    return this.collator.compare(lhs, rhs);
  }

  resolvedLocale() {
    // We create a Collator without "usage: search" because we don't want
    // the search options encoded in our result (e.g. "en-u-co-search")
    return new Intl.Collator(this.locale ? this.locale : []).resolvedOptions().locale;
  }

  serialize() {
    const options = {};
    options['caseSensitive'] = this.sensitivity === 'variant' || this.sensitivity === 'case';
    options['diacriticSensitive'] = this.sensitivity === 'variant' || this.sensitivity === 'accent';

    if (this.locale) {
      options['locale'] = this.locale;
    }

    return ["collator", options];
  }

}
export class CollatorExpression {
  constructor(caseSensitive, diacriticSensitive, locale) {
    this.type = CollatorType;
    this.locale = locale;
    this.caseSensitive = caseSensitive;
    this.diacriticSensitive = diacriticSensitive;
  }

  static parse(args, context) {
    if (args.length !== 2) return context.error(`Expected one argument.`);
    const options = args[1];
    if (typeof options !== "object" || Array.isArray(options)) return context.error(`Collator options argument must be an object.`);
    const caseSensitive = context.parse(options['caseSensitive'] === undefined ? false : options['caseSensitive'], 1, BooleanType);
    if (!caseSensitive) return null;
    const diacriticSensitive = context.parse(options['diacriticSensitive'] === undefined ? false : options['diacriticSensitive'], 1, BooleanType);
    if (!diacriticSensitive) return null;
    let locale = null;

    if (options['locale']) {
      locale = context.parse(options['locale'], 1, StringType);
      if (!locale) return null;
    }

    return new CollatorExpression(caseSensitive, diacriticSensitive, locale);
  }

  evaluate(ctx) {
    return new Collator(this.caseSensitive.evaluate(ctx), this.diacriticSensitive.evaluate(ctx), this.locale ? this.locale.evaluate(ctx) : null);
  }

  eachChild(fn) {
    fn(this.caseSensitive);
    fn(this.diacriticSensitive);

    if (this.locale) {
      fn(this.locale);
    }
  }

  possibleOutputs() {
    // Technically the set of possible outputs is the combinatoric set of Collators produced
    // by all possibleOutputs of locale/caseSensitive/diacriticSensitive
    // But for the primary use of Collators in comparison operators, we ignore the Collator's
    // possibleOutputs anyway, so we can get away with leaving this undefined for now.
    return [undefined];
  }

  serialize() {
    const options = {};
    options['caseSensitive'] = this.caseSensitive;
    options['diacriticSensitive'] = this.diacriticSensitive;

    if (this.locale) {
      options['locale'] = this.locale;
    }

    return ["collator", options];
  }

}