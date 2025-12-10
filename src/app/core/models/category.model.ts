// Category of menu items
export interface Category {
    id: number;
    name: string;
    description: string;
    createdAt: string;
}

export interface CategoryResponse {
    success: boolean;
    message: string;
    data?: Category;
}