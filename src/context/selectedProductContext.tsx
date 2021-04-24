import { createContext } from 'react';

import { Product } from '../components/Products';
import { Additional } from '../components/Additionals';

interface SelectedProductContextData {
    selectedProduct: Product | null;
    listAdditionals: Additional[];
    handleUpdateSelectedProduct(product: Product): void;
    handleTabDetails(updated: boolean): void;
    handleTabComplements(updated: boolean): void;
    handleTabAvailables(updated: boolean): void;
    handleTabSale(updated: boolean): void;
    handleListUpdateProductCategories(id: string): void;
    handleListUpdateProductAdditionals(ids: string[]): void;
    handleListDeleteProductCategories(id: string): void;
    handleListDeleteProductAdditionals(id: string): void;
}

const ContextSelectedProduct = createContext<SelectedProductContextData>({} as SelectedProductContextData);

export { ContextSelectedProduct };