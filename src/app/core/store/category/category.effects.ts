import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CategoryService } from '../../services/category/category.service';
import * as CategoryActions from './category.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class CategoryEffects {

    constructor(
        private actions$: Actions,
        private service: CategoryService
    ) { }

    load$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryActions.loadCategories),
            mergeMap(() =>
                this.service.loadCategories().pipe(
                    map(categories =>
                        CategoryActions.loadCategoriesSuccess({ categories })
                    ),
                    catchError(() =>
                        of(CategoryActions.loadCategoriesFailure({ error: 'Load failed' }))
                    )
                )
            )
        )
    );

    add$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryActions.addCategory),
            mergeMap(({ category }) =>
                this.service.add(category).pipe(
                    map(res =>
                        CategoryActions.addCategorySuccess({ category: res })
                    ),
                    catchError(() =>
                        of(CategoryActions.addCategoryFailure({ error: 'Add failed' }))
                    )
                )
            )
        )
    );

    update$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryActions.updateCategory),
            mergeMap(({ category }) =>
                this.service.update(category).pipe(
                    map(res =>
                        CategoryActions.updateCategorySuccess({ category: res })
                    ),
                    catchError(() =>
                        of(CategoryActions.updateCategoryFailure({ error: 'Update failed' }))
                    )
                )
            )
        )
    );

    delete$ = createEffect(() =>
        this.actions$.pipe(
            ofType(CategoryActions.deleteCategory),
            mergeMap(({ id }) =>
                this.service.delete(Number(id)).pipe(
                    map(() =>
                        CategoryActions.deleteCategorySuccess({ id })
                    ),
                    catchError(() =>
                        of(CategoryActions.deleteCategoryFailure({ error: 'Delete failed' }))
                    )
                )
            )
        )
    );
}
