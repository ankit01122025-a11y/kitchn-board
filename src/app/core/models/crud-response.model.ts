export interface CrudResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}