# babel-plugin-lodash-es

## Installation

```sh
# NPM
npm i lodash-es
npm i -D babel-plugin-lodash-es

# PNPM
pnpm add lodash-es
pnpm add -D babel-plugin-lodash-es
```

## Usage

`.babelrc`

```json
{
  "plugins": ["lodash-es"]
}
```

Use with [babel-plugin-lodash](https://www.npmjs.com/package/babel-plugin-lodash)

```json
{
  "plugins": ["lodash-es", "lodash"]
}
```

```json
{
  "plugins": [["lodash-es", { "cjs": true } ], "lodash"]
}
```

## Options

```ts
interface Options {
  /** The final transformed package name */
  name: 'lodash' | 'lodash-es';
  /** Whether to transform the package name `lodash` */
  standalone: boolean;
  /** Whether to transform package names in the form of `lodash.method` */
  package: boolean;
  /** Whether to transform package names in the form of `lodash/method` or `lodash/category/method` */
  method: boolean;
  /** Whether to transform package names in the form of `lodash/category` */
  category: boolean;
  /** Whether to transform CommonJS modules */
  cjs: boolean;
}
```

## Test Cases for ESM

### ESM Case 1

```js
Input: `import _ from 'lodash';`
Output: `import _ from 'lodash-es';`

Input: `import _, { cloneDeep } from 'lodash';`
Output: `import _, { cloneDeep } from 'lodash-es';`

Input: `import * as _ from 'lodash';`
Output: `import * as _ from 'lodash-es';`

Input: `import * as _ from 'lodash-es';`
Output: `import _ from 'lodash';`
```

### ESM Case 2

```js
Input: `import cloneDeep from 'lodash.clonedeep';`
Output: `import { cloneDeep } from 'lodash-es';`

Input: `import cloneDeepAlias from 'lodash.clonedeep';`
Output: `import { cloneDeep as cloneDeepAlias } from 'lodash-es';`
```

### ESM Case 3

```js
Input: `import cloneDeepAlias from 'lodash/cloneDeep';`
Output: `import { cloneDeep as cloneDeepAlias } from 'lodash-es';`
```

### ESM Case 4

```js
Input: `import * as array from 'lodash/array';`
Output: `import * as array from 'lodash-es/array';`

Input: `import { flatten } from 'lodash/array';`
Output: `import { flatten } from 'lodash-es';`
```

### ESM Case 5

```js
Input: `import _ from 'lodash/core';`
Output: `import _ from 'lodash-es';`
```

### ESM Case 6

```js
Input: `import pull from 'lodash/array/pull';`
Output: `import { pull } from 'lodash-es';`
```

## Test Cases for CJS

### CJS Case 1

```js
Input: `var _ = require('lodash');`
Output: `import * as _ from 'lodash';`
```

### CJS Case 2

```js
Input: `var cloneDeep = require('lodash.clonedeep');`
Output: `import { cloneDeep } from 'lodash';`
```

### CJS Case 3

```js
Input: `var isEqual = require('lodash/isEqual');`
Output: `import { isEqual } from 'lodash';`
```

### CJS Case 4

```js
Input: `var array = require('lodash/array');`
Output: `import * as array from 'lodash/array';`

Input: `var _ = require('lodash/core');`
Output: `import * as _ from 'lodash/core';`

Input: `var fp = require('lodash/fp');`
Output: `import * as fp from 'lodash/fp';`
```

### CJS Case 5

```js
Input: `var pull = require('lodash/array/pull');`
Output: `import pull from 'lodash/array/pull';`
```
