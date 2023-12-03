export interface Options {
  /** 最终转换后的包名 */
  name: 'lodash' | 'lodash-es';
  /** 是否需要转换 `lodash` 包名 */
  standalone: boolean;
  /** 是否需要转换 `lodash.method` 形式包名 */
  package: boolean;
  /** 是否需要转换 `lodash/method`、`lodash/category/method` 形式包名 */
  method: boolean;
  /** 是否需要转换 `lodash/category` 形式包名 */
  category: boolean;
  /** 是否需要转换 CommonJS 模块 */
  cjs: boolean;
}
