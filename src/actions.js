/*
 * Adaptive Data Extraction
 *
 * This file is part of Adaptive Data Extraction.
 *
 * Adaptive Data Extraction is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Adaptive Data Extraction is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Adaptive Data Extraction.  If not, see <https://www.gnu.org/licenses/>.
 */

// actions.js
import { fetchData, query, queryAll, logMessage } from './utils.js';
import { applyCondition } from './conditions.js';

export const builtInActions = {
  async loop(action, contextElement, context, processActions) {
    const items = context[action.inputKey] || [];
    let i = 0
    for (const item of items) {
      context[action.itemKey] = item;
      await processActions({ actions: action.actions }, context);
    }
  },

  async condition(action, contextElement, context, processActions) {
    const conditionMet = applyCondition(context[action.inputKey], action.condition, action.value);
    const actionsToProcess = conditionMet ? action.actions : action.elseActions;
    if (actionsToProcess) {
      return await processActions({ actions: actionsToProcess }, context);
    } else {
      console.error('Unknown conditional actions criteria met');
    }
  },

  async query(action, contextElement, context) {
    const element = query(action.selector, contextElement);
    return element ? element.innerText : null;
  },

  async queryAll(action, contextElement, context) {
    const elements = queryAll(action.selector, contextElement);
    return elements.map(el => el.innerText);
  },

  async fetch(action, contextElement, context) {
    const { url, method = 'GET', data = null, responseType = 'json' } = action;
    const response = await fetchData(url, method, data, responseType);
    return response;
  },

  async setContext(action, contextElement, context) {
    context[action.key] = action.value;
  },

  async deleteContext(action, contextElement, context) {
    delete context[action.key];
  },

  async log(action, contextElement, context) {
    logMessage(action.message.replace(/\$\{(\w+)\}/g, (_, key) => context[key] || ''));
  },

  async transform(action, contextElement, context) {
    const transformHandler = builtInTransformations[action.transformation] || plugins.transformations[action.transformation];
    if (transformHandler) {
      return transformHandler(context[action.inputKey], action, context);
    } else {
      console.error('Unknown transformation type:', transformation);
    }
  }
};
