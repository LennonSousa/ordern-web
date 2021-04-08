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
    handleListUpdateProductCategories(id: number): void;
    handleListUpdateProductAdditionals(id: number): void;
    handleListDeleteProductCategories(id: number): void;
    handleListDeleteProductAdditionals(id: number): void;
}

const ContextSelectedProduct = createContext<SelectedProductContextData>({} as SelectedProductContextData);

export { ContextSelectedProduct };