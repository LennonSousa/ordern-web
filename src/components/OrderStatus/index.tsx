import React, { useContext } from 'react';

import { formatDistanceToNow } from 'date-fns';
import br from 'date-fns/locale/pt-BR';
import { Row, Col, Accordion, Card, Badge, ListGroup } from 'react-bootstrap';
import { FcClock, FcServices, FcShipped, FcExternal, FcOk, FcCancel } from 'react-icons/fc';
import { BsClock } from 'react-icons/bs';

import { Order } from '../Orders';
import { ContextSelectedOrder } from '../../context/selectedOrderContext';

import 'bootstrap/dist/css/bootstrap.min.css';

export interface OrderStatus {
    id: number;
    title: string;
    description: string;
    order: number;
}

interface OrderStatusProps {
    orderStatus: OrderStatus;
    orders: Order[];
}

const OrderStatusItem: React.FC<OrderStatusProps> = ({ orderStatus, orders }) => {
    const { handleSelectedOrder } = useContext(ContextSelectedOrder);

    return (
        <Card>
            <Accordion.Toggle as={Card.Header} eventKey={String(orderStatus.order)}>
                <Row>
                    <Col md={1}>
                        {
                            orderStatus.order === 0 ? <FcClock /> :
                                orderStatus.order === 1 ? <FcServices /> :
                                    orderStatus.order === 2 ? <FcShipped /> :
                                        orderStatus.order === 3 ? <FcExternal /> :
                                            orderStatus.order === 4 ? <FcOk /> :
                                                <FcCancel />
                        }
                    </Col>
                    <Col md={8} style={{ cursor: 'pointer' }}>
                        {orderStatus.title}
                    </Col>
                    <Col md={2}>
                        <Badge variant={
                            orderStatus.order === 0 ? "warning" :
                                orderStatus.order === 1 ? "info" :
                                    orderStatus.order === 2 ? "primary" :
                                        orderStatus.order === 3 ? "dark" :
                                            orderStatus.order === 4 ? "success" :
                                                "danger"
                        }>{orders.length}</Badge>
                    </Col>
                </Row>
            </Accordion.Toggle>
            <Accordion.Collapse eventKey={String(orderStatus.order)}>
                <Card.Body className="menu-orders-card">
                    <ListGroup >
                        {
                            orders.length > 0 ? (
                                orders.map(order => {
                                    return <ListGroup.Item key={order.id} action onClick={() => { handleSelectedOrder(order.id) }}>
                                        <Row>
                                            <Col className="font-weight-bolder text-truncate">
                                                {order.client}
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col>
                                                {`#${order.tracker}`}
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col>
                                                <BsClock />{` ${formatDistanceToNow(new Date(order.ordered_at), { addSuffix: true, locale: br })}`}
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                })
                            ) : (
                                    <ListGroup.Item className="text-secondary">
                                        <Row>
                                            <Col>
                                                Nenhum pedido
                                            </Col>
                                        </Row>

                                        <Row>
                                            <Col>
                                                nesta categoria.
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )

                        }
                    </ListGroup>
                </Card.Body>
            </Accordion.Collapse>
        </Card>
    )
}

export default OrderStatusItem;