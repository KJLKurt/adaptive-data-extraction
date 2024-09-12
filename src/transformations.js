// transformations.js
export const builtInTransformations = {
    uppercase(value) {
      return value.toUpperCase();
    },
  
    lowercase(value) {
      return value.toLowerCase();
    },
  
    replace(value, config, context) {
      const { search, replacement } = config;
      const replacementValue = context[replacement] || replacement;
      return value.split(search).join(replacementValue);
    },
  
    split(value, config) {
      const { delimiter = ',' } = config;
      return value.split(delimiter);
    },
  
    jsonParse(value) {
      try {
        return JSON.parse(value);
      } catch (e) {
        console.error('Invalid JSON:', e);
        return null;
      }
    },
  
    transform(value, config, context) {
      const { transformation, params } = config;
      const transformHandler = builtInTransformations[transformation] || plugins.transformations[transformation];
      if (transformHandler) {
        return transformHandler(value, params, context);
      } else {
        console.error('Unknown transformation type:', transformation);
        return value;
      }
    }
  };
  