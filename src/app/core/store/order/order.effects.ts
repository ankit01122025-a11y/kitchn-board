import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { OrderService } from '../../services/order/order.service';
import * as OrderActions from './order.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class OrderEffects {
    constructor(
        private actions$: Actions,
        private service: OrderService
    ) { }

    load$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OrderActions.loadOrders),
            mergeMap(() =>
                this.service.loadOrders().pipe(
                    map(orders => OrderActions.loadOrdersSuccess({ orders })),
                    catchError(() =>
                        of(OrderActions.loadOrdersFailure({ error: 'Load failed' }))
                    )
                )
            )
        )
    );

    add$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OrderActions.addOrder),
            mergeMap(({ order }) =>
                this.service.add(order).pipe(
                    map(res => OrderActions.addOrderSuccess({ order: res })),
                    catchError(() =>
                        of(OrderActions.addOrderFailure({ error: 'Add failed' }))
                    )
                )
            )
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OrderActions.updateOrder),
            mergeMap(({ order }) =>
                this.service.update(order).pipe(
                    map(res => OrderActions.updateOrderSuccess({ order: res })),
                    catchError(() =>
                        of(OrderActions.updateOrderFailure({ error: 'Update failed' }))
                    )
                )
            )
        )
    );

    delete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(OrderActions.deleteOrder),
            mergeMap(({ id }) =>
                this.service.delete(id).pipe(
                    map(() => OrderActions.deleteOrderSuccess({ id })),
                    catchError(() =>
                        of(OrderActions.deleteOrderFailure({ error: 'Delete failed' }))
                    )
                )
            )
        )
    );
}