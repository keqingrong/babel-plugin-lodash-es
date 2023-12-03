import type { NodePath } from '@babel/traverse';
import { types as t } from '@babel/core';

import {
  lodashCategoryNames,
  packageMethodPattern,
  methodOrCategoryPattern,
  categoryMethodPattern,
  findLodashMethodName,
  createNamedImport,
} from './helpers';
import { Options } from './types';

const fpErrorMessage = '"lodash/fp" is not supported by babel-plugin-lodash-es';

/**
 * 转换 ES 模块
 */
export const transformESM = (path: NodePath<t.Program>, options: Options) => {
  const { name: newPackageName } = options;

  path.traverse({
    ImportDeclaration(path) {
      const { node } = path;
      const { source, specifiers } = node;
      const moduleName = source.value;
      const firstSpecifier = specifiers[0];

      if (
        options.standalone &&
        (moduleName === 'lodash' || moduleName === 'lodash-es')
      ) {
        if (moduleName !== newPackageName) {
          source.value = newPackageName;
        }
        return;
      }

      if (options.package && packageMethodPattern.test(moduleName)) {
        const [_matched, _matchedPackageName, lowercaseMethodName] =
          packageMethodPattern.exec(moduleName) || [];
        if (!_matched) {
          return;
        }
        const methodName = findLodashMethodName(lowercaseMethodName);
        if (t.isImportDefaultSpecifier(firstSpecifier) && methodName) {
          path.replaceWith(
            createNamedImport(
              newPackageName,
              methodName,
              firstSpecifier.local.name
            )
          );
        }
        return;
      }

      if (options.method && methodOrCategoryPattern.test(moduleName)) {
        const [_matched, matchedPackageName, matchedMethodName] =
          methodOrCategoryPattern.exec(moduleName) || [];
        if (!_matched) {
          return;
        }
        const methodName = findLodashMethodName(matchedMethodName);
        if (methodName) {
          if (t.isImportDefaultSpecifier(firstSpecifier)) {
            path.replaceWith(
              createNamedImport(
                newPackageName,
                methodName,
                firstSpecifier.local.name
              )
            );
          }
        } else if (lodashCategoryNames.includes(matchedMethodName)) {
          if (options.category) {
            source.value = newPackageName;
          } else if (matchedPackageName !== newPackageName) {
            source.value = moduleName.replace(
              matchedPackageName,
              newPackageName
            );
          }
        } else if (matchedMethodName === 'core') {
          source.value = newPackageName;
        } else if (matchedMethodName === 'fp') {
          console.warn(path.buildCodeFrameError(fpErrorMessage));
          return;
        }
        return;
      }

      if (options.method && categoryMethodPattern.test(moduleName)) {
        const [
          _matched,
          _matchedPackageName,
          matchedCategoryName,
          matchedMethodName,
        ] = categoryMethodPattern.exec(moduleName) || [];
        if (!_matched) {
          return;
        }
        if (matchedCategoryName === 'fp') {
          console.warn(path.buildCodeFrameError(fpErrorMessage));
          return;
        }
        const methodName = findLodashMethodName(matchedMethodName);
        if (t.isImportDefaultSpecifier(firstSpecifier) && methodName) {
          path.replaceWith(
            createNamedImport(
              newPackageName,
              methodName,
              firstSpecifier.local.name
            )
          );
        }
        return;
      }
    },
  });
};
