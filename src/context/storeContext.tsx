import React, { useState, createContext } from 'react';

import { Store } from '../components/Stores';

interface StoreContextData {
    store: Store | undefined;
    handleStore(store: Store): void;
}

const StoreContext = createContext<StoreContextData>({} as StoreContextData);

const StoreProvider: React.FC = ({ children }) => {
    const [store, setStore] = useState<Store>();

    function handleStore(store: Store) {
        setStore(store);
    }

    return (
        <StoreContext.Provider value={{ store, handleStore }}>
            {children}
        </StoreContext.Provider>
    );
}

export { StoreContext, StoreProvider };