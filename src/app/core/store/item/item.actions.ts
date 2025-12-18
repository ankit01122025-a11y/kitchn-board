import { createAction, props } from '@ngrx/store';
import { Item } from '../../models/item.model';

export const loadItems = createAction('[Item] Load');
export const loadItemsSuccess = createAction(
    '[Item] Load Success',
    props<{ items: Item[] }>());
export const loadItemsFailure = createAction(
    '[Item] Load Failure',
    props<{ error: string }>());


export const addItem = createAction(
    '[Item] Add',
    props<{ item: Item }>());
export const addItemSuccess = createAction(
    '[Item] Add Success',
    props<{ item: Item }>());
export const addItemFailure = createAction(
    '[Item] Add Failure',
    props<{ error: string }>());


export const updateItem = createAction(
    '[Item] Update',
    props<{ item: Item }>());
export const updateItemSuccess = createAction(
    '[Item] Update Success',
    props<{ item: Item }>());
export const updateItemFailure = createAction(
    '[Item] Update Failure',
    props<{ error: string }>());


export const deleteItem = createAction(
    '[Item] Delete',
    props<{ id: number }>());
export const deleteItemSuccess = createAction(
    '[Item] Delete Success',
    props<{ id: number }>());
export const deleteItemFailure = createAction(
    '[Item] Delete Failure',
    props<{ error: string }>());