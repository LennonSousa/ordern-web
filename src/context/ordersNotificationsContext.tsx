import React, { useState, createContext, useEffect, useContext } from 'react';
import { formatDistanceToNow } from 'date-fns';
import br from 'date-fns/locale/pt-BR';

import { OrdersContext } from './ordersContext';

interface OrdersNotificationsContextData {
    newOrdersShow: boolean;
    newOrdersTime: string;
    newOrdersAmount: number;
    handleHasShown(already: boolean): void;
}

const OrdersNotificationsContext = createContext<OrdersNotificationsContextData>({} as OrdersNotificationsContextData);

const OrdersNotificationsProvider: React.FC = ({ children }) => {
    const { filteredOrders } = useContext(OrdersContext);

    const [hasShown, setHasShown] = useState(false);
    const [newOrdersShow, setNewOrdersShow] = useState(false);
    const [newOrdersTime, setNewOrdersTime] = useState('');
    const [newOrdersAmount, setNewOrdersAmount] = useState(0);

    useEffect(() => {
        if (filteredOrders) {
            const newOrders = filteredOrders.filter(order => { return order.orderStatus.id === 1 });

            if (newOrders.length > 0) {
                setNewOrdersTime(formatDistanceToNow(new Date(newOrders[0].ordered_at), { addSuffix: true, locale: br }));

                if (!hasShown) {
                    setNewOrdersShow(true);
                }
            }
            else
                setNewOrdersShow(false);

            setNewOrdersAmount(newOrders.length);
        }

    }, [filteredOrders, hasShown]);

    function handleHasShown(already: boolean) {
        already && setNewOrdersShow(false);
        setHasShown(already);
    }

    return (
        <OrdersNotificationsContext.Provider value={{ newOrdersShow, newOrdersTime, newOrdersAmount, handleHasShown }}>
            {children}
        </OrdersNotificationsContext.Provider>
    );
}

export { OrdersNotificationsContext, OrdersNotificationsProvider };