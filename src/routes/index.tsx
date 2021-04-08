import React, { useContext, useEffect } from 'react';
import { Switch, Route, Redirect, RouteProps } from 'react-router-dom';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import Cookies from 'js-cookie';

import { Context } from '../context/auth';
import { OrdersContext } from '../context/ordersContext';

import Landing from '../pages/Langing';
import Dashboard from '../pages/Dashboard';
import Menu from '../pages/Menu';
import Store from '../pages/Store';
import Ordering from '../pages/Ordering';
import Reports from '../pages/Reports';
import OrderDetails from '../pages/OrderDetails';

interface CustomRouteProps extends RouteProps {
    isPrivate?: boolean;
}

const CustomRoute: React.FC<CustomRouteProps> = ({ isPrivate = false, ...rest }) => {
    const { loading, signed, user } = useContext(Context);
    const { handlestartFilteredOrders } = useContext(OrdersContext);

    useEffect(() => {
        Cookies.get(`ordern_${user?.id}_orders_start`) && handlestartFilteredOrders(Number(Cookies.get(`ordern_${user?.id}_orders_start`)), user ? user.id : 6);
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return <Container>
            <Row style={{ height: '100%' }} className="justify-content-center align-items-center text-center">
                <Col>
                    <h1>Aguarde, carregando...</h1>
                    <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                    />
                </Col>
            </Row>
        </Container>
    }

    if (isPrivate && !signed) {
        return <Redirect to="/" />
    }
    else if (!isPrivate && signed) {
        return <Redirect to="/dashboard" />
    }

    return <Route {...rest} />;
}

function Routes() {
    return (
        <Switch>
            <CustomRoute exact path="/" component={Landing} />
            <CustomRoute path="/users/authenticate/new" component={Landing} />
            <CustomRoute isPrivate path="/dashboard" component={Dashboard} />
            <CustomRoute isPrivate path="/menu" component={Menu} />
            <CustomRoute isPrivate path="/store" component={Store} />
            <CustomRoute isPrivate path="/ordering" component={Ordering} />
            <CustomRoute isPrivate exact path="/reports" component={Reports} />
            <CustomRoute isPrivate path="/reports/order/details/:id" component={OrderDetails} />
        </Switch>

    );
}

export default Routes;