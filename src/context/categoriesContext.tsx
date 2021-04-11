import React, { useState, createContext } from 'react';

import { Category } from '../components/Categories';

interface CategoriesContextData {
    listCategories: Category[];
    handleListCategories(categories: Category[]): void;
}

const CategoriesContext = createContext<CategoriesContextData>({} as CategoriesContextData);

const CategoriesProvider: React.FC = ({ children }) => {
    const [listCategories, setListCategories] = useState<Category[]>([]);

    function handleListCategories(categories: Category[]) {
        setListCategories(categories);
    }

    return (
        <CategoriesContext.Provider value={{ listCategories, handleListCategories }}>
            {children}
        </CategoriesContext.Provider>
    );
}

export { CategoriesContext, CategoriesProvider };