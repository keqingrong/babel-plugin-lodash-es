const path = require('path');
const pluginTester = require('babel-plugin-tester').default;
const pluginLodashES = require('../').default;

pluginTester({
  plugin: pluginLodashES,
  pluginName: 'lodash-es',
  fixtures: path.join(__dirname, 'fixtures'),
  // error: (_err) => {
  //   return true;
  // },
  tests: {
    'esm case 1': {
      code: `import _ from 'lodash';`,
      output: `import _ from 'lodash-es';`,
      pluginOptions: {
        name: 'lodash-es',
      },
    },
    'esm case 2': {
      code: `import _ from 'lodash-es';`,
      output: `import _ from 'lodash';`,
      pluginOptions: {
        name: 'lodash',
      },
    },
  },
});

