import React, { useState } from 'react';
import { Form, Row, Col, ListGroup, Button, Spinner } from 'react-bootstrap';
import { BsFillTrashFill, BsPencil, BsExclamationOctagon, BsBackspace } from "react-icons/bs";
import { FaSave } from 'react-icons/fa';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../services/api';

export interface CardBrand {
    id: number;
    name: string;
    code: string;
}

interface CardsBrandsProps {
    cardBrand: CardBrand;
    handleBrands: any;
}

const userValidatiionSchema = Yup.object().shape({
    brand: Yup.string().required('Obrigatório!')
});

const CardsBrands: React.FC<CardsBrandsProps> = ({ cardBrand, handleBrands }) => {
    const [editingName, setEditingName] = useState(false);
    const [nameSaving, setNameSaving] = useState(false);

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

            await api.delete(`payments/${cardBrand.code}-brands/${cardBrand.id}`);

            handleBrands(cardBrand.code);

            setIconWaiting(false);
            setIconConfirm(false);
            setIconDelete(true);
        }
    }

    return (
        <ListGroup.Item action as="div" variant="light">
            <Row className={editingName ? "align-items-start" : "align-items-center"}>
                <Col sm={iconConfirm ? 6 : 8}>
                    {
                        editingName ? <Formik
                            initialValues={
                                {
                                    brand: cardBrand.name
                                }
                            }
                            onSubmit={async values => {
                                try {
                                    setNameSaving(true);

                                    await api.put(`payments/${cardBrand.code}-brands/${cardBrand.id}`, {
                                        name: values.brand,
                                        code: cardBrand.code
                                    });

                                    handleBrands(cardBrand.code);

                                    setNameSaving(false);

                                    setEditingName(false);
                                }
                                catch (err) {
                                    console.log('error post new brand');
                                    console.log(err);
                                }
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
                                            <Button type="submit" variant="danger" >
                                                {
                                                    nameSaving ? <Spinner
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
                            <h6>{cardBrand.name}</h6>
                    }
                </Col>

                <Col sm={2}>
                    {
                        editingName ? <Button variant="outline-danger" onClick={() => { setEditingName(false) }}>
                            <BsBackspace size={20} /></Button> :
                            <Button variant="danger" onClick={() => { setEditingName(true) }} ><BsPencil /></Button>
                    }
                </Col>

                {
                    iconConfirm && <Col sm={2}>
                        <Button variant="danger" onClick={() => { setIconConfirm(false); setIconDelete(true); }} ><BsBackspace /></Button>
                    </Col>
                }

                <Col sm={2}>
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

export default CardsBrands;