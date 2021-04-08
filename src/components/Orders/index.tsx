import React, { useState, useEffect, useContext } from 'react';
import { Form, Row, Modal, Col, ListGroup, Card, Badge, Button, Image } from 'react-bootstrap';
import { BsGeoAlt } from 'react-icons/bs';
import { format, add } from 'date-fns';
import br from 'date-fns/locale/pt-BR';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../services/api';
import { OrdersContext } from '../../context/ordersContext';

import { OrderStatus } from '../OrderStatus';
import OrderItems, { OrderItem } from '../OrderItems';

import noOrderImage from '../../assets/images/undraw_no_data_re_kwbl.svg';

import 'bootstrap/dist/css/bootstrap.min.css';

export interface Order {
    id: number;
    tracker: string;
    client_id: string;
    client: string;
    ordered_at: Date;
    delivery_in: Date;
    placed_at: Date;
    delivered_at: Date;
    sub_total: number;
    cupom: string;
    delivery_tax: number;
    delivery_type: string;
    delivery_estimated: number;
    discount: number;
    fee: number;
    total: number;
    payment: string;
    payment_type: string;
    paid: boolean;
    address: string;
    reason_cancellation: string;
    cancelled_at: Date;
    orderStatus: OrderStatus;
    orderItems: OrderItem[];
}

interface OrderProps {
    id: number | null;
}

const validatiionSchema = Yup.object().shape({
    reason_cancellation: Yup.string().required('Obrigatório!'),
});

const Orders: React.FC<OrderProps> = ({ id }) => {
    const { orderStatus, orders } = useContext(OrdersContext);

    const [order, setOrder] = useState<Order | null>(null);
    const [selectedStatus, setSelectedStatus] = useState(0);

    const [showModalCancellation, setShowModalCancellation] = useState(false);

    const handleClose = () => setShowModalCancellation(false);
    const handleShow = () => setShowModalCancellation(true);

    useEffect(() => {
        if (orders && id) {
            const orderFound = orders.find(order => {
                return order.id === id
            });

            if (orderFound)
                setOrder(orderFound);
        }
        else {
            setOrder(null);
        }
    }, [orders, id]);

    async function acceptOrder() {
        const statusToSave = orderStatus.find(item => { return item.order === (selectedStatus === 0 ? 1 : selectedStatus) });
        if (order && statusToSave) {
            if (statusToSave.order === 5) {
                handleShow();
                setSelectedStatus(0);

                return;
            }

            try {
                await api.put(`orders/${order.id}`,
                    {
                        client: order.client,
                        placed_at: statusToSave.order === 2 || statusToSave.order === 3 ? new Date() : order.placed_at,
                        delivered_at: statusToSave.order === 4 ? new Date() : order.delivered_at,
                        delivery_estimated: order.delivery_estimated,
                        payment_type: order.payment_type,
                        cancelled_at: order.cancelled_at,
                        orderStatus: statusToSave.id,
                    });
            }
            catch (err) {
                console.log(err);
            }

            setSelectedStatus(0);
        }
    }

    return (
        <>
            {
                order ? <Card className="text-center mb-5">
                    < Card.Header className="text-left" >
                        <Row>
                            <Col>
                                <h5 className="font-weight-bolder">{order.client}</h5>
                            </Col>
                            <Col md={4}>
                                <span>{`Código do pedido: ${order.tracker}`}</span>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <span>{`Pedido em: ${format(new Date(order.ordered_at), 'PPPpp', { locale: br })}`}</span>
                            </Col>
                        </Row>
                        {
                            order.placed_at !== order.ordered_at && <Row>
                                <Col>
                                    <span>{`Pronto às: ${format(new Date(order.placed_at), 'HH:mm:ss')}`}</span>
                                </Col>
                            </Row>
                        }
                        {
                            order.delivered_at !== order.ordered_at && <Row>
                                <Col>
                                    <span>{`Entregue às: ${format(new Date(order.delivered_at), 'HH:mm:ss')}`}</span>
                                </Col>
                            </Row>
                        }
                    </Card.Header >
                    <Card.Body>
                        <Card.Title>
                            <Card>
                                <Card.Body className="text-left">
                                    <Row>
                                        <Col lg={2}>
                                            <h6>
                                                <Badge variant={order.orderStatus.order === 4 ? "success" : "warning"}>
                                                    {order.orderStatus.order === 4 ? "Entregue em:" : "Entregar em:"}
                                                </Badge>
                                            </h6>
                                        </Col>
                                        <Col>
                                            <Row>
                                                <Col>
                                                    <h6>{order.address}</h6>
                                                </Col>
                                            </Row>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Card.Title>

                        <ListGroup className="text-left">
                            <ListGroup.Item variant={
                                order.orderStatus.order === 0 ? "warning" :
                                    order.orderStatus.order === 1 ? "info" :
                                        order.orderStatus.order === 2 ? "primary" :
                                            order.orderStatus.order === 3 ? "dark" :
                                                order.orderStatus.order === 4 ? "success" :
                                                    "danger"
                            }>{order.orderStatus.description}</ListGroup.Item>

                            {
                                order.orderStatus.order === 5 && <ListGroup.Item variant="danger">
                                    {`${order.reason_cancellation} ${format(new Date(order.cancelled_at), 'dd/MM/yyyy HH:mm:ss')}`}
                                </ListGroup.Item>
                            }

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

                        <Card className="mt-3 mb-3">
                            <Card.Body className="text-left">
                                <ListGroup className="text-left">
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
                            </Card.Body>
                        </Card>

                        <Row className="text-right">
                            {order.orderStatus.order === 0 ? <Col>
                                <Button variant="outline-danger" className="m-1" onClick={handleShow}>Recusar</Button>
                                <Button variant="danger" className="m-1" onClick={acceptOrder}>Aceitar</Button>
                            </Col> :
                                <>
                                    <Form.Label column sm={4}>Avançar o pedido:</Form.Label>
                                    <Col sm={4}>
                                        <Form.Control
                                            as="select"
                                            onChange={(e) => setSelectedStatus(Number(e.target.value))}
                                        >
                                            <option hidden>Escolha</option>
                                            {
                                                orderStatus && orderStatus.map(statusItem => {
                                                    return statusItem.order !== 0 && statusItem.order !== order.orderStatus.order && <option
                                                        key={statusItem.id}
                                                        value={statusItem.order}>{statusItem.title}
                                                    </option>
                                                })
                                            }

                                        </Form.Control>
                                    </Col>
                                    <Button
                                        variant={selectedStatus === 0 ? "secondary" : "danger"}
                                        disabled={selectedStatus === 0 ? true : false}
                                        onClick={acceptOrder}
                                    >
                                        Salvar
                                        </Button>
                                </>
                            }
                        </Row>

                    </Card.Body>
                    <Card.Footer
                        className="text-muted">
                        {
                            `Entrega prevista: ${format(add(new Date(order.ordered_at), { minutes: order.delivery_estimated }), 'HH:mm')} (${order.delivery_estimated} minutos).`
                        }
                    </Card.Footer>
                </Card > : <Card className="text-center mb-5">
                        <Card.Header className="text-left" >
                            <Row>
                                <Col>
                                    <h5 className="font-weight-bolder">Nenhum pedido selecionado</h5>
                                </Col>
                            </Row>
                        </Card.Header >
                        <Card.Body>
                            <Row className="justify-content-center">
                                <Col sm={6}>
                                    <Image fluid src={noOrderImage} alt="Nenhum pedido selecionado." />
                                </Col>
                            </Row>
                        </Card.Body>
                        <Card.Footer className="text-muted">
                            <Row>
                                <Col>
                                    <h6>Selecione um pedido para visualizar as suas informações.</h6>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
            }

            <Modal show={showModalCancellation} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-danger">Justifique o cancelamento.</Modal.Title>
                </Modal.Header>

                <Formik
                    initialValues={{
                        reason_cancellation: '',
                    }}
                    onSubmit={async values => {
                        const statusToSave = orderStatus.find(item => { return item.order === 5 });

                        console.log(statusToSave);

                        if (order && statusToSave) {
                            try {
                                await api.put(`orders/${order.id}`,
                                    {
                                        client: order.client,
                                        placed_at: order.placed_at,
                                        delivered_at: order.delivered_at,
                                        payment_type: order.payment_type,
                                        delivery_estimated: order.delivery_estimated,
                                        orderStatus: statusToSave.id,
                                        reason_cancellation: `${values.reason_cancellation} (Cancelado pelo estabelecimento).`,
                                        cancelled_at: new Date(),
                                    });

                                handleClose();
                            }
                            catch (err) {
                                console.log(err);
                            }
                        }
                    }}
                    validationSchema={validatiionSchema}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Dê ao seu cliente uma justificativa para o cancelamento do pedido.</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.reason_cancellation.toString()}
                                        name="reason_cancellation"
                                        isInvalid={!!errors.reason_cancellation}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.reason_cancellation}</Form.Control.Feedback>
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>Fechar</Button>
                                <Button variant="danger" type="submit">Cancelar o pedido</Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    )
}

export default Orders;