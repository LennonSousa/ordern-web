import { createContext } from 'react';

interface ProductUpdateContextData {
    tabDetails: boolean;
    tabComplements: boolean;
    tabAvailables: boolean;
    tabSale: boolean;
}

const ContextProductUpdate = createContext<ProductUpdateContextData>({} as ProductUpdateContextData);

export { ContextProductUpdate };