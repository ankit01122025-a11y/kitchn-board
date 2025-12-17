import { createAction, props } from '@ngrx/store';
import { Category } from '../../models/category.model';

export const loadCategories = createAction('[Category] Load');
export const loadCategoriesSuccess = createAction(
    '[Category] Load Success',
    props<{ categories: Category[] }>()
);
export const loadCategoriesFailure = createAction(
    '[Category] Load Failure',
    props<{ error: string }>()
);

export const addCategory = createAction(
    '[Category] Add',
    props<{ category: Category }>()
);
export const addCategorySuccess = createAction(
    '[Category] Add Success',
    props<{ category: Category }>()
);
export const addCategoryFailure = createAction(
    '[Category] Add Failure',
    props<{ error: string }>()
);

export const updateCategory = createAction(
    '[Category] Update',
    props<{ category: Category }>()
);
export const updateCategorySuccess = createAction(
    '[Category] Update Success',
    props<{ category: Category }>()
);
export const updateCategoryFailure = createAction(
    '[Category] Update Failure',
    props<{ error: string }>()
);

export const deleteCategory = createAction(
    '[Category] Delete',
    props<{ id: string }>()
);
export const deleteCategorySuccess = createAction(
    '[Category] Delete Success',
    props<{ id: string }>()
);
export const deleteCategoryFailure = createAction(
    '[Category] Delete Failure',
    props<{ error: string }>()
);
