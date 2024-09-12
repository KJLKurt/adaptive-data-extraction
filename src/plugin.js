// plugins.js
export const plugins = {
    actions: {},
    transformations: {}
  };
  
  export function registerAction(name, actionHandler) {
    plugins.actions[name] = actionHandler;
  }
  
  export function registerTransformation(name, transformHandler) {
    plugins.transformations[name] = transformHandler;
  }
  