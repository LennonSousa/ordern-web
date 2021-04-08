import React, { useState, useEffect } from 'react';
import { Form, Row, Col, ListGroup, Button, Spinner, Modal } from 'react-bootstrap';
import { BsCheckCircle, BsXCircle, BsPencil } from "react-icons/bs";
import { FaCcStripe } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../services/api';

export interface PaymentStripe {
    id: number;
    pk_live: string;
    sk_live: string;
    active: boolean;
}

const userValidatiionSchema = Yup.object().shape({
    pk: Yup.string().required('Obrigatório!'),
    sk: Yup.string().required('Obrigatório!')
});

const PaymentsDelivery: React.FC = () => {
    const [paymentStripe, setPaymentStripe] = useState<PaymentStripe>();

    const [outdated, setOutdated] = useState(true);

    const [waitingPaymentStripe, setWaitingPaymentStripe] = useState(false);
    const [stripeSaving, setStripeSaving] = useState(false);

    const [stripPaymentEditModal, setStripPaymentEditModal] = useState(false);
    const handleCloseStripePayment = () => setStripPaymentEditModal(false);
    const handleShowStripePayment = () => setStripPaymentEditModal(true);

    async function handleEnabled() {
        if (paymentStripe) {
            try {
                setWaitingPaymentStripe(true);

                await api.put(`payments/stripe/${paymentStripe.id}`,
                    {
                        pk_live: paymentStripe.pk_live,
                        sk_live: paymentStripe.sk_live,
                        active: !paymentStripe.active
                    }
                );
            }
            catch {
            }
        }
        setOutdated(true);

        setWaitingPaymentStripe(false);
    }

    useEffect(() => {
        if (outdated) {
            api.get("payments/stripe/secret")
                .then(res => {
                    setPaymentStripe(res.data);
                })
                .catch(err => {

                });

            setOutdated(false);
        }
    }, [outdated]);

    return (
        <>
            {
                paymentStripe && <ListGroup.Item variant={paymentStripe.active ? "success" : "secondary"}>
                    <Row className="align-items-center pt-2 pb-2">
                        <Col sm={1}>{paymentStripe.active ? <BsCheckCircle size={20} /> : <BsXCircle size={20} />}</Col>
                        <Col sm={8}><h6><FaCcStripe /> Stripe</h6></Col>
                        <Col sm={2}>
                            <Form>
                                <Form.Group className="mb-0" controlId="formEnabledSwitchStripe">
                                    {
                                        waitingPaymentStripe ? <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> :
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch-payment-stripe"
                                                label={paymentStripe.active ? "Habilitado" : "Desabilitado"}
                                                checked={paymentStripe.active}
                                                onChange={handleEnabled}
                                            />
                                    }
                                </Form.Group>
                            </Form>
                        </Col>
                        <Col>
                            <Button
                                disabled={paymentStripe.active ? false : true}
                                variant={paymentStripe.active ? "success" : "secondary"}
                                onClick={handleShowStripePayment}
                            ><BsPencil />
                            </Button>
                        </Col>
                    </Row>
                </ListGroup.Item>
            }

            <Modal show={stripPaymentEditModal} onHide={handleCloseStripePayment}>
                <Modal.Header closeButton>
                    <Modal.Title>Chaves do Stripe</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={
                        {
                            pk: paymentStripe?.pk_live,
                            sk: paymentStripe?.sk_live
                        }
                    }
                    onSubmit={async values => {
                        setStripeSaving(true);
                        try {
                            if (paymentStripe) {
                                await api.put(`payments/stripe/${paymentStripe.id}`, {
                                    pk_live: values.pk,
                                    sk_live: values.sk
                                });
                            }

                        }
                        catch (err) {
                            console.log('error post new user');
                            console.log(err);
                        }
                        setOutdated(true);

                        setStripeSaving(false);
                    }}
                    validationSchema={userValidatiionSchema}
                >
                    {({ handleChange, handleSubmit, values, errors }) => (
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body>
                                <Form.Group controlId="formGroupStripPk">
                                    <Form.Label>Chave publicável</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onChange={handleChange}
                                        value={values.pk}
                                        name="pk"
                                        isInvalid={!!errors.pk}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.pk}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="formGroupStripSk">
                                    <Form.Label>Chave secreta</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onChange={handleChange}
                                        value={values.sk}
                                        name="sk"
                                        isInvalid={!!errors.sk}
                                    />
                                </Form.Group>
                                <Form.Control.Feedback type="invalid">{errors.sk}</Form.Control.Feedback>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="outline-danger" onClick={handleCloseStripePayment}>Cancelar</Button>
                                <Button variant="danger" type="submit">
                                    {
                                        stripeSaving ? <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> : "Salvar"
                                    }
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </>
    )
}

export default PaymentsDelivery;