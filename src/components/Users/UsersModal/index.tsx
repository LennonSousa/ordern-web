import React, { useContext, useEffect, useState } from 'react';

import { Modal, Form, Row, Col, ListGroup, Button, Spinner } from 'react-bootstrap';
import { BsPencil, BsTrash } from "react-icons/bs";

import api from '../../../services/api';
import { Context } from '../../../context/auth';

export interface UserModal {
    newUser: boolean;
    itSelf: boolean;
    userType: number;
}

interface UsersModalProps {
    newUser: boolean;
    itSelf: boolean;
    userType: number;
}

const UsersModelItem: React.FC<UsersModalProps> = (UsersModalProps) => {
    const [showUser, setShowUser] = useState(true);

    const handleCloseUser = () => setShowUser(false);
    const handleShowUser = () => setShowUser(true);

    return (
        <Modal show={showUser} onHide={handleCloseUser}>
            <Modal.Header closeButton>
                <Modal.Title>{UsersModalProps.newUser ? 'Convidar integrante' : 'Editar integrante'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="teamFormGridName">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>

                    <Form.Group controlId="teamFormGridCPF">
                        <Form.Label>CPF</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>

                    <Form.Group controlId="teamFormGridBirth">
                        <Form.Label>Nascimento</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group controlId="teamFormGridPhone">
                        <Form.Label>Telfone</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>

                    <Form.Group controlId="teamFormGridemail">
                        <Form.Label>E-mail</Form.Label>
                        <Form.Control type="email" />
                    </Form.Group>

                    <Col className="border-top mt-3"></Col>

                    <ListGroup className="mt-3">
                        <ListGroup.Item action as="div" variant="light">
                            <Row>
                                <Col>
                                    <Form.Check
                                        type="radio"
                                        label="Administrador"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios1"
                                    />
                                </Col>
                                <Col>
                                    Acesso total a todas as seções e edições.
                                    </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item action as="div" variant="light">
                            <Row>
                                <Col>
                                    <Form.Check
                                        type="radio"
                                        label="Gerente"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios2"
                                    />
                                </Col>
                                <Col>
                                    Acesso a todas as seções, com restrições relacionadas a edição de dados da loja e financeiros.
                                    </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item action as="div" variant="light">
                            <Row>
                                <Col>
                                    <Form.Check
                                        type="radio"
                                        label="Operador"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios3"
                                    />
                                </Col>
                                <Col>
                                    Acesso restrito às seções de Pedidos e Cardápio (pode somente alterar visibilidade dos produtos).
                                    </Col>
                            </Row>
                        </ListGroup.Item>

                        <ListGroup.Item action as="div" variant="light">
                            <Row>
                                <Col>
                                    <Form.Check
                                        type="radio"
                                        label="Marketing"
                                        name="formHorizontalRadios"
                                        id="formHorizontalRadios4"
                                    />
                                </Col>
                                <Col>
                                    Acesso total à seção Cardápio e Design.
                                    </Col>
                            </Row>
                        </ListGroup.Item>
                    </ListGroup>

                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-danger" onClick={handleCloseUser}>
                    Cancelar
                </Button>
                <Button variant="danger" onClick={handleCloseUser}>
                    Convidar
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default UsersModelItem;