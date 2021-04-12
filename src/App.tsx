import React from 'react';
import { Router } from 'react-router-dom';

import history from './routes/history';
import Routes from './routes/';

import { AuthProvider } from './context/auth';
import { StoreProvider } from './context/storeContext';
import { DaysProvider } from './context/openedDaysContext';
import { OrdersProvider } from './context/ordersContext';
import { OrdersNotificationsProvider } from './context/ordersNotificationsContext';
import { CategoriesProvider } from './context/categoriesContext';

import './assets/styles/global.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <StoreProvider>
      <DaysProvider>
        <OrdersProvider>
          <OrdersNotificationsProvider>
            <AuthProvider>
              <CategoriesProvider>
                <Router history={history}>
                  <Routes />
                </Router>
              </CategoriesProvider>
            </AuthProvider>
          </OrdersNotificationsProvider>
        </OrdersProvider>
      </DaysProvider>
    </StoreProvider>
  );
}

export default App;