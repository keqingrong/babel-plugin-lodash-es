import { types as t } from '@babel/core';
import * as _ from 'lodash';

/**
 * Lodash v4 支持的所有方法、属性名称
 */
export const lodashMethods = Object.keys(_);

/**
 * 匹配 lodash 开头包名
 */
export const lodashPackagePattern = /^lodash/;

/**
 * 匹配 `lodash.method` 形式包名
 */
export const packageMethodPattern = /^(lodash)\.(\w+)$/;

/**
 * 匹配 Lodash v4 `lodash/method`、`lodash/category` 形式包名
 */
export const methodOrCategoryPattern = /^(lodash|lodash-es)\/(\w+)$/;

/**
 * 匹配 Lodash v3 `lodash/category/method` 形式包名
 */
export const categoryMethodPattern = /^(lodash|lodash-es)\/(\w+)\/(\w+)$/;

/**
 * Lodash 支持的 category
 * https://lodash.com/custom-builds
 */
export const lodashCategoryNames = [
  'array',
  'collection',
  'date',
  'function',
  'lang',
  'object',
  'number',
  'seq',
  'string',
  'util',
];

/**
 * 查找 Lodash v4 支持的方法名（不区分大小写）
 *
 * @example
 * ```js
 * findLodashMethodName('clonedeep'); // 'cloneDeep'
 * findLodashMethodName('cloneDeep'); // 'cloneDeep'
 * ```
 */
export const findLodashMethodName = (name: string) =>
  lodashMethods.find(
    (method) => method === name || method.toLocaleLowerCase() === name
  );

/**
 * 创建有名导入声明语句
 *
 * @example
 *
 * ```js
 * import { exportName } from 'module-name'
 * import { exportName as aliasName } from 'module-name'
 * ```
 */
export const createNamedImport = (
  moduleName: string,
  exportName: string,
  aliasName?: string
) =>
  t.importDeclaration(
    [
      t.importSpecifier(
        t.identifier(aliasName ?? exportName),
        t.identifier(exportName)
      ),
    ],
    t.stringLiteral(moduleName)
  );

/**
 * 创建默认导入声明语句
 *
 * @example
 *
 * ```js
 * import defaultExportName from 'module-name'
 * ```
 */
export const createDefaultImport = (
  moduleName: string,
  defaultExportName: string
) =>
  t.importDeclaration(
    [t.importDefaultSpecifier(t.identifier(defaultExportName))],
    t.stringLiteral(moduleName)
  );

/**
 * 创建命名空间导入声明语句
 *
 * @example
 *
 * ```js
 * import * as namespaceName from 'module-name'
 * ```
 */
export const createNamespaceImport = (
  moduleName: string,
  namespaceName: string
) =>
  t.importDeclaration(
    [t.importNamespaceSpecifier(t.identifier(namespaceName))],
    t.stringLiteral(moduleName)
  );

/**
 * 判断是否是 `require('lodash*')` 函数调用
 */
export const isRequireLodashCallExpression = (node: t.CallExpression) =>
  t.isIdentifier(node.callee) &&
  node.callee.name === 'require' &&
  node.arguments.length === 1 &&
  t.isStringLiteral(node.arguments[0]) &&
  lodashPackagePattern.test(node.arguments[0].value);
