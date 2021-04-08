import React, { useState, useEffect } from 'react';
import produce from 'immer';

import { Container, Row, Col, Tabs, Tab, Button, Modal, Form, ListGroup, Spinner, Alert } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import PageHeader from '../../components/PageHeader';
import BreadCrumb from '../../components/BreadCrumb';
import CategoryItem, { Category } from '../../components/Categories';

// Tabs
import ProductsTab from './Products';
import HighlightsTab from './Highlights';
import AdditionalsTab from './Additionals';

import api from '../../services/api';
import { ContextDnd } from '../../context/categoriesDnd';

function Menu() {
    /* Categorias */
    const [listCategories, setListCategories] = useState<Category[] | null>(null);
    const [titleCategory, setTitleCategory] = useState('');

    const [buttonCreateCategory, setButtonCreateCategory] = useState('inline-block');
    const [buttonUpdateCategory, setButtonUpdateCategory] = useState('none');
    const [buttonDeleteCategory, setButtonDeleteCategory] = useState('none');
    const [buttonDeleteYesCategory, setButtonDeleteYesCategory] = useState('none');
    const [titleModalCategory, setTitleModalCategory] = useState('Criar uma categoria');
    const [selectedCategoryId, setSelectedCategoryId] = useState(0);
    const [spinnerSaveCategory, setSpinnerSaveCategory] = useState('none');
    const [spinnerDeleteCategory, setSpinnerDeleteCategory] = useState('none');
    const [successSaveCategory, setSuccessSaveCategory] = useState(false);
    const [errorSaveCategory, setErrorSaveCategory] = useState(false);

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        api.get('categories')
            .then(res => {
                setListCategories(res.data);
            })
            .catch(err => {
                console.log('error get categories');
                console.log(err);
            });
    }, []);

    function handelModalCategory(criar: boolean, categoryId: number) {
        if (criar) {
            setTitleModalCategory('Criar uma categoria');
            setTitleCategory('');
            setButtonCreateCategory('inline-block');
            setButtonDeleteCategory('none');
            setButtonDeleteYesCategory('none');
            setButtonUpdateCategory('none');
        }
        else {
            listCategories && listCategories.map(category => {
                if (category.id === categoryId) {
                    setSelectedCategoryId(category.id);
                    setTitleCategory(category.title);
                    return category;
                }
                return category;
            });
            setTitleModalCategory('Editar categoria');
            setButtonCreateCategory('none');
            setButtonDeleteYesCategory('none');
            setButtonDeleteCategory('inline-block');
            setButtonUpdateCategory('inline-block');
        }

        handleShow();
    }

    function handelPauseCategory(categoryId: number) {
        if (listCategories) {
            try {
                let categoryToUpdate = listCategories.map(category => {
                    if (category.id === categoryId) {
                        api.put(`categories/${categoryId}`, {
                            title: category.title,
                            paused: !category.paused,
                            order: category.order
                        });

                        category = {
                            ...category,
                            title: category.title,
                            paused: !category.paused,
                            order: category.order
                        };

                        return category;
                    }

                    return category;
                });

                setListCategories(categoryToUpdate);
            }
            catch (err) {
                console.log('error post a new category');
                console.log(err);
            }
        }

    }

    function handleButtonsDeleteCategory() {
        setButtonDeleteCategory('none');
        setButtonDeleteYesCategory('inline-block');
    }

    async function handleDeleteCategory() {
        setSpinnerDeleteCategory('inline-block');

        try {
            await api.delete(`categories/${selectedCategoryId}`);

            const res = await api.get('categories');

            setListCategories(res.data);

            setSpinnerDeleteCategory('none');

            handleClose();

            setSuccessSaveCategory(true);

            setTimeout(() => {
                setSuccessSaveCategory(false);
            }, 5000);
        }
        catch (err) {
            setSpinnerSaveCategory('none');
            handleClose();

            setErrorSaveCategory(true);

            setTimeout(() => {
                setErrorSaveCategory(false);
            }, 5000);

            console.log('error put the category');
            console.log(err);
        }
    }


    async function handleCreateCategory() {
        if (listCategories) {
            setSpinnerSaveCategory('inline-block');

            try {
                const response = await api.post('categories', {
                    title: titleCategory,
                    paused: false,
                    order: listCategories.length + 1
                });

                const { id, title, paused, order } = response.data;

                setListCategories([
                    ...listCategories,
                    { id, title, paused, order, products: [] }
                ]);

                setSpinnerSaveCategory('none');
                handleClose();

                setSuccessSaveCategory(true);

                setTimeout(() => {
                    setSuccessSaveCategory(false);
                }, 5000);
            }
            catch (err) {
                setSpinnerSaveCategory('none');
                handleClose();

                setErrorSaveCategory(true);

                setTimeout(() => {
                    setErrorSaveCategory(false);
                }, 5000);

                console.log('error post a new category');
                console.log(err);
            }
        }
    }

    function handleUpdateCategory() {
        if (listCategories) {
            setSpinnerSaveCategory('inline-block');

            try {
                let categoryToUpdate = listCategories.map(category => {
                    if (category.id === selectedCategoryId) {
                        api.put(`categories/${selectedCategoryId}`, {
                            title: category.title,
                            paused: category.paused,
                            order: category.order
                        });

                        category = {
                            ...category,
                            title: titleCategory === '' ? category.title : titleCategory,
                            paused: category.paused,
                            order: category.order
                        };

                        return category;
                    }

                    return category;
                });

                setListCategories(categoryToUpdate);

                setSpinnerSaveCategory('none');
                handleClose();

                setSuccessSaveCategory(true);

                setTimeout(() => {
                    setSuccessSaveCategory(false);
                }, 5000);
            }
            catch (err) {
                setSpinnerSaveCategory('none');
                handleClose();

                setErrorSaveCategory(true);

                setTimeout(() => {
                    setErrorSaveCategory(false);
                }, 5000);

                console.log('error put the category');
                console.log(err);
            }
        }
    }

    function moveOrder(from: number, to: number) {
        setListCategories(produce(listCategories, draft => {
            if (draft) {
                const dragged = draft[from];
                const target = draft[to];

                dragged.order = to;
                target.order = from;

                draft.splice(from, 1);
                draft.splice(to, 0, dragged);
            }
        }));
    }

    function saveOrder() {
        listCategories?.forEach(async category => {
            try {
                await api.put(`categories/${category.id}`, {
                    title: category.title,
                    paused: category.paused,
                    order: category.order
                });
            }
            catch {
                setErrorSaveCategory(true);

                setTimeout(() => {
                    setErrorSaveCategory(false);
                }, 5000);
            }

        });
    }

    return (
        <ContextDnd.Provider value={{ listCategories, moveOrder, saveOrder }}>
            <>
                <header className="bg-dark mb-2">
                    <PageHeader />
                </header>

                <Container>
                    <Row>
                        <Col>
                            <BreadCrumb page="Cardápio / Categorias" />
                        </Col>
                    </Row>
                </Container>

                <Container>
                    <Row className="content">
                        <Col>
                            <Row>
                                <Col>
                                    <Alert variant="success"
                                        dismissible
                                        show={successSaveCategory}>
                                        Sucesso! As informações foram salvas.
                            </Alert>

                                    <Alert variant="danger"
                                        dismissible
                                        show={errorSaveCategory}>
                                        Algo deu errado! As informações não foram salvas.
                            </Alert>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <Tabs defaultActiveKey="categories" id="tab-menu">
                                        <Tab eventKey="categories" title="Categorias">
                                            <article className="mt-3">
                                                <Row>
                                                    <Col>
                                                        <Button variant="danger" onClick={() => { handelModalCategory(true, 0) }} >Adicionar cateogria</Button>
                                                    </Col>
                                                    <Col>
                                                        <Spinner
                                                            as="span"
                                                            animation="border"
                                                            size="sm"
                                                            role="status"
                                                            aria-hidden="true"
                                                            style={{ display: spinnerSaveCategory }}
                                                        />
                                                    </Col>
                                                </Row>
                                            </article>

                                            <article className="mt-3">
                                                <Row>
                                                    <Col>
                                                        <ListGroup>
                                                            {
                                                                listCategories && listCategories.map((category: Category, index) => {
                                                                    return <CategoryItem
                                                                        key={category.id}
                                                                        category={category}
                                                                        index={index}
                                                                        handelModalCategory={handelModalCategory}
                                                                        handelPauseCategory={handelPauseCategory}
                                                                    />
                                                                })
                                                            }
                                                        </ListGroup>
                                                    </Col>
                                                </Row>
                                            </article>
                                        </Tab>

                                        <Tab eventKey="additionals" title="Adicionais">
                                            <AdditionalsTab />
                                        </Tab>

                                        <Tab eventKey="products" title="Produtos">
                                            <ProductsTab categories={listCategories} />
                                        </Tab>

                                        <Tab eventKey="highlights" title="Destaques">
                                            <HighlightsTab categories={listCategories} />
                                        </Tab>
                                    </Tabs>
                                </Col>
                            </Row>

                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>{titleModalCategory}</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <form>
                                        <Form.Group controlId="categoryFormGridName">
                                            <Form.Label>Nome da categoria</Form.Label>
                                            <Form.Control type="text"
                                                defaultValue={titleCategory}
                                                placeholder="Ex: Pizzas"
                                                onBlur={(e: any) => { setTitleCategory(e.target.value) }}
                                            />
                                            <Form.Text className="text-muted text-right">1/25 caracteres.</Form.Text>
                                        </Form.Group>
                                    </form>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="outline-danger" onClick={handleClose}>
                                        Cancelar
                                    </Button>
                                    <Button variant="danger"
                                        style={{ display: buttonCreateCategory }}
                                        onClick={() => { handleCreateCategory() }}>
                                        Criar{' '}
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            style={{ display: spinnerSaveCategory }}
                                        />
                                    </Button>

                                    <Button variant="danger"
                                        style={{ display: buttonDeleteCategory }}
                                        onClick={() => { handleButtonsDeleteCategory() }}>
                                        Excluir{' '}
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            style={{ display: spinnerDeleteCategory }}
                                        />
                                    </Button>

                                    <Button variant="warning"
                                        style={{ display: buttonDeleteYesCategory }}
                                        onClick={() => { handleDeleteCategory() }}>
                                        Confirmar{' '}
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            style={{ display: spinnerDeleteCategory }}
                                        />
                                    </Button>

                                    <Button variant="danger"
                                        style={{ display: buttonUpdateCategory }}
                                        onClick={() => { handleUpdateCategory() }}>
                                        Salvar{' '}
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            style={{ display: spinnerSaveCategory }}
                                        />
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Col>
                    </Row>
                </Container>
            </>
        </ContextDnd.Provider>
    )
};

export default Menu;