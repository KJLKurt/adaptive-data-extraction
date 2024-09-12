# Data Processing Toolkit

A flexible and extensible JavaScript library for processing data through actions and transformations. This toolkit provides built-in functionalities and allows for easy extension with custom plugins.

Transform your data from config.

## Use Cases

The original use case was for an extension that scraped a website that changed their data structure frequently.  Additionally, some of hte pages the data was scraped on had advanced ways of grabbing the data, such as, inside of an element attribute there was string which needed to be JSON parsed to grab a value of another string that needed to be parsed into JSON, so it could loop through and grab all the data inside of that.

```
<div data-videos="{"\\test\\":\\"testing\\",\\"people\\":\\"{\\\\"data\\\\":[{\\\\"person\\\\":\\\\"A\\\\"},{\\\\"person\\\\":\\\\"b\\\\"}]}"}"></div>
```

Instead of having to submit a new version of the extension, this code was created so the extension could load a config file from the server.  The server config code could be updated quicker than the approval process.

Additional use cases include the ability to provide actions and transformations so the frontend code doesn't have to make assumptions.  For example, if you have a bunch of data files that need to be parsed in different ways then the frontend need to display the data in a nice way, then you could have the backend send the configuration while the frontend doesn't worry about how to capture the right data but instead about displaying what they need.

## Features

- **Flexible Actions**: Perform operations such as fetching data, querying DOM elements, and conditional processing.
- **Powerful Transformations**: Transform data using built-in and custom transformations.
- **Modular Design**: Easily extend and customize functionality with plugins.
- **Replace ${contextKey}**: ability to add context variables inside of other steps action configuration values and have it be replaced

## Installation

To install the package, use npm:

```bash
npm install your-package-name
```

## Built-in Actions

### `fetch`
Fetches data from a URL.

- **`url`**: The URL to fetch data from.
- **`method`**: HTTP method (`GET` or `POST`).
- **`data`**: Optional data for POST requests.
- **`responseType`**: Type of response expected (`json`, `text`, `document`).

Example:

```json
{
  "type": "fetch",
  "url": "https://api.example.com/data",
  "method": "GET",
  "responseType": "json",
  "outputKey": "dataResponse"
}
```

### `query`
Queries a single DOM element.

- **`selector`**: The CSS selector for the element.
- **`outputKey`**: The key to store the element's text content.

Example:

```json
{
  "type": "query",
  "selector": "#my-element",
  "outputKey": "elementText"
}
```

### `queryAll`
Queries all matching DOM elements.

- **`selector`**: The CSS selector for the elements.
- **`outputKey`**: The key to store an array of the elements' text content.

Example:

```json
{
  "type": "queryAll",
  "selector": ".items",
  "outputKey": "allItemsText"
}
```

### `log`
Logs a message to the console.

- **`message`**: The message to log, can use `${key}` for context values.

Example:

```json
{
  "type": "log",
  "message": "Fetched data: ${dataResponse}"
}
```

### `loop`
Loops over an array and executes actions for each item.

- **`inputKey`**: The key of the array to loop over.
- **`itemKey`**: The key to store the current item.
- **`actions`**: Actions to execute for each item.

Example:

```json
{
  "type": "loop",
  "inputKey": "itemsArray",
  "itemKey": "currentItem",
  "actions": [
    {
      "type": "log",
      "message": "Processing item: ${currentItem}"
    }
  ]
}
```

### `condition`
Executes actions based on a condition.

- **`inputKey`**: The key of the value to check.
- **`condition`**: The type of condition (`equals`, `contains`, etc.).
- **`value`**: The value to compare against.
- **`actions`**: Actions to execute if the condition is true.
- **`elseActions`**: Actions to execute if the condition is false.

Example:

```json
{
  "type": "condition",
  "inputKey": "status",
  "condition": "equals",
  "value": "success",
  "actions": [
    {
      "type": "log",
      "message": "Operation succeeded"
    }
  ],
  "elseActions": [
    {
      "type": "log",
      "message": "Operation failed"
    }
  ]
}
```

### `setContext`
Sets a value in the context.

- **`key`**: The key to set in the context.
- **`value`**: The value to set.

Example:

```json
{
  "type": "setContext",
  "key": "userName",
  "value": "John Doe"
}
```

## Built-in Transformations

### `uppercase`
Transforms a string to uppercase.

### `lowercase`
Transforms a string to lowercase.

### `replace`
Replaces all occurrences of a substring with another substring. Supports context keys in replacement values.

- **`search`**: The substring to replace.
- **`replacement`**: The replacement substring or context key.

Example:

```json
{
  "transformation": "replace",
  "inputKey": "text",
  "config": {
    "search": "foo",
    "replacement": "bar"
  },
  "outputKey": "transformedText"
}
```

### `split`
Splits a string by a delimiter.

- **`delimiter`**: The delimiter to use (default is `,`).

Example:

```json
{
  "transformation": "split",
  "inputKey": "csvData",
  "config": {
    "delimiter": ","
  },
  "outputKey": "arrayData"
}
```

### `jsonParse`
Parses a JSON string into an object.

Example:

```json
{
  "transformation": "jsonParse",
  "inputKey": "jsonString",
  "outputKey": "parsedObject"
}
```

### `transform`
Applies a transformation with given configuration.

- **`transformation`**: The type of transformation.
- **`params`**: Parameters for the transformation.

## Adding Custom Plugins

### Custom Actions

1. **Create an action handler function**:
   
   ```javascript
   async function customActionHandler(action, contextElement, context, processActions) {
     // Your custom logic
     // you can either set the context here or return the context if there is a setup an action.outputKey
   }
   ```

2. **Register the custom action**:

   ```javascript
   import { registerAction } from 'your-package-name';

   registerAction('customAction', customActionHandler);
   ```

### Custom Transformations

1. **Create a transformation function**:

   ```javascript
   function customTransformation(value, config, context) {
     // Your custom logic
   }
   ```

2. **Register the custom transformation**:

   ```javascript
   import { registerTransformation } from 'your-package-name';

   registerTransformation('customTransform', customTransformation);
   ```

## Usage Example

Here is how you would use the toolkit in a project:

```javascript
import { processActions } from 'your-package-name';

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
      transformation: 'replace',
      inputKey: 'dataResponse.message',
      config: {
        search: 'foo',
        replacement: 'bar'
      },
      outputKey: 'transformedMessage'
    },
    {
      type: 'log',
      message: 'Transformed message: ${transformedMessage}'
    }
  ]
};

const context = {};

processActions(config, context);
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to open issues and pull requests. We welcome contributions to improve the package!

## Support

For questions and support, please open an issue on the GitHub repository or contact the maintainer.
