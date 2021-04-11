import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Accordion, Form } from 'react-bootstrap';
import { Formik } from 'formik';

import { Context } from '../../context/auth';
import { OrdersContext } from '../../context/ordersContext';
import { ContextSelectedOrder } from '../../context/selectedOrderContext';
import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import OrderStatusItem from '../../components/OrderStatus';
import OrdersItem, { Order } from '../../components/Orders';


import './styles.css';

function Ordering() {
    const { user } = useContext(Context);
    const { orderStatus, filteredOrders, handleOrderStatus, startFilteredOrders, handlestartFilteredOrders } = useContext(OrdersContext);

    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    useEffect(() => {
        if (!orderStatus || orderStatus.length < 1) // Avoid unecessary api calls.
            api.get('order-status')
                .then(res => {
                    handleOrderStatus(res.data);
                })
                .catch(err => {
                    console.log('error get order status');
                    console.log(err.code);
                });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function handleSelectedOrder(idOrder: number | null) {
        setSelectedOrder(null);

        if (filteredOrders && idOrder) {
            try {
                const orderFound = filteredOrders.find(order => {
                    return order.id === idOrder
                });

                if (orderFound)
                    setSelectedOrder(orderFound);
            }
            catch (err) {
                console.log('error to find order to edit');
                console.log(err);
            }
        }
    }

    return (
        <ContextSelectedOrder.Provider value={{ selectedOrder, handleSelectedOrder }}>
            <div>
                <header className="bg-dark">
                    <PageHeader />
                </header>

                <Container>
                    <Row className="content">
                        <Col>
                            <Row>
                                <Col>
                                    <Formik
                                        initialValues={{
                                            start: startFilteredOrders
                                        }}
                                        onSubmit={async values => {
                                            user && handlestartFilteredOrders(values.start, user.id);

                                            handleSelectedOrder(null);
                                        }}
                                    >
                                        {({ handleSubmit, values, setFieldValue }) => (
                                            <Form onSubmit={handleSubmit}>
                                                <Form.Row>
                                                    <Col sm={3}>
                                                        <Form.Control
                                                            onChange={(e) => {
                                                                setFieldValue('start', e.currentTarget.value);
                                                                handleSubmit()
                                                            }}
                                                            defaultValue={values.start}
                                                            name="start"
                                                            as="select"
                                                        >
                                                            <option value={6}>Últimas 06 horas</option>
                                                            <option value={12}>Últimas 12 horas</option>
                                                            <option value={24}>Últimas 24 horas</option>
                                                        </Form.Control>
                                                    </Col>
                                                </Form.Row>
                                            </Form>
                                        )}
                                    </Formik>

                                </Col>
                            </Row>

                            <Row className="mt-4">
                                <Col>
                                    <Row>
                                        <Col lg={3}>
                                            <Accordion className="pl-1" defaultActiveKey="0" >
                                                {
                                                    orderStatus && filteredOrders && orderStatus.map(orderStatus => {
                                                        const orderItems = filteredOrders.filter(order => { return order.orderStatus.id === orderStatus.id });
                                                        return <OrderStatusItem key={orderStatus.id} orderStatus={orderStatus} orders={orderItems} />
                                                    })
                                                }
                                            </Accordion>
                                        </Col>

                                        <Col lg={9}>
                                            {
                                                <OrdersItem id={selectedOrder ? selectedOrder.id : null} />
                                            }
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </div>
        </ContextSelectedOrder.Provider>
    )
};

export default Ordering;