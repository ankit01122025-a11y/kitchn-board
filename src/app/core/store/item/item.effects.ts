import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ItemService } from '../../services/item/item.service';
import * as ItemActions from './item.actions';
import { mergeMap, map, catchError, of } from 'rxjs';


@Injectable()
export class ItemEffects {

    constructor(
        private actions$: Actions,
        private service: ItemService
    ) { }

    load$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemActions.loadItems),
            mergeMap(() =>
                this.service.loadItems().pipe(
                    map(items => ItemActions.loadItemsSuccess({ items })),
                    catchError(() => of(ItemActions.loadItemsFailure({ error: 'Load failed' })))
                )
            )
        )
    );

    add$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemActions.addItem),
            mergeMap(({ item }) =>
                this.service.add(item).pipe(
                    map(res => ItemActions.addItemSuccess({ item: res })),
                    catchError(() => of(ItemActions.addItemFailure({ error: 'Add failed' })))
                )
            )
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemActions.updateItem),
            mergeMap(({ item }) =>
                this.service.update(item).pipe(
                    map(res => ItemActions.updateItemSuccess({ item: res })),
                    catchError(() => of(ItemActions.updateItemFailure({ error: 'Update failed' })))
                )
            )
        )
    );

    delete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(ItemActions.deleteItem),
            mergeMap(({ id }) =>
                this.service.delete(id).pipe(
                    map(() => ItemActions.deleteItemSuccess({ id })),
                    catchError(() => of(ItemActions.deleteItemFailure({ error: 'Delete failed' })))
                )
            )
        )
    );
}