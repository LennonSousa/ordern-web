import React, { useState, useEffect, useContext } from 'react';

import api from '../../../services/api';
import { Context } from '../../../context/auth';
import rbac from '../../../services/roleBasedAccessControl';

import { Row, Col, Button, Modal, Form, ListGroup, Spinner, Alert } from 'react-bootstrap';

import { StoreContext } from '../../../context/storeContext';
import AdditionalItem, { Additional } from '../../../components/Additionals';;

const Additionals: React.FC = () => {
    const { store } = useContext(StoreContext);
    const { user } = useContext(Context);

    /* Additionals */
    const [listAdditionals, setListAdditionals] = useState<Additional[]>([]);
    const [titleAdditional, setTitleAdditional] = useState('');
    const [codeAdditional, setCodeAdditional] = useState('');

    const [buttonCreateAdditional, setButtonCreateAdditional] = useState('inline-block');
    const [buttonUpdateAdditional, setButtonUpdateAdditional] = useState('none');
    const [buttonDeleteAdditional, setButtonDeleteAdditional] = useState('none');
    const [buttonDeleteYesAdditional, setButtonDeleteYesAdditional] = useState('none');
    const [titleModalAdditional, setTitleModalAdditional] = useState('Criar uma categoria');
    const [selectedAdditionalId, setSelectedAdditionalId] = useState('0');
    const [spinnerSaveAdditional, setSpinnerSaveAdditional] = useState('none');
    const [spinnerDeleteAdditional, setSpinnerDeleteAdditional] = useState('none');
    const [successSaveAdditional, setSuccessSaveAdditional] = useState(false);
    const [errorSaveAdditional, setErrorSaveAdditional] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        api.get('additionals')
            .then(res => {
                setListAdditionals(res.data);
            })
            .catch(err => {
                console.log('error get additionals');
                console.log(err);
            });
    }, []);

    function handleModalAdditional(criar: boolean, additionalId: string) {
        if (criar) {
            setTitleModalAdditional('Criar um adicional');
            setTitleAdditional('');
            setButtonCreateAdditional('inline-block');
            setButtonDeleteAdditional('none');
            setButtonDeleteYesAdditional('none');
            setButtonUpdateAdditional('none');
        }
        else {
            listAdditionals.map(additional => {
                if (additional.id === additionalId) {
                    setSelectedAdditionalId(additional.id);
                    setTitleAdditional(additional.title);
                    setCodeAdditional(additional.code);
                    return additional;
                }
                return additional;
            });
            setTitleModalAdditional('Editar adicional');
            setButtonCreateAdditional('none');
            setButtonDeleteYesAdditional('none');
            setButtonDeleteAdditional('inline-block');
            setButtonUpdateAdditional('inline-block');
        }

        handleShow();
    }

    function handlePauseAdditional(additionalId: string) {
        try {
            let additionalToUpdate = listAdditionals.map(additional => {
                if (additional.id === additionalId) {
                    api.put(`additionals/${additionalId}`, {
                        title: additional.title,
                        code: additional.code,
                        paused: !additional.paused
                    });

                    additional = {
                        ...additional,
                        title: additional.title,
                        code: additional.code,
                        paused: !additional.paused
                    };

                    return additional;
                }

                return additional;
            });

            setListAdditionals(additionalToUpdate);
        }
        catch (err) {
            console.log('error post a additional paused');
            console.log(err);
        }
    }

    function handleButtonsDeleteCategory() {
        setButtonDeleteAdditional('none');
        setButtonDeleteYesAdditional('inline-block');
    }

    async function handleDeleteAdditional() {
        setSpinnerDeleteAdditional('inline-block');

        try {
            await api.delete(`additionals/${selectedAdditionalId}`);

            const res = await api.get('additionals');

            setListAdditionals(res.data);

            setSpinnerDeleteAdditional('none');

            handleClose();

            setSuccessSaveAdditional(true);

            setTimeout(() => {
                setSuccessSaveAdditional(false);
            }, 5000);
        }
        catch (err) {
            setSpinnerSaveAdditional('none');
            handleClose();

            setErrorSaveAdditional(true);

            setTimeout(() => {
                setErrorSaveAdditional(false);
            }, 5000);

            console.log('error put the category');
            console.log(err);
        }
    }


    async function handleCreateAdditional() {
        setSpinnerSaveAdditional('inline-block');

        try {
            const response = await api.post('additionals', {
                title: titleAdditional,
                code: codeAdditional,
                paused: false,
                store: store?.id
            });

            const { id, title, code, paused } = response.data;

            setListAdditionals([
                ...listAdditionals,
                { id, title, code, paused, productAdditionals: [] }
            ]);

            setSpinnerSaveAdditional('none');
            handleClose();

            setSuccessSaveAdditional(true);

            setTimeout(() => {
                setSuccessSaveAdditional(false);
            }, 5000);
        }
        catch (err) {
            setSpinnerSaveAdditional('none');
            handleClose();

            setErrorSaveAdditional(true);

            setTimeout(() => {
                setErrorSaveAdditional(false);
            }, 5000);

            console.log('error post a new additionals');
            console.log(err);
        }
    }

    function handleUpdateAdditional() {
        setSpinnerSaveAdditional('inline-block');

        try {
            let additionalToUpadate = listAdditionals.map(additional => {
                if (additional.id === selectedAdditionalId) {
                    api.put(`additionals/${selectedAdditionalId}`, {
                        title: titleAdditional === '' ? additional.title : titleAdditional,
                        code: codeAdditional === '' ? additional.code : codeAdditional,
                        paused: additional.paused
                    });

                    additional = {
                        ...additional,
                        title: titleAdditional === '' ? additional.title : titleAdditional,
                        code: codeAdditional === '' ? additional.code : codeAdditional,
                        paused: additional.paused
                    };

                    return additional;
                }

                return additional;
            });

            setListAdditionals(additionalToUpadate);

            setSpinnerSaveAdditional('none');
            handleClose();

            setSuccessSaveAdditional(true);

            setTimeout(() => {
                setSuccessSaveAdditional(false);
            }, 5000);
        }
        catch (err) {
            setSpinnerSaveAdditional('none');
            handleClose();

            setErrorSaveAdditional(true);

            setTimeout(() => {
                setErrorSaveAdditional(false);
            }, 5000);

            console.log('error put the additional');
            console.log(err);
        }
    }

    return (
        <div className="mb-5">
            <section className="mt-3">
                <Row>
                    <Col>
                        <Alert variant="success"
                            dismissible
                            show={successSaveAdditional}>
                            Sucesso! As informações foram salvas.
                            </Alert>

                        <Alert variant="danger"
                            dismissible
                            show={errorSaveAdditional}>
                            Algo deu errado! As informações não foram salvas.
                            </Alert>
                    </Col>
                </Row>
            </section>

            {
                user && rbac.can(String(user.type.code)).createAny('additionals').granted && <section className="mt-3">
                    <Row>
                        <Col>
                            <Button variant="danger" onClick={() => { handleModalAdditional(true, '0') }} >Criar adicional</Button>
                        </Col>
                    </Row>
                </section>
            }

            <article className="mt-3">
                <Row>
                    <Col>
                        <ListGroup>
                            {
                                listAdditionals && listAdditionals.map((additional: Additional, index) => {
                                    return <div
                                        key={index}>
                                        <AdditionalItem
                                            key={additional.id}
                                            additional={additional}
                                            handleModalAdditional={handleModalAdditional}
                                            handlePauseAdditional={handlePauseAdditional}
                                        />
                                    </div>
                                })
                            }
                        </ListGroup>
                    </Col>
                </Row>
            </article>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{titleModalAdditional}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <Form.Group controlId="categoryFormGridName">
                            <Form.Label>Nome do adicional</Form.Label>
                            <Form.Control type="text"
                                defaultValue={titleAdditional}
                                placeholder="Ex: Pizzas"
                                onBlur={(e: any) => { setTitleAdditional(e.target.value) }}
                            />
                            <Form.Text className="text-muted text-right">1/25 caracteres.</Form.Text>
                        </Form.Group>
                        <Form.Group controlId="categoryFormGridCode">
                            <Form.Label>Código PDV (opcional)</Form.Label>
                            <Form.Control type="text"
                                defaultValue={codeAdditional}
                                onBlur={(e: any) => { setCodeAdditional(e.target.value) }}
                            />
                        </Form.Group>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="outline-danger" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="danger"
                        style={{ display: buttonCreateAdditional }}
                        onClick={handleCreateAdditional}>
                        Criar{' '}
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ display: spinnerSaveAdditional }}
                        />
                    </Button>

                    <Button variant="danger"
                        style={{ display: buttonDeleteAdditional }}
                        onClick={handleButtonsDeleteCategory}>
                        Excluir{' '}
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ display: spinnerDeleteAdditional }}
                        />
                    </Button>

                    <Button variant="warning"
                        style={{ display: buttonDeleteYesAdditional }}
                        onClick={handleDeleteAdditional}>
                        Confirmar{' '}
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ display: spinnerDeleteAdditional }}
                        />
                    </Button>

                    <Button variant="danger"
                        style={{ display: buttonUpdateAdditional }}
                        onClick={handleUpdateAdditional}>
                        Salvar{' '}
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ display: spinnerSaveAdditional }}
                        />
                    </Button>
                </Modal.Footer>
            </Modal>
        </div >
    )
};

export default Additionals;