import * as ts from 'typescript'
import * as Lint from 'tslint'
import { tsquery } from '@phenomnomnominal/tsquery'

export class Rule extends Lint.Rules.AbstractRule {
  static ruleName = 'operator-counter'
  static query =
    'CallExpression[expression.name.name="pipe"] > CallExpression > Identifier'

  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    const hits = tsquery(sourceFile, Rule.query, {
      visitAllChildren: true,
    })
    return hits.map(
      (operator: ts.Identifier) =>
        new Lint.RuleFailure(
          sourceFile,
          operator.getStart(),
          operator.getEnd(),
          operator.text,
          Rule.ruleName
        )
    )
  }
}
