import React, { useContext, useEffect, useState } from 'react';

import { Row, Col, Form, ListGroup, Button, Spinner } from 'react-bootstrap';
import { BsPlusSquare, BsFillTrashFill, BsExclamationOctagon, BsCheck, BsBackspace } from 'react-icons/bs';
import { FaSave } from 'react-icons/fa';

import ProductAditionalItem, { ProductAditional } from '../ProductAditional';
import { ContextSelectedProduct } from '../../context/selectedProductContext';

export interface ProductCategory {
    id: number;
    title: string;
    min: number;
    max: number;
    repeat: boolean;
    order: number;
    productAdditional: ProductAditional[];
    product: number;
}

interface ProductCategoryProps {
    productCategory: ProductCategory;
}

const ProductCategories: React.FC<ProductCategoryProps> = ({ productCategory }) => {
    const {
        selectedProduct,
        handleUpdateSelectedProduct,
        handleTabComplements,
        handleListUpdateProductCategories,
        handleListDeleteProductCategories,
        handleListUpdateProductAdditionals
    } = useContext(ContextSelectedProduct);

    const [productCategoryItem, setProductCategoryItem] = useState<ProductCategory>(productCategory);

    const [canRepeat, setCanRepeat] = useState(productCategoryItem.repeat);

    const toggleCanRepeat = () => setCanRepeat(!canRepeat);

    const [buttonSave, setButtonSave] = useState('none');
    const [buttonCancel, setButtonCancel] = useState('none');

    const [iconSaved, setIconSaved] = useState('none');
    const [iconSave, setIconSave] = useState('inline-block');
    const [loadingSave, setLoadingSave] = useState('none');

    const [buttonDelete, setButtonDelete] = useState('inline-block');
    const [buttonDeleteYes, setButtonDeleteYes] = useState('none');

    useEffect(() => {
        setProductCategoryItem(productCategory);
    }, [productCategory]);

    function handleCategory(field: string, value: string) {
        setButtonDelete('none');
        setButtonDeleteYes('none');
        setIconSave('inline-block');
        setButtonSave('inline-block');
        setButtonCancel('inline-block');

        setProductCategoryItem({ ...productCategoryItem, [field]: value });
    }

    function handleCategoryRepeat() {
        setButtonDelete('none');
        setButtonDeleteYes('none');
        setIconSave('inline-block');
        setButtonSave('inline-block');
        setButtonCancel('inline-block');

        setProductCategoryItem({ ...productCategoryItem, repeat: !productCategoryItem.repeat });

        toggleCanRepeat();
    }

    function handleButtonSave() {
        if (selectedProduct) {
            setButtonCancel('none');
            setIconSave('none');
            setLoadingSave('inline-block');

            handleTabComplements(true);

            if (productCategory.id !== 0) {
                handleListUpdateProductCategories(productCategory.id);
            }

            handleUpdateSelectedProduct({
                ...selectedProduct, categoriesAdditional: selectedProduct.categoriesAdditional.map((productCategory) => {
                    if (productCategory.id === productCategoryItem.id && productCategory.order === productCategoryItem.order) {
                        return productCategoryItem;
                    }

                    return productCategory;
                })
            });

            setTimeout(() => {
                setLoadingSave('none');
                setIconSaved('inline-block');

                setTimeout(() => {
                    setButtonSave('none');
                    setIconSaved('none');
                    setButtonDelete('inline-block');
                }, 1000);

            }, 1000);
        }
    }

    function handleButtonDelete() {
        setButtonDelete('none');
        setButtonDeleteYes('inline-block');
        setButtonCancel('inline-block');
    }

    function handleButtonCancel() {
        setButtonDelete('inline-block');
        setButtonDeleteYes('none');
        setButtonSave('none');
        setButtonCancel('none');

        setProductCategoryItem({ ...productCategoryItem, title: productCategory.title, min: productCategory.min, max: productCategory.max });
    }

    function handleDeleteValue() {
        if (selectedProduct) {
            setButtonDeleteYes('none');
            setButtonCancel('none');
            setButtonDelete('inline-block');

            handleTabComplements(true);

            if (productCategory.id !== 0) {
                handleListDeleteProductCategories(productCategory.id);
            }

            const updatedProductCategories = selectedProduct.categoriesAdditional.filter(
                item => item !== productCategoryItem);

            handleUpdateSelectedProduct({
                ...selectedProduct, categoriesAdditional: updatedProductCategories.map((productCategory, index) => {
                    return { ...productCategory, order: index };
                })
            });
        }
    }

    // Product Additionals
    function handleAddAdditional() {
        if (selectedProduct) {
            handleTabComplements(true);

            let listAdditionalsToUpdate: Number[] = [];

            handleUpdateSelectedProduct({
                ...selectedProduct, categoriesAdditional: selectedProduct.categoriesAdditional.map((productCategory) => {

                    if (productCategory === productCategoryItem) {
                        const additionalsSorted = productCategoryItem.productAdditional.map((additional, index) => {
                            listAdditionalsToUpdate.push(additional.id);

                            return { ...additional, order: index };
                        });

                        return {
                            ...productCategoryItem, productAdditional: [...additionalsSorted, {
                                id: 0,
                                pdv: '',
                                price: 0.00,
                                order: productCategoryItem.productAdditional.length,
                                additional: {
                                    id: 0,
                                    title: '',
                                    code: '',
                                    paused: false,
                                    productAdditionals: []
                                },
                                categoryAdditional: productCategoryItem
                            }]
                        }
                    }

                    return productCategory;
                })
            });

            handleListUpdateProductAdditionals(listAdditionalsToUpdate);
        }
    }

    return (
        <>
            <Row className="mt-3 mb-3 pt-3 pb-3 bg-light">
                <Col>
                    <Form.Row>
                        <Form.Group md={10} as={Col} controlId={`catProductFormGridName${productCategory.id}`}>
                            <Form.Control
                                type="text"
                                placeholder="Ex: Queijos"
                                value={productCategoryItem?.title}
                                onChange={(e) => handleCategory('title', e.target.value)}
                            />
                            <Form.Text className="text-muted text-right">1/25 caracteres.</Form.Text>
                        </Form.Group>
                        <Form.Group md={2} as={Col} controlId={`catProducttFormButtonDelete${productCategory.id}`}>
                            <Button
                                variant="outline-danger"
                                className="button-link"
                                style={{ display: buttonDelete }}
                                onClick={handleButtonDelete}
                            >
                                <BsFillTrashFill /> Excluir
                            </Button>

                            <Button variant="warning"
                                style={{ display: buttonDeleteYes }}
                                onClick={() => { handleDeleteValue() }}
                            >
                                <BsExclamationOctagon />
                            </Button>

                            <Button variant="outline-success" className="mr-1" style={{ display: buttonSave }} onClick={() => handleButtonSave()} >
                                <BsCheck style={{ display: iconSaved }} />
                                <FaSave style={{ display: iconSave }} />
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ display: loadingSave }}
                                />
                            </Button>

                            <Button variant="outline-danger" style={{ display: buttonCancel }} onClick={() => handleButtonCancel()} >
                                <BsBackspace />
                            </Button>
                        </Form.Group>
                    </Form.Row>

                    <Form.Row className="align-items-center">
                        <Form.Group md={3} as={Col} controlId={`catProductFormGridMin${productCategory.id}`}>
                            <Form.Label>Quantidade mínima</Form.Label>
                            <Form.Control type="number"
                                placeholder="0"
                                value={productCategoryItem?.min}
                                onChange={(e) => handleCategory('min', e.target.value)}
                            />
                            <Form.Text className="text-muted text-right">0 para opcional.</Form.Text>
                        </Form.Group>
                        <Form.Group md={3} as={Col} controlId={`catProductFormGridMax${productCategory.id}`}>
                            <Form.Label>Quantidade máxima</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="0"
                                value={productCategoryItem?.max}
                                onChange={(e) => handleCategory('max', e.target.value)}
                            />
                            <Form.Text className="text-muted text-right">0 para ilimitado.</Form.Text>
                        </Form.Group>
                        <Form.Group md={6} as={Col} controlId={`catProductFormGridRepeat${productCategory.id}`}>
                            <Form.Check
                                type="switch"
                                id={`custom-switch-category-repeat${productCategory.id}`}
                                label="Pode repetir a mesma opção?"
                                checked={canRepeat}
                                onChange={handleCategoryRepeat}
                            />
                        </Form.Group>
                    </Form.Row>

                    <Button
                        variant="outline-danger"
                        className="button-link mb-3"
                        onClick={handleAddAdditional}
                    ><BsPlusSquare /> Adicionar complementos</Button>

                    <Row>
                        <Col>
                            <ListGroup>
                                {
                                    productCategoryItem.productAdditional.map((productAdditional, index) => {
                                        return <ProductAditionalItem
                                            key={index}
                                            productAditional={productAdditional}
                                            idCategory={productCategoryItem.id}
                                        />
                                    })
                                }
                            </ListGroup>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row className='border-top'></Row>
        </>
    )
}

export default ProductCategories;