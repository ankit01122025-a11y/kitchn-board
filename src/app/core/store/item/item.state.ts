import { Item } from '../../models/item.model';


export interface ItemState {
    items: Item[];
    loading: boolean;
    error: string | null;
}

export const initialItemState: ItemState = {
    items: [],
    loading: false,
    error: null
};