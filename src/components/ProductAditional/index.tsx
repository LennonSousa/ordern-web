import React, { useContext, useEffect, useState } from 'react';

import { ListGroup, Col, Form, InputGroup, Button, Spinner } from 'react-bootstrap';
import { BsFillTrashFill, BsExclamationOctagon, BsCheck, BsBackspace } from 'react-icons/bs';
import { FaSave } from 'react-icons/fa';

import { Additional } from '../Additionals';
import { ProductCategory } from '../ProductCategory';
import { ContextSelectedProduct } from '../../context/selectedProductContext';
import { maskCurrency } from '../../utils/maskCurrency';



export interface ProductAditional {
    id: number;
    pdv: string;
    price: number;
    order: number;
    additional: Additional;
    categoryAdditional: ProductCategory;
}

interface ProductAditionalProps {
    productAditional: ProductAditional;
    idCategory: number;
}

const ProductAditionalItem: React.FC<ProductAditionalProps> = ({ productAditional, idCategory }) => {
    const {
        selectedProduct,
        listAdditionals,
        handleUpdateSelectedProduct,
        handleTabComplements,
        handleListUpdateProductAdditionals,
        handleListDeleteProductAdditionals
    } = useContext(ContextSelectedProduct);

    const [productAdditionalItem, setProductAdditionalItem] = useState<ProductAditional>(productAditional);

    const [buttonSave, setButtonSave] = useState('none');
    const [buttonCancel, setButtonCancel] = useState('none');

    const [iconSaved, setIconSaved] = useState('none');
    const [iconSave, setIconSave] = useState('inline-block');
    const [loadingSave, setLoadingSave] = useState('none');

    const [buttonDelete, setButtonDelete] = useState('inline-block');
    const [buttonDeleteYes, setButtonDeleteYes] = useState('none');

    useEffect(() => {
        setProductAdditionalItem(productAditional);
    }, [productAditional]);

    function handleAdditional(field: string, value: string) {
        setButtonDelete('none');
        setButtonDeleteYes('none');
        setIconSave('inline-block');
        setButtonSave('inline-block');
        setButtonCancel('inline-block');

        if (field === 'additional') {
            listAdditionals.forEach(additional => {
                if (additional.id === Number(value)) {
                    setProductAdditionalItem({ ...productAdditionalItem, [field]: additional });
                }
            })
        }
        else if (field === 'price') {
            setProductAdditionalItem({ ...productAdditionalItem, price: Number(maskCurrency(value)) });
        }
        else {
            setProductAdditionalItem({ ...productAdditionalItem, [field]: value });
        }

    }

    function handleButtonSave() {
        if (selectedProduct) {
            setButtonCancel('none');
            setIconSave('none');
            setLoadingSave('inline-block');

            handleTabComplements(true);

            if (productAdditionalItem.id !== 0) {
                handleListUpdateProductAdditionals([productAdditionalItem.id]);
            }

            handleUpdateSelectedProduct({
                ...selectedProduct, categoriesAdditional: selectedProduct.categoriesAdditional.map(productCategory => {
                    if (productCategory.id === idCategory && productCategory.order === productAdditionalItem.categoryAdditional.order) {
                        return {
                            ...productCategory, productAdditional: productCategory.productAdditional.map(additional => {
                                if (additional.id === productAdditionalItem.id && additional.order === productAdditionalItem.order) {
                                    return productAdditionalItem;
                                }

                                return additional;
                            })
                        };
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

        setProductAdditionalItem({
            ...productAdditionalItem,
            price: productAditional.price,
            pdv: productAditional.pdv,
            additional: productAditional.additional
        });
    }

    function handleDeleteValue() {
        if (selectedProduct) {
            setButtonDeleteYes('none');
            setButtonCancel('none');
            setButtonDelete('inline-block');

            handleTabComplements(true);
            let listAdditionalsToUpdate: Number[] = [];

            if (productAdditionalItem.id !== 0) {
                handleListDeleteProductAdditionals(productAdditionalItem.id);
            }

            const updatedProductCategories = selectedProduct.categoriesAdditional.map(productCategory => {
                if (productCategory.id === idCategory && productCategory.order === productAdditionalItem.categoryAdditional.order) {
                    const updatedAdditionals = productCategory.productAdditional.filter(item => item !== productAdditionalItem);

                    return {
                        ...productCategory, productAdditional: updatedAdditionals.map((additional, index) => {
                            if (additional.id !== 0) {
                                listAdditionalsToUpdate.push(additional.id);
                            }

                            return { ...additional, order: index };
                        })
                    };
                }

                return productCategory;
            });

            handleUpdateSelectedProduct({ ...selectedProduct, categoriesAdditional: updatedProductCategories });

            handleListUpdateProductAdditionals(listAdditionalsToUpdate);
        }
    }

    return (
        <ListGroup.Item variant={productAdditionalItem.additional.paused !== true ? "light" : "danger"}>
            <Form.Row className="pt-3">
                <Form.Group md={5} as={Col} controlId={`productCatFormGridName${productAdditionalItem.id}`}>
                    <Form.Control
                        as="select"
                        value={productAdditionalItem.additional.id}
                        onChange={(e) => handleAdditional('additional', e.target.value)}
                    >
                        <option hidden>Escolha</option>
                        {
                            listAdditionals && listAdditionals.map(additional => {
                                return <option key={additional.id} value={additional.id}>{additional.title}</option>
                            })
                        }

                    </Form.Control>
                </Form.Group>

                <Form.Group md={2} as={Col} controlId={`productCatFormGridPdv${productAdditionalItem.id}`}>
                    <Form.Control
                        type="text"
                        placeholder="Código PDV"
                        value={productAdditionalItem.pdv}
                        onChange={(e) => handleAdditional('pdv', e.target.value)}
                    />
                </Form.Group>

                <Form.Group md={3} as={Col} controlId={`productCatFormGridPrice${productAdditionalItem.id}`}>
                    <InputGroup className="mb-2">
                        <InputGroup.Prepend>
                            <InputGroup.Text>R$</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            type="text"
                            placeholder="Valor"
                            value={Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(productAdditionalItem.price)}
                            onChange={(e) => handleAdditional('price', e.target.value.replace('.', '').replace(',', '.'))}
                        />
                    </InputGroup>
                </Form.Group>

                <Form.Group md={2} as={Col} controlId={`productCatFormButtonDelete${productAdditionalItem.id}`}>
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
        </ListGroup.Item>
    )
}

export default ProductAditionalItem;