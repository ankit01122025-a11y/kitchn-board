import { createReducer, on } from '@ngrx/store';
import * as OrderActions from './order.actions';
import { initialOrderState } from './order.state';

export const orderReducer = createReducer(
    initialOrderState,

    on(OrderActions.loadOrders, state => ({
        ...state,
        loading: true
    })),

    on(OrderActions.loadOrdersSuccess, (state, { orders }) => ({
        ...state,
        orders,
        loading: false
    })),

    on(OrderActions.loadOrdersFailure, (state, { error }) => ({
        ...state,
        loading: false,
        error
    })),

    on(OrderActions.addOrderSuccess, (state, { order }) => ({
        ...state,
        orders: [...state.orders, order]
    })),

    on(OrderActions.updateOrderSuccess, (state, { order }) => ({
        ...state,
        orders: state.orders.map(o =>
            o.id === order.id ? order : o
        )
    })),

    on(OrderActions.deleteOrderSuccess, (state, { id }) => ({
        ...state,
        orders: state.orders.filter(o => o.id !== id)
    }))
);