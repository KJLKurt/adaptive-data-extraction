// conditions.js
export function applyCondition(value, condition, expectedValue) {
    switch (condition) {
      case 'equals':
        return value === expectedValue;
      case 'strictEquals':
        return value === expectedValue;
      case 'greaterThan':
        return value > expectedValue;
      case 'greaterThanOrEqual':
        return value >= expectedValue;
      case 'lessThan':
        return value < expectedValue;
      case 'lessThanOrEqual':
        return value <= expectedValue;
      case 'contains':
        return value.includes(expectedValue);
      case 'doesNotContain':
        return !value.includes(expectedValue);
      case 'empty':
        return value === '';
      case 'isNotEmpty':
        return value !== '';
      default:
        console.error('Unknown condition:', condition);
        return false;
    }
  }
  