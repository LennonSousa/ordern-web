import { createContext } from 'react';

interface ProductAdditionalDndContextData {
    moveAdditionalOrder(idCategory: number, from: number, to: number): void;
}

const ContextProductAdditionalDnd = createContext<ProductAdditionalDndContextData>({} as ProductAdditionalDndContextData);

export { ContextProductAdditionalDnd };