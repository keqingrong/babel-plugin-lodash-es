import type { NodePath } from '@babel/traverse';
import { types as t } from '@babel/core';

import {
  lodashCategoryNames,
  packageMethodPattern,
  methodOrCategoryPattern,
  categoryMethodPattern,
  findLodashMethodName,
  createNamedImport,
  createDefaultImport,
  createNamespaceImport,
  isRequireLodashCallExpression,
} from './helpers';
import { Options } from './types';

/**
 * 转换 CommonJS 模块（不需要处理 `lodash-es`）
 */
export const transformCJS = (path: NodePath<t.Program>, options: Options) => {
  path.traverse({
    CallExpression(path) {
      if (isRequireLodashCallExpression(path.node)) {
        const { value: moduleName } = path.node.arguments[0] as t.StringLiteral;
        const variableDeclaratorPath = path.parentPath;
        const variableDeclarationPath = variableDeclaratorPath.parentPath;

        if (
          !t.isVariableDeclarator(variableDeclaratorPath.node) ||
          !t.isIdentifier(variableDeclaratorPath.node.id) ||
          !variableDeclarationPath
        ) {
          return;
        }

        const variableName = variableDeclaratorPath.node.id.name;

        if (options.standalone && moduleName === 'lodash') {
          variableDeclarationPath.replaceWith(
            createNamespaceImport(moduleName, variableName)
          );
          return;
        }

        if (options.package && packageMethodPattern.test(moduleName)) {
          const [_matched, matchedPackageName, lowercaseMethodName] =
            packageMethodPattern.exec(moduleName) || [];
          if (!_matched) {
            return;
          }
          const methodName = findLodashMethodName(lowercaseMethodName);
          if (methodName) {
            variableDeclarationPath.replaceWith(
              createNamedImport(matchedPackageName, methodName, variableName)
            );
          }
          return;
        }

        if (options.method && methodOrCategoryPattern.test(moduleName)) {
          const [matched, matchedPackageName, matchedMethodName] =
            methodOrCategoryPattern.exec(moduleName) || [];
          if (!matched) {
            return;
          }
          const methodName = findLodashMethodName(matchedMethodName);

          if (methodName) {
            variableDeclarationPath.replaceWith(
              createNamedImport(matchedPackageName, methodName, variableName)
            );
            return;
          }

          if (
            lodashCategoryNames.includes(matchedMethodName) ||
            matchedMethodName === 'core' ||
            matchedMethodName === 'fp'
          ) {
            variableDeclarationPath.replaceWith(
              createNamespaceImport(moduleName, variableName)
            );
          }
          return;
        }

        if (options.method && categoryMethodPattern.test(moduleName)) {
          variableDeclarationPath.replaceWith(
            createDefaultImport(moduleName, variableName)
          );
          return;
        }
      }
    },
  });
};
