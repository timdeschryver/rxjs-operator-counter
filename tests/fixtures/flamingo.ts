const foo = of([]).pipe(
  map(x => 5),
  map(x => 5),
  filter(x => true)
)
