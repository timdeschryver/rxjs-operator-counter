@Effect() 
getCustomers = this.actions.pipe(
  ofType(CustomerActionTypes.Get), 
  switchMap(() =>
    this.service.get().pipe(
      map(customers => new GetCustomersSuccess(customers)),
      catchError(error => of(new GetCustomersFailed(error))),
    ),
  ),
);

@Effect() 
ping = interval(1000).pipe(mapTo(new Ping()));


@Effect()
online = merge(
  of(navigator.onLine),
  fromEvent(window, 'online').pipe(mapTo(true)),
  fromEvent(window, 'offline').pipe(mapTo(false)),
).pipe(map(online => online ? new IsOnline() : new IsOffline()));