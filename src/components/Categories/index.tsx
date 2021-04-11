import React, { useState, useContext } from 'react';
import { Row, Col, ListGroup, Modal, Form, Button, Spinner, Toast } from 'react-bootstrap';
import { BsFillPauseFill, BsFillPlayFill, BsFiles, BsPencil, BsXCircleFill, BsList } from 'react-icons/bs';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../services/api';
import { Context } from '../../context/auth';
import { CategoriesContext } from '../../context/categoriesContext';
import rbac from '../../services/roleBasedAccessControl';
import { Product } from '../Products';

export interface Category {
    id: number;
    title: string;
    paused: boolean;
    order: number;
    products: Product[];
}

interface CategoryProps {
    category: Category;
}

const validatiionSchema = Yup.object().shape({
    title: Yup.string().required('Obrigatório!').max(25, 'Deve conter no máximo 25 caracteres!'),
});

const Categories: React.FC<CategoryProps> = ({ category }) => {
    const { user } = useContext(Context);
    const { listCategories, handleListCategories } = useContext(CategoriesContext);

    const [showModalEditCategory, setShowModalEditCategory] = useState(false);

    const handleCloseModalEditCategory = () => { setShowModalEditCategory(false); setIconDeleteConfirm(false); setIconDelete(true); }
    const handleShowModalNewCategory = () => setShowModalEditCategory(true);

    const [categorySaving, setCategorySaving] = useState(false);
    const [categoryPausing, setCategoryPausing] = useState(false);
    const [categoryDuplicating, setCategoryDuplicating] = useState(false);

    const [iconDelete, setIconDelete] = useState(true);
    const [iconDeleteConfirm, setIconDeleteConfirm] = useState(false);
    const [iconDeleting, setDeleting] = useState(false);

    const [showErrorCategory, setShowErrorCategory] = useState(false);
    const toggleShowErrorCategory = () => setShowErrorCategory(!showErrorCategory);

    const togglePauseCategory = async () => {
        setCategoryPausing(true);

        try {
            await api.put(`categories/${category.id}`, {
                title: category.title,
                paused: !category.paused,
                order: category.order
            });

            const res = await api.get('categories');

            handleListCategories(res.data);
        }
        catch (err) {
            console.log("Error to pause category");
            console.log(err);
        }

        setCategoryPausing(false);
    }

    async function handleDuplicateCategory() {
        setCategoryDuplicating(true);
        try {
            if (listCategories) {
                await api.post('categories', {
                    title: category.title,
                    paused: category.paused,
                    order: listCategories.length
                });

                const res = await api.get('categories');

                handleListCategories(res.data);
            }
        }
        catch (err) {
            console.log('error create category.');
            console.log(err);
        }

        setCategoryDuplicating(false);
    }

    async function deleteProduct() {
        if (iconDelete) {
            setIconDelete(false);
            setIconDeleteConfirm(true);

            return;
        }

        setIconDeleteConfirm(false);
        setDeleting(true);

        try {
            await api.delete(`categories/${category.id}`);

            const list = listCategories.filter(item => { return item.id !== category.id });

            list.forEach(async (category, index) => {
                try {
                    await api.put(`categories/${category.id}`, {
                        title: category.title,
                        paused: category.paused,
                        order: index
                    });
                }
                catch (err) {
                    console.log('error to save categories order after deleting.');
                    console.log(err)
                }
            });

            const res = await api.get('categories');

            handleCloseModalEditCategory();

            handleListCategories(res.data);
        }
        catch (err) {
            setDeleting(false);
            setIconDeleteConfirm(false);
            setIconDelete(true);

            console.log("Error to delete product");
            console.log(err);
        }
    }

    return (
        <ListGroup.Item variant={category.paused !== true ? "light" : "danger"}>
            <Row>
                <Col sm={1}>
                    <BsList />
                </Col>

                <Col><span>{category.title}</span></Col>

                <Col>
                    <Button
                        variant="outline-danger"
                        className="button-link"
                        onClick={togglePauseCategory}>
                        {
                            categoryPausing ? <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> : category.paused ? (<><BsFillPlayFill /> Pausado</>) : (<><BsFillPauseFill /> Pausar</>)
                        }
                    </Button>
                </Col>

                {
                    user && rbac.can(String(user.type.code)).updateAny('categories').granted && <>
                        <Col className="text-right">
                            <Button variant="outline-danger" className="button-link" onClick={handleDuplicateCategory}>
                                {
                                    categoryDuplicating ? <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : <><BsFiles /> Duplicar</>
                                }
                            </Button>
                        </Col>

                        <Col className="text-right">
                            <Button variant="outline-danger" className="button-link" onClick={handleShowModalNewCategory}><BsPencil /> Editar</Button>
                        </Col>
                    </>
                }
            </Row>

            <Modal show={showModalEditCategory} onHide={handleCloseModalEditCategory}>
                <Modal.Header closeButton>
                    <Modal.Title>Edtiar categoria</Modal.Title>
                </Modal.Header>
                <Formik
                    initialValues={
                        {
                            title: category.title
                        }
                    }
                    onSubmit={async values => {
                        setCategorySaving(true);

                        try {
                            if (listCategories) {
                                await api.post('categories', {
                                    title: values.title,
                                    paused: category.paused,
                                    order: category.order
                                });

                                const res = await api.get('categories');

                                handleListCategories(res.data);

                                handleCloseModalEditCategory();
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
                                            <strong className="mr-auto">Error</strong>
                                        </Toast.Header>
                                        <Toast.Body>Error to save</Toast.Body>
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

                                <Button
                                    title="Delete product"
                                    variant={iconDelete ? "outline-danger" : "outline-warning"}
                                    onClick={deleteProduct}
                                >
                                    {
                                        iconDelete && "Excluir"
                                    }

                                    {
                                        iconDeleteConfirm && "Confirmar"
                                    }

                                    {
                                        iconDeleting && <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />
                                    }
                                </Button>

                                <Button variant="secondary" onClick={handleCloseModalEditCategory}>
                                    Cancelar
                                </Button>
                            </Modal.Footer>
                        </Form>
                    )}
                </Formik>
            </Modal>
        </ListGroup.Item>
    )
}

export default Categories;