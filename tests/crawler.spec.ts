import { crawl } from '../src/crawler'

test(`test run`, () => {
  let log = ''
  console.log = jest.fn(message => (log += message))
  crawl({
    tsConfigPath: './tests/fixtures/tsconfig.json',
  })

  expect(log).toMatchSnapshot()
})
