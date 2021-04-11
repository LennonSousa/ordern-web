import React, { useState, useEffect, useContext } from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { BsCheckBox } from "react-icons/bs";
import { FaSave } from 'react-icons/fa';
import { Container, Row, Col, Button, Modal, Form, ListGroup, Spinner, Image, Alert } from 'react-bootstrap';

import api from '../../../services/api';
import { Context } from '../../../context/auth';
import rbac from '../../../services/roleBasedAccessControl';
import { StoreContext } from '../../../context/storeContext';
import { Category } from '../../../components/Categories';
import HighlightItem, { Highlight } from '../../../components/Highlights';
import { Product } from '../../../components/Products';

import noPhoto from '../../../assets/images/no-photo.jpg';

interface HighlightsTabProps {
    categories: Category[] | null;
}

const validatiionSchema = Yup.object().shape({
    highlights_title: Yup.string().required('Obrigatório!').max(25, 'Deve conter no máximo 25 caracteres!'),
});

const HighlightsTab: React.FC<HighlightsTabProps> = ({ categories }) => {
    const { user } = useContext(Context);
    const { store, handleStore } = useContext(StoreContext);

    const [listCategories, setListCategories] = useState<Category[] | null>(null);

    /* Additionals */
    const [highlights, setHighlights] = useState<Highlight[]>([]);
    const [selectedHighlight, setSelecteHighlight] = useState<Highlight>();
    const [selectedProduct, setSelectedProduct] = useState<Product>();

    const [buttonCreateUpdateHighlight, setButtonCreateUpdateHighlight] = useState(true);
    const [buttonDeleteHighlight, setButtonDeleteHighlight] = useState(false);
    const [buttonDeleteConfirmHighlight, setButtonDeleteConfirmHighlight] = useState(false);

    const [spinnerEnableStoreHighlight, setSpinnerEnableStoreHighlight] = useState(false);
    const [spinnerSaveStoreHighlight, setSpinnerSaveStoreHighlight] = useState(false);
    const [spinnerSaveHighlight, setSpinnerSaveHighlight] = useState(false);
    const [spinnerDeleteHighlight, setSpinnerDeleteHighlight] = useState(false);
    const [successSaveHighlight, setSuccessSaveHighlight] = useState(false);
    const [errorSaveHighlight, setErrorSaveHighlight] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        try {
            if (store) {
                api.get('highlights/landing')
                    .then(res => {
                        setHighlights(res.data);

                        setListCategories(categories);
                    })
                    .catch(err => {
                        setTimeout(() => {
                            setErrorSaveHighlight(false);
                        }, 5000);

                        console.log('error get highlights');
                        console.log(err);
                    });
            } else {
                api.get('restaurants').then(res => {
                    handleStore(res.data[0]);
                });
            }

        }
        catch (err) {

        }

    }, [store, categories]); // eslint-disable-line react-hooks/exhaustive-deps

    async function handleHighlights() {
        try {
            const res = await api.get('highlights/landing');

            setHighlights(res.data);
        }
        catch {
            console.log('error get highlights');
        }

        handleClose();
    }

    async function handleDelete() {
        try {
            if (selectedHighlight) {
                if (buttonDeleteConfirmHighlight) {
                    setSpinnerDeleteHighlight(true);

                    await api.delete(`highlights/landing/${selectedHighlight.id}`);

                    await handleHighlights();

                    setSpinnerDeleteHighlight(false);
                }
                else {
                    setButtonDeleteConfirmHighlight(true);
                }
            }
        }
        catch (err) {
            setSpinnerDeleteHighlight(false);

            handleClose();

            setErrorSaveHighlight(true);

            setTimeout(() => {
                setErrorSaveHighlight(false);
            }, 5000);

            console.log('error delete highlight.');
            console.log(err);
        }
    }

    function handleModalHighlight(mode: "create" | "edit", highlightId: number) {
        if (mode === "create") {
            setSelectedProduct(undefined);
            setSpinnerSaveHighlight(false);
            setSpinnerDeleteHighlight(false);

            setButtonCreateUpdateHighlight(true); // Create
            setButtonDeleteConfirmHighlight(false);
            setButtonDeleteHighlight(false);
        }
        else if (mode === "edit") {
            highlights.forEach(highlight => {
                if (highlight.id === highlightId) {
                    setSelecteHighlight(highlight);
                    setSelectedProduct(highlight.product);

                    setSpinnerSaveHighlight(false);
                    setSpinnerDeleteHighlight(false);

                    setButtonCreateUpdateHighlight(false); // Edit
                    setButtonDeleteConfirmHighlight(false);
                    setButtonDeleteHighlight(true);
                }
            });
        }

        handleShow();
    }

    async function handleEnableStoreHighlights() {
        setSpinnerEnableStoreHighlight(true);

        try {
            store && await api.put(`restaurants/${store.id}`, {
                title: store.title,
                phone: store.phone,
                description: store.description,
                min_order: Number(store.min_order),
                zip_code: store.zip_code,
                street: store.street,
                number: store.number,
                group: store.group,
                city: store.city,
                country: store.country,
                latitude: store.latitude,
                longitude: store.longitude,
                free_shipping: store.free_shipping,
                highlights: !store.highlights,
                highlights_title: store.highlights_title
            });

            const updatedStore = await api.get('restaurants');

            handleStore(updatedStore.data[0]);

            setSpinnerEnableStoreHighlight(false);

            setSuccessSaveHighlight(true);

            setTimeout(() => {
                setSuccessSaveHighlight(false);
            }, 5000);
        }
        catch (err) {
            setSpinnerEnableStoreHighlight(false);

            setErrorSaveHighlight(true);

            setTimeout(() => {
                setErrorSaveHighlight(false);
            }, 5000);

            console.log('error create or update store highlight.');
            console.log(err);
        }
    }

    return (
        store ? <div className="mb-5">
            <section className="mt-3">
                <Row>
                    <Col>
                        <Alert variant="success"
                            dismissible
                            show={successSaveHighlight}>
                            Sucesso! As informações foram salvas.
                        </Alert>

                        <Alert variant="danger"
                            dismissible
                            show={errorSaveHighlight}>
                            Algo deu errado! As informações não foram salvas.
                        </Alert>
                    </Col>
                </Row>
            </section>

            <section className="mt-3">
                <Row>
                    <Col>
                        <Formik
                            initialValues={
                                {
                                    highlights_title: store.highlights_title
                                }
                            }
                            onSubmit={async values => {
                                if (user && rbac.can(String(user.type.code)).updateAny('store').granted) {
                                    setSpinnerSaveStoreHighlight(true);

                                    try {
                                        store && await api.put(`restaurants/${store.id}`, {
                                            title: store.title,
                                            phone: store.phone,
                                            description: store.description,
                                            min_order: Number(store.min_order),
                                            zip_code: store.zip_code,
                                            street: store.street,
                                            number: store.number,
                                            group: store.group,
                                            city: store.city,
                                            country: store.country,
                                            latitude: store.latitude,
                                            longitude: store.longitude,
                                            free_shipping: store.free_shipping,
                                            highlights: store.highlights,
                                            highlights_title: values.highlights_title
                                        });

                                        setSpinnerSaveStoreHighlight(false);

                                        setSuccessSaveHighlight(true);

                                        setTimeout(() => {
                                            setSuccessSaveHighlight(false);
                                        }, 5000);
                                    }
                                    catch (err) {
                                        setSpinnerSaveStoreHighlight(false);

                                        setErrorSaveHighlight(true);

                                        setTimeout(() => {
                                            setErrorSaveHighlight(false);
                                        }, 5000);

                                        console.log('error create or update store highlight.');
                                        console.log(err);
                                    }
                                }
                            }}
                            validationSchema={validatiionSchema}
                        >
                            {({ handleChange, handleSubmit, values, errors }) => (
                                <Form onSubmit={handleSubmit}>
                                    <Form.Row>
                                        <Col sm={10}>
                                            <Form.Control type="text"
                                                placeholder="Título"
                                                readOnly={user && rbac.can(String(user.type.code)).updateAny('store').granted ? false : true}
                                                onChange={handleChange}
                                                value={values.highlights_title}
                                                name="highlights_title"
                                                isInvalid={!!errors.highlights_title}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.highlights_title}</Form.Control.Feedback>
                                            <Form.Text className="text-muted text-right">{`${values.highlights_title.length}/25 caracteres.`}</Form.Text>
                                        </Col>

                                        {
                                            user && rbac.can(String(user.type.code)).updateAny('store').granted && <Col sm={2}>
                                                <Button type="submit" variant="outline-danger">{
                                                    spinnerSaveStoreHighlight ? <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    /> :
                                                        <FaSave size={20} />
                                                }</Button>
                                            </Col>
                                        }
                                    </Form.Row>
                                </Form>
                            )}
                        </Formik>
                    </Col>
                    <Col>
                        <Form.Row>
                            <Form.Group as={Col} controlId="storeFormGridHighlights">
                                {
                                    spinnerEnableStoreHighlight ? <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> :
                                        <Form.Check
                                            type="switch"
                                            id="custom-switch-highlights"
                                            label={store && store.highlights ? "Habilitado" : "Desabilitado"}
                                            checked={store?.highlights}
                                            onChange={handleEnableStoreHighlights}
                                        />
                                }
                            </Form.Group>
                        </Form.Row>
                    </Col>
                </Row>
            </section>

            {
                user && rbac.can(String(user.type.code)).updateAny('highlights').granted && <section className="mt-3">
                    <Row>
                        <Col>
                            <Button variant="danger" onClick={() => { handleModalHighlight("create", 0) }} >Criar destaque</Button>
                        </Col>
                    </Row>
                </section>
            }

            <article className="mt-3">
                <Row>
                    <Col>
                        <ListGroup>
                            {
                                highlights && highlights.map((highlight, index) => {
                                    return <div key={index}>
                                        <HighlightItem
                                            key={index}
                                            highlight={highlight}
                                            handleHighlights={handleHighlights}
                                            handleModalHighlight={handleModalHighlight}
                                        />
                                    </div>
                                })
                            }
                        </ListGroup>
                    </Col>
                </Row>
            </article>

            <Modal show={show} onHide={handleClose} >
                <Modal.Header closeButton>
                    <Modal.Title>{buttonCreateUpdateHighlight ? "Criar destaque" : "Editar destaque"}</Modal.Title>
                </Modal.Header>

                <Formik
                    initialValues={
                        {
                            active: selectedHighlight ? selectedHighlight.active : '',
                        }
                    }
                    onSubmit={async values => {
                        setSpinnerSaveHighlight(true);

                        try {
                            if (selectedProduct) {
                                if (buttonCreateUpdateHighlight) {
                                    await api.post('highlights/landing', {
                                        active: true,
                                        product: selectedProduct.id
                                    });
                                }
                                else if (selectedHighlight) {
                                    await api.put(`highlights/landing/${selectedHighlight.id}`, {
                                        active: selectedHighlight.active,
                                        product: selectedProduct.id
                                    });
                                }

                                handleHighlights();
                            }

                            setSpinnerSaveHighlight(false);

                            setSuccessSaveHighlight(true);

                            setTimeout(() => {
                                setSuccessSaveHighlight(false);
                            }, 5000);
                        }
                        catch (err) {
                            setSpinnerSaveHighlight(false);

                            handleClose();

                            setErrorSaveHighlight(true);

                            setTimeout(() => {
                                setErrorSaveHighlight(false);
                            }, 5000);

                            console.log('error create or update highlight.');
                            console.log(err);
                        }
                    }}
                >
                    {({ handleSubmit }) => (
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body>
                                <Row>
                                    <Col sm={2}>
                                        <Row>
                                            <Col>
                                                <Image
                                                    fluid
                                                    src={selectedProduct ? selectedProduct?.image : noPhoto}
                                                    alt="Product image."
                                                />
                                            </Col>
                                        </Row>
                                    </Col>

                                    <Col sm={10}>
                                        <Row>
                                            <Col>
                                                <h5>{
                                                    selectedProduct ? selectedProduct.title :
                                                        "Selecione um produto para criar um destaque."
                                                }</h5>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col>
                                                <h6 className="text-secondary">{selectedProduct?.category.title}</h6>
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                            </Modal.Body>
                            <Modal.Dialog scrollable style={{ marginTop: 0 }}>
                                <Modal.Body>
                                    <Row>
                                        <Col>
                                            {
                                                listCategories && listCategories.map((category, index) => {
                                                    return <div key={index} className="pb-4">
                                                        <h4 className="text-danger">{category.title}</h4>
                                                        <ListGroup >
                                                            {
                                                                category.products.map((product, index) => {
                                                                    return <Button
                                                                        className={`list-group-item ${selectedProduct && product.id === selectedProduct.id ? "list-group-item-success" : "list-group-item-light"} list-group-item-action`}
                                                                        key={index}
                                                                        onClick={() => { setSelectedProduct(product) }}
                                                                    >
                                                                        <Row>
                                                                            <Col className="col-10">
                                                                                {product.title}
                                                                            </Col>
                                                                            <Col className="col-2">
                                                                                {
                                                                                    selectedProduct && product.id === selectedProduct.id &&
                                                                                    <BsCheckBox size={20} />
                                                                                }
                                                                            </Col>
                                                                        </Row>
                                                                    </Button>
                                                                })
                                                            }
                                                        </ListGroup>
                                                    </div>
                                                })
                                            }
                                        </Col>
                                    </Row>
                                </Modal.Body>

                                <Modal.Footer>
                                    <Button variant="outline-danger" onClick={handleClose}>
                                        Cancelar
                                </Button>

                                    {
                                        buttonDeleteHighlight && <Button variant={buttonDeleteConfirmHighlight ? "warning" : "danger"}
                                            onClick={handleDelete}>
                                            {
                                                spinnerDeleteHighlight ? <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                /> : buttonDeleteConfirmHighlight ? "Confirmar" : "Excluir"
                                            }
                                        </Button>
                                    }

                                    {
                                        buttonCreateUpdateHighlight ? <Button
                                            type="submit"
                                            variant={selectedProduct ? "danger" : "secondary"}
                                            disabled={selectedProduct ? false : true}
                                        >
                                            {
                                                spinnerSaveHighlight ? <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                /> : "Criar"
                                            }
                                        </Button> :
                                            <Button
                                                type="submit"
                                                variant={selectedProduct ? "danger" : "secondary"}
                                                disabled={selectedProduct ? false : true}
                                            >
                                                {
                                                    spinnerSaveHighlight ? <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                    /> : "Salvar"
                                                }
                                            </Button>
                                    }
                                </Modal.Footer>
                            </Modal.Dialog>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div > :
            <Container>
                <Row style={{ height: '100%' }} className="justify-content-center align-items-center text-center">
                    <Col>
                        <h1>Aguarde, informações da loja...</h1>
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        />
                    </Col>
                </Row>
            </Container>
    )
};

export default HighlightsTab;