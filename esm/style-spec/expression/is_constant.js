import CompoundExpression from './compound_expression';

function isFeatureConstant(e) {
  if (e instanceof CompoundExpression) {
    if (e.name === 'get' && e.args.length === 1) {
      return false;
    } else if (e.name === 'has' && e.args.length === 1) {
      return false;
    } else if (e.name === 'properties' || e.name === 'geometry-type' || e.name === 'id') {
      return false;
    } else if (/^filter-/.test(e.name)) {
      return false;
    }
  }

  let result = true;
  e.eachChild(arg => {
    if (result && !isFeatureConstant(arg)) {
      result = false;
    }
  });
  return result;
}

function isGlobalPropertyConstant(e, properties) {
  if (e instanceof CompoundExpression && properties.indexOf(e.name) >= 0) {
    return false;
  }

  let result = true;
  e.eachChild(arg => {
    if (result && !isGlobalPropertyConstant(arg, properties)) {
      result = false;
    }
  });
  return result;
}

export { isFeatureConstant, isGlobalPropertyConstant };