class RuntimeError {
  constructor(message) {
    this.name = 'ExpressionEvaluationError';
    this.message = message;
  }

  toJSON() {
    return this.message;
  }

}

export default RuntimeError;