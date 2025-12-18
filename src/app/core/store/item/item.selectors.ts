import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ItemState } from './item.state';

export const selectItemState = createFeatureSelector<ItemState>('items');

export const selectItems = createSelector(
    selectItemState,
    state => state.items
);

export const selectItemLoading = createSelector(
    selectItemState,
    state => state.loading
);

export const selectItemsByCategoryId = (categoryId: number) =>
    createSelector(
        selectItems,
        items =>
            items.filter(item =>
                item.categoryIds.map(Number).includes(categoryId)
            )
    );