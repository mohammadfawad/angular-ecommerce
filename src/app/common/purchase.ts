import { Address } from "./address";
import { Customer } from "./customer";
import { Order } from "./order";
import { OrderItem } from "./order-item";

export class Purchase {

    customer: Customer | null = null;
    shippingAddress: Address | null = null;
    billingAddress: Address | null = null;
    order: Order  | null = null;
    orderItems: OrderItem [] = [];
}
