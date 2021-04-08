import { createContext } from 'react';

import { Category } from '../components/Categories';

interface DndContextData {
    listCategories: Category[] | null;
    moveOrder(from: number, to: number): void;
    saveOrder(): void;
}

const ContextDnd = createContext<DndContextData>({} as DndContextData);

export { ContextDnd };