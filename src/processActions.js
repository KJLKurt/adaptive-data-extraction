/*
 * Adaptive Data Extraction
 *
 * Copyright (c) 2024 KJLKurt
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { builtInActions } from './actions.js';
import { builtInTransformations } from './transformations.js';
import { plugins } from './plugins.js';

export async function processActions(config, context = {}) {
  for (const action of config.actions) {
    let contextElement;

    let resolvedAction = resolveContextKeys(action, context);

    if (resolvedAction.contextKey) {
      contextElement = context[resolvedAction.contextKey] || document;
    } else {
      contextElement = document;
    }

    let actionHandler = builtInActions[resolvedAction.type] || plugins.actions[resolvedAction.type];
    let transformHandler = builtInTransformations[resolvedAction.transformation] || plugins.transformations[resolvedAction.transformation];

    if (actionHandler) {
        let returnActionData = await actionHandler(resolvedAction, contextElement, context, processActions);
        if(resolvedAction.outputKey) { 
            context[resolvedAction.outputKey] = returnActionData;
        }
    } else {
      console.error('Unknown action or transformation type:', action.transformation || action.type);
    }
  }
  return context;
}

function resolveContextKeys(value, context) {
    if (typeof value === 'string') {
      return value.replace(/\$\{(\w+)\}/g, (_, key) => context[key] || '');
    }
  
    if (Array.isArray(value)) {
      return value.map(item => resolveContextKeys(item, context));
    }
  
    if (typeof value === 'object' && value !== null) {
      return Object.keys(value).reduce((acc, key) => {
        acc[key] = resolveContextKeys(value[key], context);
        return acc;
      }, {});
    }
  
    return value;
}