import { createReducer, on } from '@ngrx/store';
import * as CategoryActions from './category.actions';
import { initialCategoryState } from './category.state';

export const categoryReducer = createReducer(
    initialCategoryState,

    on(CategoryActions.loadCategories, state => ({
        ...state,
        loading: true
    })),

    on(CategoryActions.loadCategoriesSuccess, (state, { categories }) => ({
        ...state,
        categories,
        loading: false
    })),

    on(CategoryActions.loadCategoriesFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(CategoryActions.addCategorySuccess, (state, { category }) => ({
        ...state,
        categories: [...state.categories, category]
    })),

    on(CategoryActions.updateCategorySuccess, (state, { category }) => ({
        ...state,
        categories: state.categories.map(c =>
            c.id === category.id ? category : c
        )
    })),

    on(CategoryActions.deleteCategorySuccess, (state, { id }) => ({
        ...state,
        categories: state.categories.filter(c => Number(c.id) !== Number(id))
    }))
);
