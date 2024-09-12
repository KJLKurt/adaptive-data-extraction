// utils.js
export async function fetchData(url, method = 'GET', data = null, responseType = 'json') {
    const options = {
      method: method.toUpperCase(),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    if (method === 'POST' && data) {
      options.body = JSON.stringify(data);
    }
  
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
  
      switch (responseType) {
        case 'json':
          return await response.json();
        case 'text':
          return await response.text();
        case 'document':
          return await response.text().then(parseAsDOMDocument);
        default:
          console.error('Unknown response type:', responseType);
          return await response.text();
      }
    } catch (error) {
      console.error('Fetch error:', error.message);
      return null;
    }
  }
  
  export function parseAsDOMDocument(text) {
    const parser = new DOMParser();
    return parser.parseFromString(text, 'text/html');
  }
  
  export function query(selector, contextElement) {
    return contextElement.querySelector(selector);
  }
  
  export function queryAll(selector, contextElement) {
    return Array.from(contextElement.querySelectorAll(selector));
  }
  
  export function logMessage(message) {
    console.log(message);
  }
  