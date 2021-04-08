import React, { useState, useEffect } from 'react';
import { Form, Row, Col, ListGroup, Button, Spinner } from 'react-bootstrap';
import { BsFillTrashFill, BsPencil, BsExclamationOctagon, BsBackspace } from "react-icons/bs";
import { FaSave } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';

import InputMask from '../InputMask';

import api from '../../services/api';

export interface StoreDeliveryGroup {
    id: number;
    description: string;
    price: number;
    estimated: number;
}

interface StoreDeliveryGroupsProps {
    storeDeliveryGroup: StoreDeliveryGroup;
    handleStoreDelvieryGroups: any;
}

const userValidatiionSchema = Yup.object().shape({
    description: Yup.string().required('Obrigatório!'),
    price: Yup.number().required('Obrigatório!'),
    estimated: Yup.number().required('Obrigatório!'),
});

const StoreDeliveryGroups: React.FC<StoreDeliveryGroupsProps> = ({ storeDeliveryGroup, handleStoreDelvieryGroups }) => {
    const [storeDeliveryGroupEditing, setStoreDeliveryGroupEditing] = useState(false);
    const [storeDeliveryGroupSaving, setStoreDeliveryGroupSaving] = useState(false);
    const [price, setPrice] = useState(0.00);

    const [iconDelete, setIconDelete] = useState(true);
    const [iconConfirm, setIconConfirm] = useState(false);
    const [iconWaiting, setIconWaiting] = useState(false);

    async function handleDelete() {
        if (iconDelete) {
            setIconDelete(false);
            setIconConfirm(true);
        }
        else if (iconConfirm) {
            setIconConfirm(false);
            setIconWaiting(true);

            await api.delete(`store/delivery-groups/${storeDeliveryGroup.id}`);

            handleStoreDelvieryGroups();

            setIconWaiting(false);
            setIconConfirm(false);
            setIconDelete(true);
        }
    }

    useEffect(() => {
        setPrice(storeDeliveryGroup.price);
    }, [storeDeliveryGroup.price]);

    return (
        <ListGroup.Item action as="div" variant="light">
            <Row className={storeDeliveryGroupEditing ? "align-items-start" : "align-items-center"}>
                <Col sm={iconConfirm ? 6 : 8}>
                    {
                        storeDeliveryGroupEditing ? <Formik
                            initialValues={
                                {
                                    description: storeDeliveryGroup.description,
                                    price: price,
                                    estimated: storeDeliveryGroup.estimated
                                }
                            }
                            onSubmit={async values => {
                                try {
                                    setStoreDeliveryGroupSaving(true);

                                    await api.put(`store/delivery-groups/${storeDeliveryGroup.id}`, {
                                        description: values.description,
                                        price: values.price,
                                        estimated: values.estimated
                                    });

                                    handleStoreDelvieryGroups();

                                    setStoreDeliveryGroupSaving(false);

                                    setStoreDeliveryGroupEditing(false);
                                }
                                catch (err) {
                                    console.log('error post new store delivery group.');
                                    console.log(err);
                                }
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

                                    <Form.Row className="mt-2">
                                        <Col className="col-6">
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
                                        <Col className="col-3">
                                            <Form.Control type="number"
                                                placeholder="Tempo de entrega estimado"
                                                onChange={handleChange}
                                                value={values.estimated}
                                                name="estimated"
                                                isInvalid={!!errors.estimated}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.estimated}</Form.Control.Feedback>
                                            <Form.Text className="text-muted text-right">Minutos</Form.Text>
                                        </Col>

                                        <Col className="col-3 text-right">
                                            <Button type="submit" variant="danger" >
                                                {
                                                    storeDeliveryGroupSaving ? <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    /> : <FaSave />
                                                }
                                            </Button>
                                        </Col>
                                    </Form.Row>
                                </Form>
                            )}
                        </Formik> :
                            <h6>{storeDeliveryGroup.description}</h6>
                    }
                </Col>

                <Col className="col-3">
                    {
                        storeDeliveryGroupEditing ? <Button variant="outline-danger" onClick={() => { setStoreDeliveryGroupEditing(false) }}>
                            <BsBackspace size={20} /></Button> :
                            <Button variant="danger" onClick={() => { setStoreDeliveryGroupEditing(true) }} ><BsPencil /></Button>
                    }
                </Col>

                {
                    iconConfirm && <Col className="col-3">
                        <Button variant="danger" onClick={() => { setIconConfirm(false); setIconDelete(true); }} ><BsBackspace /></Button>
                    </Col>
                }

                <Col className="col-6">
                    <Button
                        variant={iconDelete ? "danger" : "warning"}
                        onClick={handleDelete}
                    >
                        {
                            iconDelete && <BsFillTrashFill />
                        }

                        {
                            iconConfirm && <BsExclamationOctagon />
                        }

                        {
                            iconWaiting && <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                        }
                    </Button>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}

export default StoreDeliveryGroups;