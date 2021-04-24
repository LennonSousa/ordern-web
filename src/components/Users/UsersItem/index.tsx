import React, { useContext, useEffect, useState } from 'react';
import { Modal, Row, Col, Form, ListGroup, Button, Spinner } from 'react-bootstrap';
import { BsPencil, BsTrash, BsPersonCheckFill, BsPerson, BsToggleOn, BsToggleOff } from "react-icons/bs";
import { Formik } from 'formik';
import * as Yup from 'yup';

import { Context } from '../../../context/auth';

import api from '../../../services/api';

import UserTypeItem, { UserType } from '../UsersTypes';

export interface User {
    id: number,
    name: string,
    cpf: string,
    birth: Date,
    phone: string,
    email: string,
    active: boolean,
    paused: boolean,
    type: UserType
}

interface UsersProps {
    userItem: User,
    usersTypes: UserType[],
    setOutdated: any
}

const userValidatiionSchema = Yup.object().shape({
    name: Yup.string().required('Obrigatório!'),
    cpf: Yup.string().notRequired(),
    birth: Yup.date().required('Obrigatório!'),
    phone: Yup.string().notRequired(),
    email: Yup.string().email('E-mail inválido').required('Obrigatório!'),
    type: Yup.number().required('Obrigatório!')
});

const UsersItem: React.FC<UsersProps> = ({ userItem, usersTypes, setOutdated }) => {
    const { user } = useContext(Context);

    const [userTypeSelected, setUserTypeSelected] = useState<Number>();
    const [isSaving, setIsSaving] = useState(false);
    const [isPausing, setIsPausing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const [showUser, setShowUser] = useState(false);

    const handleCloseUser = () => setShowUser(false);
    const handleShowUser = () => setShowUser(true);

    const [showUserDelete, setShowUserDelete] = useState(false);

    const handleCloseUsersDelete = () => setShowUserDelete(false);
    const handelShowUsersDelete = () => setShowUserDelete(true);

    useEffect(() => {
        setUserTypeSelected(userItem.type.id);
    }, [userItem.type.id])

    async function handleUserPause() {
        setIsPausing(true);
        try {
            await api.put(`users/${userItem.id}`, {
                name: userItem.name,
                cpf: userItem.cpf,
                birth: userItem.birth,
                phone: userItem.phone,
                email: userItem.email,
                active: userItem.active,
                paused: !userItem.paused,
                type: userItem.type.id
            });
        }
        catch (err) {
            console.log('error pause user');
            console.log(err);
        }

        setIsPausing(false);
        setOutdated(true);
    }

    async function handleUserDelete() {
        setIsDeleting(true);

        try {
            await api.delete(`users/${userItem.id}`);
        }
        catch (err) {
            console.log('error deleting user');
            console.log(err);
        }

        setIsDeleting(false);
        handleCloseUsersDelete();
        setOutdated(true);
    }

    function handleChecks(userTypeId: number) {
        setUserTypeSelected(userTypeId);
    }

    return (
        <>
            <tr className={userItem.active ? '' : 'text-secondary'}>
                <td>{userItem.active ? <BsPersonCheckFill className="text-success" /> : <BsPerson />} {` `}{userItem.name}</td>
                <td>{userItem.email}</td>
                <td>{userItem.type.type}</td>
                <td>
                    <Row className="text-center">
                        <Col>
                            {
                                userItem.id === user?.id ?
                                    <Button variant="outline-success" disabled={true} >
                                        {userItem.paused ? <BsToggleOff /> : <BsToggleOn />}
                                    </Button> :
                                    <Button variant={userItem.paused ? "outline-danger" : "outline-success"}
                                        onClick={handleUserPause} >
                                        {
                                            isPausing ? <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            /> : userItem.paused ? <BsToggleOff /> : <BsToggleOn />
                                        }
                                    </Button>
                            }
                        </Col>

                        <Col>
                            <Button variant="outline-danger" onClick={handleShowUser} ><BsPencil /></Button>
                        </Col>

                        {userItem.id !== user?.id ? <Col>
                            <Button variant="outline-danger" onClick={handelShowUsersDelete} ><BsTrash /></Button>
                        </Col> : <Col><Button variant="outline-danger" disabled={true} ><BsTrash /></Button></Col>
                        }
                    </Row>
                </td>
            </tr>

            <Modal show={showUser} onHide={handleCloseUser}>
                <Modal.Header closeButton>
                    <Modal.Title>Editar integrante</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={
                        {
                            name: userItem.name,
                            cpf: userItem.cpf ? userItem.cpf : '',
                            birth: userItem.birth.toString().split('T')[0],
                            phone: userItem.phone ? userItem.phone : '',
                            email: userItem.email,
                            type: userItem.type.id,
                        }
                    }
                    onSubmit={async values => {
                        setIsSaving(true);

                        try {
                            await api.put(`users/${userItem.id}`, {
                                name: values.name,
                                cpf: values.cpf,
                                birth: values.birth,
                                phone: values.phone,
                                email: values.email,
                                active: userItem.active,
                                paused: userItem.paused,
                                type: values.type
                            });
                        }
                        catch (err) {
                            console.log('error post new user');
                            console.log(err);
                        }

                        setOutdated(true);
                        handleCloseUser();
                        setIsSaving(false);
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
                                        value={values.name}
                                        name="name"
                                        isInvalid={!!errors.name}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="teamFormGridCPF">
                                    <Form.Label>CPF (opcional)</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onChange={handleChange}
                                        value={values.cpf}
                                        name="cpf"
                                        isInvalid={!!errors.cpf}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.cpf}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="teamFormGridBirth">
                                    <Form.Label>Nascimento</Form.Label>
                                    <Form.Control
                                        type="date"
                                        onChange={handleChange}
                                        value={values.birth}
                                        name="birth"
                                        isInvalid={!!errors.birth}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.birth}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="teamFormGridPhone">
                                    <Form.Label>Telefone</Form.Label>
                                    <Form.Control
                                        type="text"
                                        onChange={handleChange}
                                        value={values.phone}
                                        name="phone"
                                        isInvalid={!!errors.phone}
                                    />
                                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group controlId="teamFormGridemail">
                                    <Form.Label>E-mail</Form.Label>
                                    <Form.Control
                                        type="email"
                                        onChange={handleChange}
                                        value={values.email}
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
                                <Button variant="outline-danger" onClick={handleCloseUser}>Cancelar</Button>
                                <Button variant="danger" type="submit">
                                    {
                                        isSaving ? <Spinner
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

            <Modal show={showUserDelete} onHide={handleCloseUsersDelete}>
                <Modal.Header closeButton>
                    <Modal.Title>Excluir pessoa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Você tem certeza que deseja excluir o usuário <b>{userItem.name}</b>? Essa ação não poderá ser desfeita.
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleUserDelete}>
                        {
                            isDeleting ? <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> : "Excluir"
                        }
                    </Button>
                    <Button variant="outline-danger" onClick={handleCloseUsersDelete}>
                        Cancelar
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default UsersItem;