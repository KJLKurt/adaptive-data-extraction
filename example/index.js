// index.js
import { registerAction, registerTransformation } from './plugins.js';
import { processActions } from './processActions.js';

// Register custom plugins
registerAction('customLog', async (action, contextElement, context, processActions) => {
  console.log(`Custom Log: ${context[action.inputKey]}`);
  return context[action.inputKey];
});

registerTransformation('reverseString', value => value.split('').reverse().join(''));

// Define configuration
const config = {
  actions: [
    {
      type: 'fetch',
      url: 'https://api.example.com/data',
      method: 'GET',
      responseType: 'json',
      outputKey: 'dataResponse'
    },
    {
      type: 'transform',
      transformation: 'reverseString',
      inputKey: 'dataResponse.someString',
      outputKey: 'reversedString'
    },
    {
      type: 'customLog',
      inputKey: 'reversedString'
    }
  ]
};

// Process actions with initial context
processActions(config);
