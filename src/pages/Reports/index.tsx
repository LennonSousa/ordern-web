import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Table, Spinner } from 'react-bootstrap';
import { format, addDays, startOfToday, endOfToday } from 'date-fns';
import br from 'date-fns/locale/pt-BR';
import { FaInfoCircle } from 'react-icons/fa';

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
                <Row className="content">
                    <Col>
                        <h5>Vendas</h5>
                        {
                            orders ? <Table striped bordered={false} hover size="sm">
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
                                                <td>{order.orderStatus.title}</td>
                                                <td>{order.client}</td>
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