import { Order } from "../../core/models/order.model";

export function getOrderTotal(order: Order): number {
    if (!order || !order.items || order.items.length === 0) {
        return 0;
    }
    return order.items.reduce((sum, item) => sum + (item.total || 0), 0);
}