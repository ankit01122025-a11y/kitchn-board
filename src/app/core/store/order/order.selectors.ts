import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OrderState } from './order.state';

export const selectOrderState =
    createFeatureSelector<OrderState>('orders');

export const selectOrders = createSelector(
    selectOrderState,
    state => state.orders
);

export const selectOrderLoading = createSelector(
    selectOrderState,
    state => state.loading
);