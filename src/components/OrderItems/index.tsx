import React from 'react';

import { Row, Col, ListGroup } from 'react-bootstrap';

import { OrderItemAdditional } from '../OrderItemAdditionals';



export interface OrderItem {
    id: number;
    amount: number;
    name: string;
    value: number;
    notes: string;
    orderItemAdditionals: OrderItemAdditional[];
}

interface OrderItemProps {
    orderItem: OrderItem;
}

const OrderItems: React.FC<OrderItemProps> = ({ orderItem }) => {
    const priceProduct = orderItem.value;

    let totalAdditionals = 0;

    orderItem.orderItemAdditionals && orderItem.orderItemAdditionals.forEach(additional => {
        totalAdditionals = Number(totalAdditionals) + (Number(additional.value) * Number(additional.amount));
    });

    const amountProduct = orderItem.amount;
    const subTotal = Number(priceProduct) + Number(totalAdditionals);

    const total = Number(subTotal) * Number(amountProduct);

    return (
        <ListGroup.Item>
            <Row>
                <Col className="font-weight-bolder">{`${Number(orderItem.amount).toFixed(0)}x ${orderItem.name}`}</Col>
                <Col sm={2} className="text-center">
                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(orderItem.value)}
                </Col>
            </Row>
            {
                orderItem.orderItemAdditionals && orderItem.orderItemAdditionals.map(item => {
                    return <Row className="mb-2 pl-3" key={item.id}>
                        <Col>
                            <Row>
                                <Col>
                                    {`${item.amount}x ${item.name}`}
                                </Col>
                                <Col sm={2} className="text-center">
                                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value)}
                                </Col>
                                <Col sm={2} className="text-center">
                                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.value * item.amount)}
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                })
            }
            <Row>
                <Col className="mt-1 font-weight-bolder text-right border-top">
                    {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(total)}
                </Col>
            </Row>
            <Row>
                <Col className="text-secondary">{orderItem.notes}</Col>
            </Row>
        </ListGroup.Item>
    )
}

export default OrderItems;