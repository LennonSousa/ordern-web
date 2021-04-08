import React from 'react';
import { Router } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import history from './routes/history';
import Routes from './routes/';

import { AuthProvider } from './context/auth';
import { StoreProvider } from './context/storeContext';
import { DaysProvider } from './context/openedDaysContext';
import { OrdersProvider } from './context/ordersContext';
import { OrdersNotificationsProvider } from './context/ordersNotificationsContext';

import './assets/styles/global.css';

function App() {
  return (
    <StoreProvider>
      <DaysProvider>
        <OrdersProvider>
          <OrdersNotificationsProvider>
            <AuthProvider>
              <DndProvider backend={HTML5Backend}>
                <Router history={history}>
                  <Routes />
                </Router>
              </DndProvider>
            </AuthProvider>
          </OrdersNotificationsProvider>
        </OrdersProvider>
      </DaysProvider>
    </StoreProvider>
  );
}

export default App;