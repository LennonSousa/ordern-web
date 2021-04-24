import React, { useEffect, useState } from 'react';
import { Modal, Row, Col, Table, Form, ListGroup, Button, Spinner, Toast } from 'react-bootstrap';
import { BsPersonPlus } from "react-icons/bs";
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../services/api';

import UserItems from './UsersItem';
import UserTypeItem, { UserType } from './UsersTypes'

export interface User {
    id: number,
    name: string,
    cpf: string,
    birth: Date,
    phone: string,
    email: string,
    active: boolean,
    paused: boolean,
    created_at: Date,
    type: UserType
}

const userValidatiionSchema = Yup.object().shape({
    name: Yup.string().required('Obrigatório!'),
    cpf: Yup.string().notRequired(),
    birth: Yup.date().required('Obrigatório!'),
    phone: Yup.string().notRequired(),
    email: Yup.string().email('E-mail inválido').required('Obrigatório!'),
    type: Yup.number().required('Obrigatório!')
});

const UsersItem: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [usersTypes, setUsersTypes] = useState<UserType[]>([]);
    const [userTypeSelected, setUserTypeSelected] = useState<Number>();
    const [isSaving, setIsSaving] = useState(false);

    const [outdated, setOutdated] = useState(true);

    const [waitingUsers, setWaitingUsers] = useState(true);

    const [showNewUser, setShowNewUser] = useState(false);

    const handleCloseNewUser = () => setShowNewUser(false);
    const handleShowNewUser = () => setShowNewUser(true);

    const [showToastError, setShowToastError] = useState(false);
    const [errorMessageLogin, setErrorMessageLogin] = useState('');

    useEffect(() => {
        if (outdated) {
            setWaitingUsers(true);

            api.get('users')
                .then(res => {
                    setUsers(res.data);

                    api.get('users/types')
                        .then(res => {
                            setUsersTypes(res.data);
                        })
                        .catch(err => {
                            console.log('error get users types');
                            console.log(err);
                        });
                })
                .catch(err => {
                    console.log('error get users');
                    console.log(err);
                });

            setOutdated(false);
            setWaitingUsers(false);
        }
    }, [outdated]);

    function handleChecks(userTypeId: number) {
        setUserTypeSelected(userTypeId);
    }

    return (
        <>
            <Row>
                <Col>
                    <Button variant="outline-danger" onClick={handleShowNewUser} ><BsPersonPlus /> Adicionar usuário</Button>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    {
                        waitingUsers ? <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        /> :
                            <Table striped hover>
                                <thead>
                                    <tr>
                                        <th>Usuário</th>
                                        <th>E-mail</th>
                                        <th>Permissões</th>
                                        <th>Ações</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {
                                        users.map((userItem, index) => {
                                            return <UserItems key={index} userItem={userItem} usersTypes={usersTypes} setOutdated={setOutdated} />
                                        })
                                    }
                                </tbody>
                            </Table>
                    }
                </Col>
            </Row>

            <Modal show={showNewUser} onHide={handleCloseNewUser}>
                <Modal.Header closeButton>
                    <Modal.Title>Convidar integrante</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={
                        {
                            name: '',
                            birth: '',
                            email: '',
                            type: 0,
                        }
                    }
                    onSubmit={async values => {
                        setIsSaving(true);

                        try {
                            const res = await api.post('users', {
                                name: values.name,
                                birth: values.birth,
                                email: values.email,
                                type: values.type
                            });

                            if (res.status === 201) {
                                api.get('users')
                                    .then(res => {
                                        setUsers(res.data);

                                        handleCloseNewUser();
                                    })
                                    .catch(err => {
                                        console.log('error get users');
                                        console.log(err);
                                    });
                            }
                            else {
                                setShowToastError(true);
                                setErrorMessageLogin('E-mail já cadastrado.');
                            }
                        }
                        catch (err) {
                            console.log('error post new user');
                            console.log(err);

                            setShowToastError(true);
                            setErrorMessageLogin('Erro na conexão.');
                        }

                        setIsSaving(false);
                        setUserTypeSelected(0);
                    }}
                    validationSchema={userValidatiionSchema}
                >
                    {({ handleChange, handleSubmit, values, errors }) => (
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body>
                                <Form.Group controlId="teamFormGridName">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control type="text"
                                        onChange={handleChange}
                                        value={values.name.toString()}
                                        name="name"
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="teamFormGridBirth">
                                    <Form.Label>Nascimento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        onChange={handleChange}
                                        value={values.birth.toString()}
                                        name="birth"
                                        isInvalid={!!errors.birth}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.birth}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="teamFormGridemail">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control
                                        type="email"
                                        onChange={handleChange}
                                        value={values.email.toString()}
                                        name="email"
                                        isInvalid={!!errors.email}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                </Form.Group>

                                <Col className="border-top mt-3"></Col>

                                <ListGroup className="mt-3">
                                    {
                                        usersTypes && usersTypes.map((userType, index) => {
                                            return <UserTypeItem
                                                key={index}
                                                userType={userType}
                                                handleChecks={handleChecks}
                                                selected={userType.id === userTypeSelected && true}
                                                handleChange={handleChange}
                                            />
                                        })
                                    }
                                    <Form.Control.Feedback type="invalid">{errors.type}</Form.Control.Feedback>
                                </ListGroup>
                            </Modal.Body>
                            <Modal.Footer>
                                <div aria-live="polite"
                                    aria-atomic="true"
                                    style={{
                                        position: 'relative',
                                        height: '100%',
                                        width: '100%'
                                    }}>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: 0,
                                        right: 0,
                                    }}>
                                        <Toast onClose={() => setShowToastError(false)} show={showToastError} delay={6000} autohide >
                                            <Toast.Header className="bg-danger text-light">
                                                <strong className="mr-auto">Erro: </strong>
                                            </Toast.Header>
                                            <Toast.Body className="text-danger">{errorMessageLogin}</Toast.Body>
                                        </Toast>
                                    </div>
                                </div>
                                <Button variant="outline-danger" onClick={handleCloseNewUser}>Cancelar</Button>
                                <Button variant="danger" type="submit">
                                    {
                                        isSaving ? <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> : "Convidar"
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

export default UsersItem;