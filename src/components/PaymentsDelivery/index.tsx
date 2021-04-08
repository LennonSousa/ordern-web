import React, { useState, useEffect } from 'react';
import { Form, Row, Col, ListGroup, Button, Spinner, Modal } from 'react-bootstrap';
import { BsCheckCircle, BsXCircle, BsPencil, BsPlus } from "react-icons/bs";
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../services/api';

import CardsBrands, { CardBrand } from '../CardsBrands';

export interface PaymentDelivery {
    id: number;
    name: string;
    code: string;
    active: boolean;
}

interface PaymentsDeliveryProps {
    paymentDelivery: PaymentDelivery;
    withButton: boolean;
    setOutdated: any;
}

const userValidatiionSchema = Yup.object().shape({
    brand: Yup.string().required('Obrigatório!')
});

const PaymentsDelivery: React.FC<PaymentsDeliveryProps> = ({ paymentDelivery, withButton, setOutdated }) => {
    const [waitingPaymentsDelivery, setWaitingPaymentsDelivery] = useState(false);
    const [brandSaving, setSaving] = useState(false);

    const [paymentsEditModal, setPaymentsEditModal] = useState(false);
    const handleClosePayments = () => setPaymentsEditModal(false);
    const handleShowPayments = () => setPaymentsEditModal(true);

    const [cardBrands, setCardBrands] = useState<CardBrand[]>([]);

    async function handleEnabled() {
        setWaitingPaymentsDelivery(true);

        await api.put(`payments/delivery/${paymentDelivery.id}`,
            {
                name: paymentDelivery.name,
                code: paymentDelivery.code,
                active: !paymentDelivery.active
            }
        );

        setWaitingPaymentsDelivery(false);

        setOutdated(true);
    }

    async function handleBrands(type: "debit" | "credit") {
        try {
            const res = await api.get(`payments/${type}-brands`);

            setCardBrands(res.data);
        }
        catch {

        }
    }

    useEffect(() => {
        if (paymentsEditModal) {
            handleBrands(paymentDelivery.code === "debit" ? "debit" : "credit");
        }
    }, [paymentsEditModal, paymentDelivery.code]);

    return (
        <>
            <ListGroup.Item variant={paymentDelivery.active ? "success" : "secondary"}>
                <Row className="align-items-center pt-2 pb-2">
                    <Col sm={1}>{paymentDelivery.active ? <BsCheckCircle size={20} /> : <BsXCircle size={20} />}</Col>
                    <Col sm={8}><h6>{paymentDelivery.name}</h6></Col>
                    <Col sm={2}>
                        <Form>
                            <Form.Group className="mb-0" controlId={`formEnabledSwitch${paymentDelivery.code}`}>
                                {
                                    waitingPaymentsDelivery ? <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> :
                                        <Form.Check
                                            type="switch"
                                            id={`custom-switch-payment-${paymentDelivery.code}`}
                                            label={paymentDelivery.active ? "Habilitado" : "Desabilitado"}
                                            checked={paymentDelivery.active}
                                            onChange={handleEnabled}
                                        />
                                }
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col>
                        {
                            withButton && <Button
                                disabled={paymentDelivery.active ? false : true}
                                variant={paymentDelivery.active ? "success" : "secondary"}
                                onClick={handleShowPayments}
                            ><BsPencil />
                            </Button>
                        }
                    </Col>
                </Row>
            </ListGroup.Item>

            {
                paymentDelivery.code !== 'money' && <Modal show={paymentsEditModal} onHide={handleClosePayments}>
                    <Modal.Header closeButton>
                        <Modal.Title>{`Bandeiras de cartão de ${paymentDelivery.name}`}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={
                                {
                                    brand: ''
                                }
                            }
                            onSubmit={async values => {
                                setSaving(true);
                                
                                try {
                                    await api.post(`payments/${paymentDelivery.code}-brands`, {
                                        name: values.brand,
                                        code: paymentDelivery.code
                                    });

                                    values.brand = "";

                                    await handleBrands(paymentDelivery.code === "debit" ? "debit" : "credit");
                                }
                                catch (err) {
                                    console.log('error post new brand');
                                    console.log(err);
                                }

                                setSaving(false);
                            }}
                            validationSchema={userValidatiionSchema}
                        >
                            {({ handleChange, handleSubmit, values, errors }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Row>
                                        <Col sm={10}>
                                            <Form.Control type="text"
                                                placeholder="Digite o nome da bandeira"
                                                onChange={handleChange}
                                                value={values.brand}
                                                name="brand"
                                                isInvalid={!!errors.brand}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.brand}</Form.Control.Feedback>
                                            <Form.Text className="text-muted text-right">1/25 caracteres.</Form.Text>
                                        </Col>

                                        <Col sm={2}>
                                            <Button type="submit" variant="outline-danger">{
                                                brandSaving ? <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                /> :
                                                    <BsPlus size={20} />
                                            }</Button>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            )}
                        </Formik>

                        <Col className="border-top mt-3"></Col>

                        <ListGroup className="mt-3">
                            {
                                cardBrands.map((cardBrand, index) => {
                                    return <CardsBrands key={index} cardBrand={cardBrand} handleBrands={handleBrands} />
                                })
                            }
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-danger" onClick={handleClosePayments}>Fechar</Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    )
}

export default PaymentsDelivery;