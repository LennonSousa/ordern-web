import { createContext } from 'react';

import { Order } from '../components/Orders';

interface SelectedOrderContextData {
    selectedOrder: Order | null;
    handleSelectedOrder(idOrder: number): void;
}

const ContextSelectedOrder = createContext<SelectedOrderContextData>({} as SelectedOrderContextData);

export { ContextSelectedOrder };