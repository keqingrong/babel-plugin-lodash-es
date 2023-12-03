import { declare } from '@babel/helper-plugin-utils';

import { transformCJS } from './transformCJS';
import { transformESM } from './transformESM';
import { Options } from './types';

const defaultOptions: Options = {
  name: 'lodash-es',
  standalone: true,
  package: true,
  method: true,
  category: true,
  cjs: false,
};

export default declare<Options>((api, options) => {
  api.assertVersion(7);

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  return {
    name: 'lodash-es',
    visitor: {
      Program(path) {
        if (mergedOptions.cjs) {
          transformCJS(path, mergedOptions);
        }
        transformESM(path, mergedOptions);
      },
    },
  };
});
