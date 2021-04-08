import React, { useState, createContext, useEffect } from 'react';
import Cookies from 'js-cookie';
import { addHours, isWithinInterval, endOfToday } from 'date-fns';

import { OrderStatus } from '../components/OrderStatus';
import { Order } from '../components/Orders';

interface OrdersContextData {
    orderStatus: OrderStatus[];
    orders: Order[];
    startFilteredOrders: number;
    filteredOrders: Order[];
    handleOrderStatus(orderStatus: OrderStatus[]): void;
    handleOrders(orders: Order[]): void;
    handlestartFilteredOrders(start: number, userId: number): void;
}

const OrdersContext = createContext<OrdersContextData>({} as OrdersContextData);

const OrdersProvider: React.FC = ({ children }) => {
    const [orderStatus, setOrderStatus] = useState<OrderStatus[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [startFilteredOrders, setStartFilteredOrders] = useState(6);
    const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);

    useEffect(() => {
        if (orders) {
            setFilteredOrders(orders.filter(order => {
                return isWithinInterval(new Date(order.ordered_at), {
                    start: addHours(new Date(), -startFilteredOrders),
                    end: endOfToday()
                })
            }))
        }
    }, [orders, startFilteredOrders]);

    function handleOrderStatus(orderStatus: OrderStatus[]) {
        setOrderStatus(orderStatus);
    }

    function handleOrders(orders: Order[]) {
        setOrders(orders);
    }

    function handlestartFilteredOrders(start: number, userId: number) {
        Cookies.set(`ordern_${userId}_orders_start`, String(start), { expires: 365 });

        setStartFilteredOrders(start);
    }

    return (
        <OrdersContext.Provider value={{ orderStatus, orders, startFilteredOrders, filteredOrders, handleOrderStatus, handleOrders, handlestartFilteredOrders }}>
            {children}
        </OrdersContext.Provider>
    );
}

export { OrdersContext, OrdersProvider };