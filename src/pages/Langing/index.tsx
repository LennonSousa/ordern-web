import React, { useContext, useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { Image, Form, Row, Col, Button, Modal, Toast, Spinner } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../services/api';
import { Context } from '../../context/auth';
import { User } from '../../components/Users';

import logoImg from '../../assets/images/undraw_add_to_cart.svg';
import activatedUserImg from '../../assets/images/undraw_Astronaut_re_8c33.svg';


import './styles.css';

const userValidatiionSchema = Yup.object().shape({
    name: Yup.string().required('Obrigatório!'),
    cpf: Yup.string().notRequired(),
    birth: Yup.date().required('Obrigatório!'),
    phone: Yup.string().notRequired(),
    email: Yup.string().email('E-mail inválido').required('Obrigatório!'),
    password: Yup.string().required('Obrigatório!').min(8, 'Mínimo 8 caracteres.').max(26, 'Máximo 26 caracteres.')
});

const validatiionSchema = Yup.object().shape({
    email: Yup.string().email('E-mail inválido').required('Obrigatório!'),
    password: Yup.string().required('Obrigatório!').min(8, 'Mínimo 8 caracteres.')
});

function Landing() {
    const querys = new URLSearchParams(useLocation().search);

    const { handleLogin } = useContext(Context);

    const [isNewUser, setIsNewUser] = useState(false);
    const [newUser, setNewUser] = useState<User>();
    const [newUserToken, setNewUserToken] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [authenticating, setAuthenticating] = useState(false);
    const [showToastError, setShowToastError] = useState(false);
    const [errorMessageLogin, setErrorMessageLogin] = useState('');

    const [showUserActivated, setShowUserActivated] = useState(false);

    const handleCloseUserActivated = () => { setShowUserActivated(false); setIsNewUser(false); }
    const handelShowUserActivated = () => setShowUserActivated(true);

    useEffect(() => {
        if (querys.has("email") && querys.has("token")) {
            api.get('users/authenticate/new',
                {
                    params: {
                        email: querys.get("email"), token: querys.get("token")
                    }
                })
                .then(res => {
                    setNewUser(res.data.user);
                    setNewUserToken(res.data.token);
                })
                .catch(err => {
                    console.log('error get new user');
                    console.log(err);
                });

            setIsNewUser(true);
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="limiter">
            <div className="container-login100">
                <div className="wrap-login100">
                    {
                        isNewUser && newUser ? <Formik
                            initialValues={
                                {
                                    name: newUser.name,
                                    cpf: newUser.cpf ? newUser.cpf : '',
                                    birth: newUser.birth.toString().split('T')[0],
                                    phone: newUser.phone ? newUser.phone : '',
                                    email: newUser.email,
                                    password: ''
                                }
                            }
                            onSubmit={async values => {
                                setIsSaving(true);

                                try {
                                    await api.put(`users/new/${newUser.id}`, {
                                        name: values.name,
                                        cpf: values.cpf,
                                        birth: values.birth,
                                        phone: values.phone,
                                        email: values.email,
                                        password: values.password,
                                        active: true,
                                        paused: false,
                                        type: newUser.type.id
                                    }, {
                                        headers: { 'Authorization': `Bearer ${newUserToken}` }
                                    });
                                }
                                catch (err) {
                                    console.log('error put new user');
                                    console.log(err);
                                }

                                setIsSaving(false);
                                handelShowUserActivated();
                            }}
                            validationSchema={userValidatiionSchema}
                        >
                            {({ handleChange, handleSubmit, values, errors }) => (
                                <Form style={{ width: '100%' }} onSubmit={handleSubmit}>
                                    <Row className="justify-content-center">
                                        <Col sm={10}>
                                            <h2 className="text-danger login100-form-title">Bem-vindo(a), complete os seus dados para ativar o seu cadastro.</h2>
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col sm={10}>
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

                                            <Form.Group controlId="teamFormGridCPF">
                                                <Form.Label>Senha</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    onChange={handleChange}
                                                    value={values.password}
                                                    name="password"
                                                    isInvalid={!!errors.password}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="justify-content-center">
                                        <Col sm={10}>
                                            <Button variant="outline-danger" onClick={() => { setIsNewUser(false) }}>Cancelar</Button>
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
                                        </Col>
                                    </Row>

                                    <Modal show={showUserActivated} onHide={handleCloseUserActivated} >
                                        <Modal.Header>
                                            <Modal.Title className="text-danger">Parabéns</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Row>
                                                <Col className="mt-3" sm={6}>
                                                    <Image fluid src={activatedUserImg} alt="Usuário ativado." />
                                                </Col>
                                                <Col className="mt-3 text-secondary" sm={6}>
                                                    <p>O seu cadastro foi ativado com sucesso!</p>
                                                    <p>Agora entre no sistema com o seu e-mail e senha cadastrados.</p>
                                                </Col>
                                            </Row>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="danger" onClick={handleCloseUserActivated}>Ok</Button>
                                        </Modal.Footer>
                                    </Modal>
                                </Form>
                            )}
                        </Formik>
                            : <>
                                <div className="login100-pic js-tilt">
                                    <Image src={logoImg} alt="sing up image" />
                                </div>
                                <Formik
                                    initialValues={{
                                        email: '',
                                        password: '',
                                    }}
                                    onSubmit={async values => {
                                        setAuthenticating(true);

                                        const resLogin = await handleLogin(values.email, values.password);

                                        if (!resLogin) {
                                            setShowToastError(true);
                                            setErrorMessageLogin("E-mail ou senha incorretos!");
                                        }
                                        else if (resLogin === "error") {
                                            setShowToastError(true);
                                            setErrorMessageLogin("Erro na conexão.");
                                        }

                                        setAuthenticating(false);
                                    }}
                                    validationSchema={validatiionSchema}
                                >
                                    {({ handleChange, handleSubmit, values, errors }) => (
                                        <Form className="login100-form" onSubmit={handleSubmit}>
                                            <h2 className="text-danger login100-form-title">Bem-vindo(a)</h2>
                                            <Form.Group controlId="formBasicEmail">
                                                <Form.Label>Nome</Form.Label>
                                                <Form.Control type="text"
                                                    onChange={handleChange}
                                                    value={values.email.toString()}
                                                    name="email"
                                                    isInvalid={!!errors.email}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>

                                                <Form.Text className="text-muted">
                                                    Caso tenha esquecido, por favor contate o administrador do sistema.
                                            </Form.Text>
                                            </Form.Group>

                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label>Senha</Form.Label>
                                                <Form.Control type="password"
                                                    onChange={handleChange}
                                                    value={values.password.toString()}
                                                    name="password"
                                                    isInvalid={!!errors.password}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
                                            </Form.Group>

                                            <Button variant="danger" type="submit">{
                                                authenticating ? <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                /> : "Acessar"
                                            }</Button>

                                            <div aria-live="polite"
                                                aria-atomic="true"
                                                style={{
                                                    position: 'relative',
                                                    height: '100%',
                                                }}>
                                                <div style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    right: 0,
                                                }}>
                                                    <Toast onClose={() => setShowToastError(false)} show={showToastError} delay={6000} autohide>
                                                        <Toast.Header className="bg-danger text-light">
                                                            <strong className="mr-auto">Erro:</strong>
                                                            <small>Falha na autenticação.</small>
                                                        </Toast.Header>
                                                        <Toast.Body className="text-danger">{errorMessageLogin}</Toast.Body>
                                                    </Toast>
                                                </div>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
                            </>
                    }
                </div>
            </div>
        </div>
    )
};

export default Landing;