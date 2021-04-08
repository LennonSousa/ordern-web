import React, { useState, useEffect } from 'react';
import { Form, Row, Col, ListGroup, Button, Spinner, Modal } from 'react-bootstrap';
import { BsCheckCircle, BsXCircle, BsPencil, BsPlus } from "react-icons/bs";
import { Formik } from 'formik';
import * as Yup from 'yup';

import StoreDeliveryGroups, { StoreDeliveryGroup } from '../StoreDeliveryGroups';
import InputMask from '../InputMask';

import api from '../../services/api';


export interface StoreShipment {
    id: number;
    name: string;
    code: string;
    active: boolean;
}

interface StoreShipmentsProps {
    storeShipment: StoreShipment;
    withButton: boolean;
    setOutdated: any;
}

const userValidatiionSchema = Yup.object().shape({
    description: Yup.string().required('Obrigatório!'),
    price: Yup.number().required('Obrigatório!'),
    estimated: Yup.number().required('Obrigatório!'),
});

const StoreDeliveryGropus: React.FC<StoreShipmentsProps> = ({ storeShipment, withButton, setOutdated }) => {
    const [waitingStoreShipments, setWaitingStoreShipments] = useState(false);
    const [storeDeliveryGroupSaving, setStoreDeliveryGroupSaving] = useState(false);
    const [price, setPrice] = useState(0.00);

    const [storeShipmentsEditModal, setStoreShipmentsEditModal] = useState(false);
    const handleCloseStoreShipments = () => setStoreShipmentsEditModal(false);
    const handleShowStoreShipments = () => setStoreShipmentsEditModal(true);

    const [storeDeliveryGroups, setStoreDeliveryGroups] = useState<StoreDeliveryGroup[]>([]);

    async function handleEnabled() {
        setWaitingStoreShipments(true);

        await api.put(`store/shipments/${storeShipment.id}`,
            {
                name: storeShipment.name,
                code: storeShipment.code,
                active: !storeShipment.active
            }
        );

        setWaitingStoreShipments(false);

        setOutdated(true);
    }

    async function handleStoreDeliveryGroups() {
        try {
            const res = await api.get('store/delivery-groups');

            setStoreDeliveryGroups(res.data);
        }
        catch {

        }
    }

    useEffect(() => {
        setPrice(0.00);

        if (storeShipmentsEditModal) {
            handleStoreDeliveryGroups();
        }
    }, [storeShipmentsEditModal, storeShipment.code]);

    return (
        <>
            <ListGroup.Item variant={storeShipment.active ? "success" : "secondary"}>
                <Row className="align-items-center pt-2 pb-2">
                    <Col sm={1}>{storeShipment.active ? <BsCheckCircle size={20} /> : <BsXCircle size={20} />}</Col>
                    <Col sm={8}><h6>{storeShipment.name}</h6></Col>
                    <Col sm={2}>
                        <Form>
                            <Form.Group className="mb-0" controlId={`formEnabledSwitch${storeShipment.code}`}>
                                {
                                    waitingStoreShipments ? <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> :
                                        <Form.Check
                                            type="switch"
                                            id={`custom-switch-payment-${storeShipment.code}`}
                                            label={storeShipment.active ? "Habilitado" : "Desabilitado"}
                                            checked={storeShipment.active}
                                            onChange={handleEnabled}
                                        />
                                }
                            </Form.Group>
                        </Form>
                    </Col>
                    <Col>
                        {
                            withButton && <Button
                                disabled={storeShipment.active ? false : true}
                                variant={storeShipment.active ? "success" : "secondary"}
                                onClick={handleShowStoreShipments}
                            ><BsPencil />
                            </Button>
                        }
                    </Col>
                </Row>
            </ListGroup.Item>

            {
                storeShipment.code !== 'money' && <Modal show={storeShipmentsEditModal} onHide={handleCloseStoreShipments}>
                    <Modal.Header closeButton>
                        <Modal.Title>{storeShipment.name}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={
                                {
                                    description: '',
                                    price: price,
                                    estimated: ''
                                }
                            }
                            onSubmit={async values => {
                                setStoreDeliveryGroupSaving(true);

                                try {
                                    await api.post('store/delivery-groups', {
                                        description: values.description,
                                        price: values.price,
                                        estimated: values.estimated
                                    });

                                    values.description = "";
                                    values.price = 0.00;
                                    values.estimated = "";
                                    setPrice(0.00);

                                    await handleStoreDeliveryGroups();
                                }
                                catch (err) {
                                    console.log('error post store delivery group.');
                                    console.log(err);
                                }

                                setStoreDeliveryGroupSaving(false);
                            }}
                            validationSchema={userValidatiionSchema}
                        >
                            {({ handleChange, setFieldValue, handleSubmit, values, errors }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Row>
                                        <Col sm={12}>
                                            <Form.Control as="textarea" rows={3}
                                                placeholder="Lista de bairros"
                                                onChange={handleChange}
                                                value={values.description}
                                                name="description"
                                                isInvalid={!!errors.description}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                                        </Col>
                                    </Form.Row>

                                    <Form.Row className="pt-2">
                                        <Col sm={4} className="col-5">
                                            <InputMask
                                                mask="currency"
                                                prefix="R$"
                                                defaultValue={Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(price)}
                                                onBlur={(e: any) => {
                                                    setPrice(e.target.value);
                                                    setFieldValue('price', Number(e.target.value.replace('.', '').replace(',', '.')))
                                                }}
                                                name="price"
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.price}</Form.Control.Feedback>
                                        </Col>

                                        <Col sm={4} className="col-5">
                                            <Form.Control type="number"
                                                placeholder="Tempo"
                                                onChange={handleChange}
                                                value={values.estimated}
                                                name="estimated"
                                                isInvalid={!!errors.estimated}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.estimated}</Form.Control.Feedback>
                                            <Form.Text className="text-muted text-right">Em minutos</Form.Text>
                                        </Col>
                                        <Col sm={4} className="col-3 text-right">
                                            <Button type="submit" variant="outline-danger">{
                                                storeDeliveryGroupSaving ? <Spinner
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
                                storeDeliveryGroups.map((storeDeliveryGroup, index) => {
                                    return <StoreDeliveryGroups key={index} storeDeliveryGroup={storeDeliveryGroup} handleStoreDelvieryGroups={handleStoreDeliveryGroups} />
                                })
                            }
                        </ListGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-danger" onClick={handleCloseStoreShipments}>Fechar</Button>
                    </Modal.Footer>
                </Modal>
            }
        </>
    )
}

export default StoreDeliveryGropus;