import { createContext } from 'react';

interface ProductCategoryDndContextData {
    moveCategoryOrder(from: number, to: number): void;
}

const ContextProductCategoryDnd = createContext<ProductCategoryDndContextData>({} as ProductCategoryDndContextData);

export { ContextProductCategoryDnd };