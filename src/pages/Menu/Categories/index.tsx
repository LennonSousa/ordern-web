import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Button, Modal, Form, ListGroup, Spinner, Toast } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { BsXCircleFill } from 'react-icons/bs';
import { Formik } from 'formik';
import * as Yup from 'yup';
import produce from 'immer';

import api from '../../../services/api';
import { Context } from '../../../context/auth';
import { CategoriesContext } from '../../../context/categoriesContext';
import rbac from '../../../services/roleBasedAccessControl';
import CategoryItem, { Category } from '../../../components/Categories';

const validatiionSchema = Yup.object().shape({
    title: Yup.string().required('Obrigatório!').max(25, 'Deve conter no máximo 25 caracteres!'),
});

const CategoriesTab: React.FC = () => {
    const { user } = useContext(Context);
    const { listCategories, handleListCategories } = useContext(CategoriesContext);

    const [showModalNewCategory, setShowModalNewCategory] = useState(false);

    const handleCloseModalNewCategory = () => setShowModalNewCategory(false);
    const handleShowModalNewCategory = () => setShowModalNewCategory(true);

    const [categorySaving, setCategorySaving] = useState(false);
    const [categoriesOrderSaving, setCategoriesOrderSaving] = useState(false);

    const [showErrorCategory, setShowErrorCategory] = useState(false);
    const toggleShowErrorCategory = () => setShowErrorCategory(!showErrorCategory);

    useEffect(() => {
        api.get('categories')
            .then(res => {
                handleListCategories(res.data);
            })
            .catch(err => {
                console.log('error get categories');
                console.log(err);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function handleOnDragEnd(result: DropResult) {
        if (result.destination) {
            const from = result.source.index;
            const to = result.destination.index;

            const updatedListCategories = produce(listCategories, draft => {
                if (draft) {
                    const dragged = draft[from];

                    draft.splice(from, 1);
                    draft.splice(to, 0, dragged);
                }
            });

            if (updatedListCategories) {
                handleListCategories(updatedListCategories);
                saveOrder(updatedListCategories);
            }
        }
    }

    async function saveOrder(list: Category[]) {
        setCategoriesOrderSaving(true);

        list.forEach(async( category, index) => {
            try {
                await api.put(`categories/${category.id}`, {
                    title: category.title,
                    paused: category.paused,
                    order: index
                });

                const res = await api.get('categories');

                handleListCategories(res.data);
            }
            catch (err) {
                console.log('error to save categories order');
                console.log(err)
            }
        });

        setCategoriesOrderSaving(false);
    }

    return (
        <div>
            {
                user && rbac.can(String(user.type.code)).createAny('categories').granted && <section className="mt-3">
                    <Row className="align-items-center">
                        <Col sm={2}>
                            <Button variant="danger" onClick={handleShowModalNewCategory} >Criar categoria</Button>
                        </Col>
                        {
                            categoriesOrderSaving && <Col className="text-danger" sm={1}>
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                            </Col>
                        }
                    </Row>
                </section>
            }

            <article className="mt-3">
                <Row>
                    <Col>
                        <DragDropContext onDragEnd={handleOnDragEnd}>
                            <Droppable droppableId="categories">
                                {provided => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                    >
                                        <ListGroup>
                                            {
                                                listCategories && listCategories.map((category: Category, index) => {
                                                    return <Draggable key={category.id} draggableId={String(category.id)} index={index}>
                                                        {(provided) => (
                                                            <div
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                ref={provided.innerRef}
                                                            >
                                                                <CategoryItem category={category} />
                                                            </div>
                                                        )}

                                                    </Draggable>
                                                })
                                            }
                                        </ListGroup>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    </Col>
                </Row>
            </article>

            <Modal show={showModalNewCategory} onHide={handleCloseModalNewCategory}>
                <Modal.Header closeButton>
                    <Modal.Title>Criar uma categoria</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={
                        {
                            title: ''
                        }
                    }
                    onSubmit={async values => {
                        setCategorySaving(true);

                        try {
                            if (listCategories) {
                                await api.post('categories', {
                                    title: values.title,
                                    paused: false,
                                    order: listCategories.length
                                });

                                const res = await api.get('categories');

                                handleListCategories(res.data);

                                handleCloseModalNewCategory();
                            }
                        }
                        catch (err) {
                            toggleShowErrorCategory();

                            console.log('error create category.');
                            console.log(err);
                        }

                        setCategorySaving(false);
                    }}
                    validationSchema={validatiionSchema}
                    validateOnChange={false}
                >
                    {({ handleChange, handleBlur, handleSubmit, values, errors, isValid, touched }) => (
                        <Form onSubmit={handleSubmit}>
                            <Modal.Body>
                                <Form.Group controlId="categoryFormGridName">
                                    <Form.Label>Nome da categoria</Form.Label>
                                    <Form.Control type="text"
                                        placeholder="Título"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.title}
                                        name="title"
                                        isInvalid={!!errors.title && touched.title}
                                    />
                                    {touched.title && <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>}
                                    <Form.Text className="text-muted text-right">{`${values.title.length}/25 caracteres.`}</Form.Text>
                                </Form.Group>

                            </Modal.Body>
                            <Modal.Footer>
                                <div
                                    aria-live="polite"
                                    aria-atomic="true"
                                    style={{
                                        position: 'absolute',
                                        left: 10,
                                        bottom: 10,
                                        zIndex: 9999
                                    }}
                                >
                                    <Toast onClose={toggleShowErrorCategory} show={showErrorCategory} animation={false} autohide delay={5000}>
                                        <Toast.Header style={{ backgroundColor: 'var(--danger)', color: '#fff' }}>
                                            <BsXCircleFill />
                                            <strong className="mr-auto">Erro</strong>
                                        </Toast.Header>
                                        <Toast.Body>Erro ao salvar categoria.</Toast.Body>
                                    </Toast>
                                </div>

                                <Button variant="danger" disabled={isValid ? false : true} type="submit">
                                    {
                                        categorySaving ? <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> : "Create"
                                    }
                                </Button>
                                <Button variant="secondary" onClick={handleCloseModalNewCategory}>
                                    Cancelar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </div>
    )
};

export default CategoriesTab;