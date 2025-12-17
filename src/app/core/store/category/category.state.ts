import { Category } from '../../models/category.model';

export interface CategoryState {
    categories: Category[];
    loading: boolean;
    error: string | null;
}

export const initialCategoryState: CategoryState = {
    categories: [],
    loading: false,
    error: null
};
