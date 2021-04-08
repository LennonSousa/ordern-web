import React, { useState, createContext } from 'react';

import { Day } from '../components/OpenedDays/Days';

interface DaysContextData {
    days: Day[];
    handleDays(store: Day[]): void;
}

const DaysContext = createContext<DaysContextData>({} as DaysContextData);

const DaysProvider: React.FC = ({ children }) => {
    const [days, setDays] = useState<Day[]>([]);

    function handleDays(days: Day[]) {
        setDays(days);
    }

    return (
        <DaysContext.Provider value={{ days, handleDays }}>
            {children}
        </DaysContext.Provider>
    );
}

export { DaysContext, DaysProvider };