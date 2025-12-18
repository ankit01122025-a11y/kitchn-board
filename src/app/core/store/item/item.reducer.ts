import { createReducer, on } from '@ngrx/store';
import * as ItemActions from './item.actions';
import { initialItemState } from './item.state';


export const itemReducer = createReducer(
    initialItemState,

    on(ItemActions.loadItems, state => ({ ...state, loading: true })),


    on(ItemActions.loadItemsSuccess, (state, { items }) => ({
        ...state,
        items,
        loading: false
    })),

    on(ItemActions.loadItemsFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(ItemActions.addItemSuccess, (state, { item }) => ({
        ...state,
        items: [...state.items, item]
    })),

    on(ItemActions.updateItemSuccess, (state, { item }) => ({
        ...state,
        items: state.items.map(i => i.id === item.id ? item : i)
    })),

    on(ItemActions.deleteItemSuccess, (state, { id }) => ({
        ...state,
        items: state.items.filter(i => i.id !== id)
    }))
);