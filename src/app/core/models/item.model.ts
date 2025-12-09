// Menu item
export interface Item {
    id: number;
    name: string;
    description: string;
    price: number;
    categoryIds: number[];
    createdAt: string;
}
