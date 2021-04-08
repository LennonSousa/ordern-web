import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Spinner, Badge, ListGroup, Table } from 'react-bootstrap';
import { format } from 'date-fns';
import br from 'date-fns/locale/pt-BR';
import { BsGeoAlt, BsArrowLeft } from 'react-icons/bs';
import { FaInfoCircle, FaCaretRight } from 'react-icons/fa';

import api from '../../services/api';
import PageHeader from '../../components/PageHeader';
import BreadCrumb from '../../components/BreadCrumb';
import { Order } from '../../components/Orders';
import OrderItems from '../../components/OrderItems';

interface OrderDetailsParams {
    id: string;
}

function OrderDetails() {
    const { id } = useParams() as OrderDetailsParams;

    const [order, setOrder] = useState<Order>();
    const [customerOrders, setCustomerOrders] = useState<Order[]>();

    useEffect(() => {
        if (id) {
            api.get(`orders/${id}`).then(res => {
                setOrder(res.data);

                const orderRes: Order = res.data;

                api.get(`/customer/orders/${orderRes.client_id}`).then(res => {
                    setCustomerOrders(res.data);
                }).catch(err => {
                    console.log('Error get customer orders: ', err);
                });
            }).catch(err => {
                console.log('Error get order: ', err);
            });
        }
    }, [id]);

    return (
        <>
            <header className="bg-dark mb-2">
                <PageHeader />
            </header>

            <Container>
                <Row>
                    <Col>
                        <BreadCrumb page="Relatórios / Venda" />
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row className="content">

                    {
                        order ? <Col>
                            <Row>
                                <Col>
                                    <Link to="/reports">
                                        <BsArrowLeft /> Voltar para os relatórios
                                    </Link>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Row>
                                        <Col>
                                            <h6 className="text-danger mt-3">Código</h6>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col md={4}>
                                            <span>{order.tracker}</span>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col>
                                    <Row>
                                        <Col>
                                            <h6 className="text-danger">Cliente</h6>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <h5 className="font-weight-bolder">{order.client}</h5>
                                        </Col>
                                    </Row>
                                </Col>

                                <Col>
                                    <Row>
                                        <Col>
                                            <h6 className="text-danger">Endereço</h6>
                                        </Col>
                                    </Row>

                                    <Row>
                                        <Col>
                                            <h6>{order.address}</h6>
                                        </Col>
                                    </Row>


                                </Col>

                            </Row>

                            <Row>
                                <Col>
                                    <h6 className="text-danger mt-3">Histórico</h6>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <h6>
                                        <Badge variant={
                                            order.orderStatus.order === 0 ? "warning" :
                                                order.orderStatus.order === 1 ? "info" :
                                                    order.orderStatus.order === 2 ? "primary" :
                                                        order.orderStatus.order === 3 ? "dark" :
                                                            order.orderStatus.order === 4 ? "success" :
                                                                "danger"}
                                        >
                                            {order.orderStatus.description}
                                        </Badge>
                                    </h6>
                                    {
                                        order.orderStatus.order === 5 && <span>
                                            {`${order.reason_cancellation} ${format(new Date(order.cancelled_at), 'dd/MM/yyyy HH:mm:ss')}`}
                                        </span>
                                    }
                                </Col>
                            </Row>

                            <Row>
                                <Col sm={2}>
                                    <span>Pedido em</span>
                                </Col>
                                <Col>
                                    {format(new Date(order.ordered_at), 'PPPpp', { locale: br })}
                                </Col>
                            </Row>

                            {
                                order.placed_at !== order.ordered_at && <Row>
                                    <Col sm={2}>
                                        <span>Pronto às</span>
                                    </Col>
                                    <Col>
                                        <span>{format(new Date(order.placed_at), 'HH:mm:ss')}</span>
                                    </Col>
                                </Row>
                            }
                            {
                                order.delivered_at !== order.ordered_at && <Row>
                                    <Col sm={2}>
                                        <span>Entregue às</span>
                                    </Col>
                                    <Col>
                                        <span>{format(new Date(order.delivered_at), 'HH:mm:ss')}</span>
                                    </Col>
                                </Row>
                            }

                            <Row>
                                <Col>
                                    <h6 className="text-danger mt-3">Itens</h6>
                                </Col>
                            </Row>

                            <ListGroup className="text-left">
                                {/* Order Items */}
                                {
                                    order.orderItems.map(orderItem => {
                                        return <OrderItems key={orderItem.id} orderItem={orderItem} />
                                    })
                                }
                            </ListGroup>

                            <ListGroup className="mt-3 text-left">
                                <ListGroup.Item>
                                    <Row>
                                        <Col className="font-weight-bolder">
                                            Subtotal
                                        </Col>
                                        <Col sm={2} className="text-center">
                                            {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.sub_total)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {
                                    order.delivery_type === "pickup" ? <ListGroup.Item>
                                        <Row>
                                            <Col className="font-weight-bolder text-success">
                                                <BsGeoAlt /> Retirar no local
                                            </Col>
                                        </Row>
                                    </ListGroup.Item> :
                                        <ListGroup.Item>
                                            <Row>
                                                <Col className="font-weight-bolder">
                                                    <BsGeoAlt /> Taxa de entrega
                                                </Col>
                                                <Col sm={2} className="text-center">
                                                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.delivery_tax)}
                                                </Col>
                                            </Row>
                                            <Row className="pl-4">
                                                <Col>
                                                    {order.delivery_type}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                }
                                <ListGroup.Item>
                                    <Row>
                                        <Col className="font-weight-bolder">
                                            Desconto
                                        </Col>
                                        <Col sm={2} className="text-center">
                                            {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.fee)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item variant="info">
                                    <Row>
                                        <Col className="font-weight-bolder">
                                            Total
                                        </Col>
                                        <Col sm={2} className="text-center font-weight-bolder">
                                            {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(order.total)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>

                            <ListGroup className="mt-3 text-left">
                                <ListGroup.Item variant={order.paid ? "success" : "warning"}>
                                    <Row>
                                        <Col className="font-weight-bolder">
                                            {order.paid ? "Pago on-line através do aplicativo" : "Pagar na entrega"}
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col>
                                            {order.payment}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            </ListGroup>

                            <Row>
                                <Col>
                                    <h6 className="text-danger mt-3">Vendas relacionadas</h6>
                                </Col>
                            </Row>

                            <Row>
                                <Col>
                                    <Table striped bordered={false} hover size="sm">
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
                                                customerOrders && customerOrders.map((orderItem, index) => {
                                                    return <tr key={index}>
                                                        <td>{orderItem.id === order.id && <FaCaretRight />}{orderItem.tracker}</td>
                                                        <td>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderItem.total)}</td>
                                                        <td>{orderItem.orderStatus.title}</td>
                                                        <td>{orderItem.client}</td>
                                                        <td>{format(new Date(orderItem.ordered_at), 'PPPp', { locale: br })}</td>
                                                        <td><Link to={`/reports/order/details/${orderItem.id}`}><FaInfoCircle /></Link></td>
                                                    </tr>
                                                })
                                            }
                                        </tbody>
                                    </Table>
                                </Col>
                            </Row>
                        </Col> : <Col>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> <span>carregando informações...</span>
                        </Col>
                    }

                </Row>
            </Container>
        </>
    );
}

export default OrderDetails;