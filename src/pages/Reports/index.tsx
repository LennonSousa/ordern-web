import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Form, Table, Button, Spinner } from 'react-bootstrap';
import { format, addDays, startOfToday, endOfToday } from 'date-fns';
import br from 'date-fns/locale/pt-BR';
import { FaInfoCircle, FaStopwatch, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { Formik } from 'formik';

import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import BreadCrumb from '../../components/BreadCrumb';
import { Order } from '../../components/Orders';

function Reports() {
    const [orders, setOrders] = useState<Order[]>();

    useEffect(() => {
        api.get('orders', {
            params: {
                start: addDays(startOfToday(), -7),
                end: endOfToday()
            }
        }).then(res => {
            setOrders(res.data);
        }).catch(err => {
            console.log('Error get orders: ', err);
        });

    }, []);

    return (
        <>
            <header className="bg-dark mb-2">
                <PageHeader />
            </header>

            <Container>
                <Row>
                    <Col>
                        <BreadCrumb page="Relatórios" />
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
                    <Col className="content">
                        <h5>Vendas</h5>

                        <Row className="mb-3">
                            <Col>
                                <Formik
                                    initialValues={{
                                        type: '7-days',
                                        start: format(new Date(), 'yyyy-MM-dd'),
                                        end: format(new Date(), 'yyyy-MM-dd'),
                                        tracker: '',
                                        customer: '',
                                    }}
                                    onSubmit={async values => {
                                        try {
                                            values.type !== "customer" && setOrders(undefined);

                                            if (values.type === "7-days") {
                                                const res = await api.get('orders', {
                                                    params: {
                                                        start: addDays(startOfToday(), -7),
                                                        end: endOfToday()
                                                    }
                                                });

                                                setOrders(res.data);
                                            }
                                            else if (values.type === "custom-days") {
                                                const res = await api.get('orders', {
                                                    params: {
                                                        start: values.start,
                                                        end: values.end
                                                    }
                                                });

                                                setOrders(res.data);
                                            }
                                            else if (values.type === "tracker") {
                                                const res = await api.get(`customers/orders/tracker/${values.tracker}`);

                                                setOrders(res.data);
                                            }
                                            else if (values.type === "customer" && values.customer !== "") {
                                                const res = await api.get(`customers/orders/customer/${values.customer}`);

                                                setOrders(res.data);
                                            }
                                        }
                                        catch (err) {
                                            console.log('Error to get orders: ', err);
                                        }

                                    }}
                                >
                                    {({ handleChange, handleSubmit, values, setFieldValue }) => (
                                        <Form onSubmit={handleSubmit}>
                                            <Form.Row className="align-items-end">
                                                <Form.Group as={Col} sm={3} controlId="formGridRange">
                                                    <Form.Label>Período</Form.Label>
                                                    <Form.Control
                                                        onChange={(e) => {
                                                            if (e.currentTarget.value === '7-days') {
                                                                handleSubmit();
                                                            }

                                                            setFieldValue('type', e.currentTarget.value);
                                                        }}
                                                        defaultValue={values.type}
                                                        name="type"
                                                        as="select"
                                                    >
                                                        <option value={"7-days"}>Últimos 07 dias</option>
                                                        <option value={"custom-days"}>Período personalizado</option>
                                                        <option value={"tracker"}>Código</option>
                                                        <option value={"customer"}>Cliente</option>
                                                    </Form.Control>
                                                </Form.Group>

                                                {
                                                    values.type === "custom-days" && <>
                                                        <Form.Group as={Col} sm={2} controlId="formGridStartDate">
                                                            <Form.Label>De</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                placeholder="Data de início"
                                                                onChange={handleChange}
                                                                value={values.start}
                                                                name="start"
                                                            />
                                                        </Form.Group>

                                                        <Form.Group as={Col} sm={2} controlId="formGridEndtDate">
                                                            <Form.Label>Até</Form.Label>
                                                            <Form.Control
                                                                type="date"
                                                                placeholder="Data de término"
                                                                onChange={handleChange}
                                                                value={values.end}
                                                                name="end"
                                                            />
                                                        </Form.Group>

                                                        <Form.Group as={Col} sm={2} controlId="formGridButton">
                                                            <Button variant="outline-danger" type="submit">Consultar</Button>
                                                        </Form.Group>
                                                    </>
                                                }

                                                {
                                                    values.type === "tracker" && <>
                                                        <Form.Group as={Col} sm={4} controlId="formGridTracker">
                                                            <Form.Label>Código</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Código do pedido"
                                                                onChange={handleChange}
                                                                value={values.tracker}
                                                                name="tracker"
                                                            />
                                                        </Form.Group>

                                                        <Form.Group as={Col} sm={2} controlId="formGridButton">
                                                            <Button variant="outline-danger" type="submit">Consultar</Button>
                                                        </Form.Group>
                                                    </>
                                                }

                                                {
                                                    values.type === "customer" && <>
                                                        <Form.Group as={Col} sm={4} controlId="formGridCustomer">
                                                            <Form.Label>Cliente</Form.Label>
                                                            <Form.Control
                                                                type="text"
                                                                placeholder="Nome do cliente"
                                                                onChange={(e) => {
                                                                    setFieldValue('customer', e.currentTarget.value);

                                                                    handleSubmit();
                                                                }}
                                                                value={values.customer}
                                                                name="customer"
                                                            />
                                                        </Form.Group>
                                                    </>
                                                }
                                            </Form.Row>
                                        </Form>
                                    )}
                                </Formik>
                            </Col>
                        </Row>

                        {
                            orders ? <Table striped bordered={false} hover size="sm">
                                <caption>{`Registros encontrados: ${orders.length}`}</caption>
                                <thead>
                                    <tr>
                                        <th>Código</th>
                                        <th>Total</th>
                                        <th>Situação</th>
                                        <th>Cliente</th>
                                        <th>Data</th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {
                                        orders.map((order, index) => {
                                            return <tr key={index}>
                                                <td>{order.tracker}</td>
                                                <td>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}</td>
                                                <td>{
                                                    order.orderStatus.order === 0 ? <><FaInfoCircle color="#ffc107" /> {order.orderStatus.title}</> :
                                                        order.orderStatus.order === 1 ||
                                                            order.orderStatus.order === 2 ||
                                                            order.orderStatus.order === 3 ? <><FaStopwatch color="#17a2b8" /> {order.orderStatus.title}</> :
                                                            order.orderStatus.order === 4 ? <><FaCheckCircle color="#28a745" /> {order.orderStatus.title}</> :
                                                                <><FaTimesCircle color="#dc3545" /> {order.orderStatus.title}</>
                                                }</td>
                                                <td>{order.customer}</td>
                                                <td>{format(new Date(order.ordered_at), 'PPPp', { locale: br })}</td>
                                                <td><Link to={`/reports/order/details/${order.id}`}><FaInfoCircle /></Link></td>
                                            </tr>
                                        })
                                    }
                                </tbody>
                            </Table> : <><Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> <span>carregando relatório...</span>
                            </>
                        }
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Reports;