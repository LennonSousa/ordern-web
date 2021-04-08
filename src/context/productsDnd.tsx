import { createContext } from 'react';

interface ProductDndContextData {
    moveOrder(from: number, to: number): void;
}

const ContextProductDnd = createContext<ProductDndContextData>({} as ProductDndContextData);

export { ContextProductDnd };