import * as Lint from 'tslint'
import * as path from 'path'
import { EOL } from 'os'
import { white, blue, green } from 'kleur'

export function crawl({ tsConfigPath = '' } = {}) {
  if (!tsConfigPath) {
    tsConfigPath = 'tsconfig.json'
    console.log(
      blue(`No tsconfig provided with -p, using "${tsConfigPath}" as fallback`)
    )
  }

  console.log(white('One moment, crawling files to find operators 🧐'))

  const options = {
    fix: false,
    rulesDirectory: path.join(__dirname, 'rules'),
  }
  const program = Lint.Linter.createProgram(tsConfigPath, './')
  const linter = new Lint.Linter(options, program)
  const rules = new Map<string, Partial<Lint.IOptions>>([
    [
      'operator-counter',
      {
        ruleName: 'operator-counter',
      },
    ],
  ])
  const lintConfiguration = {
    rules,
    jsRules: rules,
    rulesDirectory: [options.rulesDirectory],
    extends: [''],
  }

  const files = Lint.Linter.getFileNames(program)
  files.forEach(file => {
    const fileContents = program.getSourceFile(file).getFullText()
    linter.lint(file, fileContents, lintConfiguration)
  })

  const results = linter.getResult()
  const hits = results.failures
    .map(x => x.getFailure())
    .reduce<{ [operator: string]: number }>((counter, operator) => {
      counter[operator] = (counter[operator] || 0) + 1
      return counter
    }, {})

  console.log(green().underline(`Results: ${EOL}`))

  Object.entries(hits)
    .sort(
      ([key1, count1], [key2, count2]) =>
        count2 - count1 || key1.localeCompare(key2)
    )
    .forEach(([key, count]) => console.log(green().bold(`${key}: ${count}`)))

  return hits
}
