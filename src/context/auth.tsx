import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

import api from '../services/api';
import socketClient from '../services/socketClient';
import { StoreContext } from './storeContext';
import { OrdersContext } from './ordersContext';
import { Order } from '../components/Orders';
import { OrdersNotificationsContext } from '../context/ordersNotificationsContext';
import { User } from '../components/Users';

interface AuthContextData {
    user: User | null;
    signed: boolean;
    loading: boolean;
    handleLogin(email: string, password: string): Promise<boolean | "error">;
    handleLogout(): Promise<void>;
}

const Context = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider: React.FC = ({ children }) => {
    const { handleStore } = useContext(StoreContext);
    const { handleOrders } = useContext(OrdersContext);
    const { handleHasShown } = useContext(OrdersNotificationsContext);

    const [user, setUser] = useState<User | null>(null);
    const [signed, setSigned] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const storagedUser = Cookies.get('ordern:user');
            const storagedToken = Cookies.get('ordern:token');

            if (storagedUser && storagedToken) {
                api.defaults.headers['Authorization'] = `Bearer ${storagedToken}`;

                api.get('').then(res => {
                    handleOrdersWebSocket();

                    setUser(JSON.parse(storagedUser));
                    setSigned(true);

                    api.get('stores')
                        .then(res => {
                            handleStore(res.data);
                        })
                        .catch(err => {
                            console.log('error get restaurants');
                            console.log(err);
                        });

                    setLoading(false);
                }).catch(err => {
                    console.log('Error to authenticate: ', err);

                    handleLogout();
                });
            }
            else {
                handleLogout();
            }
        }
        catch {
            handleLogout();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function handleOrdersWebSocket() {
        socketClient.disconnected && socketClient.connect();

        socketClient.on("connect", () => {
            console.log(socketClient.id); // x8WIv7-mJelg7on_ALbx
        });

        socketClient.emit('orders:read');

        socketClient.on('orders:read', (orders: Order[]) => {
            handleOrders(orders);
            handleHasShown(false);
        });

        socketClient.on('orders:create', (orders: Order[]) => {
            handleOrders(orders);
            handleHasShown(false);
        });

        socketClient.on('orders:update', (orders: Order[]) => {
            handleOrders(orders);
        });
    }

    async function handleLogin(emailLogin: string, password: string) {
        try {
            const res = await api.post('users/authenticate', {
                email: emailLogin,
                password
            },
                {
                    validateStatus: function (status) {
                        return status < 500; // Resolve only if the status code is less than 500
                    }
                }
            );

            if (res.status === 201) {
                const { user, token } = res.data;
                handleOrdersWebSocket();

                setUser(user);

                api.defaults.headers['Authorization'] = `Bearer ${token}`;

                Cookies.set('ordern:user', JSON.stringify(user), { expires: 1 });
                Cookies.set('ordern:token', token, { expires: 1 });

                const resStore = await api.get('stores');

                handleStore(resStore.data);

                setSigned(true);
                //history.push('/dashboard');

                return true;
            }

            return false;
        }
        catch {
            return "error";
        }
    }

    async function handleLogout() {
        socketClient.active && socketClient.disconnect();
        setSigned(false);
        Cookies.remove('ordern:user');
        Cookies.remove('ordern:token');
        api.defaults.headers.Authorization = undefined;

        setLoading(false);
    }

    return (
        <Context.Provider value={{ user, signed, loading, handleLogin, handleLogout }}>
            {children}
        </Context.Provider>
    );
}

export { Context, AuthProvider };