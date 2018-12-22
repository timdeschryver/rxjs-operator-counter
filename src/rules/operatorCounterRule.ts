import * as ts from 'typescript'
import * as Lint from 'tslint'

export class Rule extends Lint.Rules.AbstractRule {
  apply(sourceFile: ts.SourceFile): Lint.RuleFailure[] {
    return this.applyWithWalker(
      new OperatorCounterWalker(sourceFile, this.getOptions())
    )
  }
}

class OperatorCounterWalker extends Lint.RuleWalker {
  visitIdentifier(node: ts.Identifier) {
    if (node.text !== 'pipe') return

    const member = node.parent as ts.MemberExpression
    if (!member) return

    const call = member.parent as ts.CallExpression
    if (!call || !call.arguments) return

    call.arguments
      .filter(ts.isCallExpression)
      .map(argument => argument.expression as ts.Identifier)
      .filter(Boolean)
      .forEach(identifier => this.addFailureAtNode(node, identifier.text))
  }
}
