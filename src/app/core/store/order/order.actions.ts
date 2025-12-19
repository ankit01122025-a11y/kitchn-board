import { createAction, props } from '@ngrx/store';
import { Order } from '../../models/order.model';

export const loadOrders = createAction('[Order] Load');
export const loadOrdersSuccess = createAction(
    '[Order] Load Success',
    props<{ orders: Order[] }>()
);
export const loadOrdersFailure = createAction(
    '[Order] Load Failure',
    props<{ error: string }>()
);

export const addOrder = createAction(
    '[Order] Add',
    props<{ order: Order }>()
);
export const addOrderSuccess = createAction(
    '[Order] Add Success',
    props<{ order: Order }>()
);
export const addOrderFailure = createAction(
    '[Order] Add Failure',
    props<{ error: string }>()
);

export const updateOrder = createAction(
    '[Order] Update',
    props<{ order: Order }>()
);
export const updateOrderSuccess = createAction(
    '[Order] Update Success',
    props<{ order: Order }>()
);
export const updateOrderFailure = createAction(
    '[Order] Update Failure',
    props<{ error: string }>()
);

export const deleteOrder = createAction(
    '[Order] Delete',
    props<{ id: number }>()
);
export const deleteOrderSuccess = createAction(
    '[Order] Delete Success',
    props<{ id: number }>()
);
export const deleteOrderFailure = createAction(
    '[Order] Delete Failure',
    props<{ error: string }>()
);