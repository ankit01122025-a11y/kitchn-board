import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState } from './category.state';

export const selectCategoryState =
    createFeatureSelector<CategoryState>('categories');

export const selectCategories = createSelector(
    selectCategoryState,
    state => state.categories
);

export const selectLoading = createSelector(
    selectCategoryState,
    state => state.loading
);
