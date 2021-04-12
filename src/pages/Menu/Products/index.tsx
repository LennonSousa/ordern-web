import React, { useState, useEffect, useContext, ChangeEvent, FocusEvent } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import produce from 'immer';
import { Row, Col, Tabs, Tab, Accordion, Card, Image, Button, Modal, Form, ListGroup, Spinner, Alert } from 'react-bootstrap';
import { BsPlusSquare, BsFilterLeft, BsArrowRepeat } from 'react-icons/bs'

import api from '../../../services/api';
import { Context } from '../../../context/auth';
import { CategoriesContext } from '../../../context/categoriesContext';
import rbac from '../../../services/roleBasedAccessControl';

import { Day } from '../../../components/OpenedDays/Days';
import { Category } from '../../../components/Categories';
import { Additional } from '../../../components/Additionals';
import ProductItem, { Product } from '../../../components/Products';
import ProductDndItem from '../../../components/Products/ProductsDnd';
import ProductCategoryItem, { ProductCategory } from '../../../components/ProductCategory';
import ProductCategoryDndItem from '../../../components/ProductCategory/ProductCategoryDnd';
import ProductAdditionalDndItem from '../../../components/ProductAditional/ProductAditionalDnd';
import ProductValueItem, { ProductValue } from '../../../components/ProductValues';
import ProductAvailableItem from '../../../components/ProductAvailable';
import InputMask from '../../../components/InputMask';

import { ContextSelectedProduct } from '../../../context/selectedProductContext';

import { dayOfWeekAsInteger } from '../../../utils/dayOfWeekAsInteger';
import noPhoto from '../../../assets/images/no-photo.jpg';

const ProductsTab: React.FC = () => {
    const { user } = useContext(Context);

    const [keySelectedProduct, setKeySelectedProduct] = useState('');

    const [tabTitleDetails, setTabTitleDetails] = useState('Detalhes');
    const [tabTitleComplements, setTabTitleComplements] = useState('Complementos');
    const [tabTitleAvailables, setTabTitleAvailables] = useState('Disponibilidade');
    const [tabTitleSale, setTabTitleSale] = useState('Promoção');

    const [tabDetails, setTabDetails] = useState(false);
    const [tabComplements, setTabComplements] = useState(false);
    const [tabAvailables, setTabAvailables] = useState(false);
    const [tabSale, setTabSale] = useState(false);

    /* Restaurant Opened Days */
    const [restaurantOpenedDays, setRestaurantOpenedDays] = useState<Day[]>([]);

    /* Categories */
    const { listCategories, handleListCategories } = useContext(CategoriesContext);

    /* Additionals */
    const [listAdditionals, setListAdditionals] = useState<Additional[]>([])

    const [buttonDeleteProduct, setButtonDeleteProduct] = useState('none');
    const [buttonDeleteYesProduct, setButtonDeleteYesProduct] = useState('none');
    const [spinnerDeleteProduct, setSpinnerDeleteProduct] = useState('none');

    /* Produtos */
    const [listSelectedProducts, setListSelectedProducts] = useState<Product[]>();
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [listSelectedProductCategoriesDnd, setListSelectedProductCategoriesDnd] = useState<ProductCategory[] | null>(null);

    const [imagePreview, setImagePreview] = useState('');
    const [imageSelected, setImageSelected] = useState<File>();

    const [fieldProductValue, setFieldProductValue] = useState('inline-block');
    const [buttonAddProductValue, setButtonAddProductValue] = useState('none');

    const [successSaveProduct, setSuccessSaveProduct] = useState(false);
    const [errorSaveProduct, setErrorSaveProduct] = useState(false);

    const [spinnerCreateProduct, setSpinnerCreateProduct] = useState('none');

    /* Products Values */
    const [listProductValues, setListProductValues] = useState<ProductValue[]>([]);
    const [listDeleteProductValues, setListDeleteProductValues] = useState<Number[]>([]);

    /* Modal tab complements product */
    const [showComplementsDnd, setShowComplementsDnd] = useState(false);

    /* Product Categories */
    const [isUpdateAllProductCategories, setIsUpdateAllProductCategories] = useState(false);
    const [listUpdateProductCategories, setListUpdateProductCategories] = useState<Number[]>([]);
    const [listDeleteProductCategories, setListDeleteProductCategories] = useState<Number[]>([]);
    const [categoriesUpdateAllAdditionals, setCategoriesUpdateAllAdditionals] = useState<Number[]>([]);

    /* Product Additionals */
    const [listUpdateProductAdditionals, setListUpdateProductAdditionals] = useState<Number[]>([]);
    const [listDeleteProductAdditionals, setListDeleteProductAdditionals] = useState<Number[]>([]);

    /* Product Availables */


    const [showCreateProduct, setShowCreateProduct] = useState(false);

    const handleCloseCreateProduct = () => setShowCreateProduct(false);

    const handleShowCreateProduct = (categoryId: number) => {
        setSelectedProduct(
            {
                id: 0,
                title: '',
                description: '',
                image: '',
                maiority: false,
                code: '',
                price_one: true,
                price: 0,
                discount: false,
                discount_price: 0.00,
                paused: false,
                order: 0,
                available_all: true,
                on_request: false,
                category: {
                    id: categoryId !== 0 ? categoryId : 0,
                    title: '',
                    paused: false,
                    order: 0,
                    products: []
                },
                values: [],
                categoriesAdditional: [],
                availables: []
            }
        );

        setImagePreview(noPhoto);
        setShowCreateProduct(true);
    }

    const [showUpdateProduct, setShowUpdateProduct] = useState(false);

    const handleCloseUpdateProduct = () => setShowUpdateProduct(false);
    const handleShowUpdateProduct = () => setShowUpdateProduct(true);

    const [showSortProduct, setShowSortProduct] = useState(false);

    const handleCloseSortProduct = () => setShowSortProduct(false);
    const handleShowSortProduct = async (categoryId: number) => {
        if (listCategories) {
            listCategories.forEach(category => {
                if (category.id === categoryId) {
                    setListSelectedProducts(category.products);

                    setShowSortProduct(true);
                }
            })
        }
    }

    useEffect(() => {
        api.get('additionals')
            .then(res => {
                setListAdditionals(res.data);
            })
            .catch(err => {
                console.log('error get additionals');
                console.log(err);
            });

        api.get('restaurant/opened-days')
            .then(res => {
                setRestaurantOpenedDays(res.data);
            })
            .catch(err => {
                console.log('error get restaurant opened days');
                console.log(err);
            });
    }, []);

    useEffect(() => {
        if (selectedProduct && selectedProduct.price_one) {
            setFieldProductValue('inline-block');
            setButtonAddProductValue('none');
        }
        else {
            setFieldProductValue('none');
            setButtonAddProductValue('inline-block');
        }

        selectedProduct && setListSelectedProductCategoriesDnd(selectedProduct.categoriesAdditional);
    }, [selectedProduct]);

    useEffect(() => {
        if (tabDetails) {
            setTabTitleDetails('Detalhes*');
        }

        if (tabComplements) {
            setTabTitleComplements('Complementos*');
        }

        if (tabAvailables) {
            setTabTitleAvailables('Disponibilidade*');
        }

        if (tabSale) {
            setTabTitleSale('Promoção*');
        }

    }, [tabDetails, tabComplements, tabAvailables, tabSale]);

    useEffect(() => {
        setShowComplementsDnd(false);
    }, [keySelectedProduct]);

    function handleUpdateSelectedProduct(product: Product) {
        setSelectedProduct(product);
    }

    function handleTabDetails(updated: boolean) {
        setTabDetails(updated);
    }

    function handleTabComplements(updated: boolean) {
        setTabComplements(updated);
    }

    function handleTabAvailables(updated: boolean) {
        setTabAvailables(updated);
    }

    function handleTabSale(updated: boolean) {
        setTabSale(updated);
    }

    function handleListUpdateProductCategories(id: number) {
        if (!listUpdateProductCategories.find(item => { return item === id })) {
            setListUpdateProductCategories([...listUpdateProductCategories, id]);
        }
    }

    function handleListUpdateProductAdditionals(id: number) {
        if (!listUpdateProductAdditionals.find(item => { return item === id })) {
            setListUpdateProductAdditionals([...listUpdateProductAdditionals, id]);
        }
    }

    function handleListCategoriesUpdateAllAdditionals(id: number) {
        if (!categoriesUpdateAllAdditionals.find(item => { return item === id })) {
            setCategoriesUpdateAllAdditionals([...categoriesUpdateAllAdditionals, id]);
        }
    }

    function handleListDeleteProductCategories(id: number) {
        setListDeleteProductCategories([...listDeleteProductCategories, id]);
    }

    function handleListDeleteProductAdditionals(id: number) {
        setListDeleteProductAdditionals([...listDeleteProductAdditionals, id]);
    }

    async function handleCreateProduct() {
        if (selectedProduct) {
            setSpinnerCreateProduct('inline-block');

            try {
                const data = new FormData();

                data.append('title', selectedProduct.title);
                data.append('description', selectedProduct.description);

                if (imageSelected) {
                    data.append('image', imageSelected);
                }

                data.append('maiority', String(selectedProduct.maiority));
                data.append('code', selectedProduct.code);
                data.append('price_one', String(selectedProduct.price_one));
                data.append('price', String(selectedProduct.price));
                data.append('order', String(selectedProduct.order));
                data.append('category', String(selectedProduct.category.id));

                const response = await api.post('products', data);

                const id = response.data;

                const res = await api.get('categories');

                handleListCategories(res.data);

                setSpinnerCreateProduct('none');
                handleCloseCreateProduct();

                handelModalUpdateProduct(id);
            }
            catch (err) {
                setSpinnerCreateProduct('none');
                handleCloseCreateProduct();

                setErrorSaveProduct(true);

                setTimeout(() => {
                    setErrorSaveProduct(false);
                }, 5000);

                console.log('error post a new product');
                console.log(err);
            }
        }
    }

    function handleSelectImage(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (event.target.files) {
                const image = event.target.files[0];

                setImageSelected(image);
                setImagePreview(URL.createObjectURL(image));
            }
        }
        catch {
        }

    }

    async function handelModalUpdateProduct(productId: number) {
        setSelectedProduct(null);
        setListSelectedProductCategoriesDnd(null);
        setListDeleteProductValues([]);
        setListUpdateProductCategories([]);
        setListDeleteProductCategories([]);
        setListUpdateProductAdditionals([]);
        setListDeleteProductAdditionals([]);

        setTabTitleDetails('Detalhes');
        setTabTitleComplements('Complementos');
        setTabTitleAvailables('Disponibilidade');
        setTabTitleSale('Promoção');

        setTabDetails(false);
        setTabComplements(false);
        setShowComplementsDnd(false);
        setTabAvailables(false);
        setTabSale(false);

        setButtonDeleteYesProduct('none');
        setButtonDeleteProduct('inline-block');
        setImagePreview('');

        handleShowUpdateProduct();

        try {
            const res = await api.get(`products/${productId}`);
            const product: Product = res.data;

            setSelectedProduct(product);

            setListProductValues(product.values);

            if (product.image)
                setImagePreview(product.image);
            else
                setImagePreview(noPhoto);

        }
        catch (err) {
            console.log('error to find product to edit');
            console.log(err);
        }
    }

    async function handleUpdateProduct() {
        if (selectedProduct) {
            setSpinnerCreateProduct('inline-block');

            try {
                const data = new FormData();

                data.append('title', selectedProduct.title);
                data.append('description', selectedProduct.description);

                if (imageSelected) {
                    data.append('image', imageSelected);
                }

                data.append('maiority', String(selectedProduct.maiority));
                data.append('code', selectedProduct.code);
                data.append('price_one', String(selectedProduct.price_one));
                data.append('price', String(selectedProduct.price));
                data.append('order', String(selectedProduct.order));
                data.append('category', String(selectedProduct.category.id));
                data.append('on_request', String(selectedProduct.on_request));

                // Update product details
                if (tabDetails) {
                    listProductValues.forEach(async productValue => {
                        if (productValue.id === 0) {
                            // Create a value for this prodcut
                            await api.post('product/values', productValue);
                        }
                        else {
                            // Update a value for this prodcut
                            await api.put(`product/values/${productValue.id}`, { ...productValue, product: selectedProduct.id });
                        }
                    });

                    listDeleteProductValues.forEach(async idProductValue => {
                        // Delete a value for this prodcut
                        await api.delete(`product/values/${idProductValue}`);
                    });
                }

                if (tabAvailables) {
                    data.append('available_all', String(selectedProduct.available_all));

                    selectedProduct.availables.forEach(async productAvailable => {
                        await api.put(`product/availables/${productAvailable.id}`, { ...productAvailable, product: selectedProduct.id });
                    })
                }

                if (tabSale) {
                    data.append('discount', String(selectedProduct.discount));
                    data.append('discount_price', String(selectedProduct.discount_price));
                }

                await api.put(`products/${selectedProduct.id}`, data);

                // Update product complements
                if (tabComplements) {
                    let updatedListUpdateProductCategories = listUpdateProductCategories;
                    let updatedListDeleteProductAdditionals = listDeleteProductAdditionals;
                    let updatedListUpdateProductAdditionals = listUpdateProductAdditionals;

                    // ***** Deleting *****
                    listDeleteProductCategories.forEach(async idToDeleteProductCategory => {
                        // Delete a category additional for this prodcut
                        await api.delete(`product/categories/${idToDeleteProductCategory}`);

                        // Remove the category from list to update.
                        updatedListUpdateProductCategories = updatedListUpdateProductCategories.filter(item => item !== idToDeleteProductCategory);

                        // We can't delete or update a additional from a deleted Category
                        const deletedProductCategory = selectedProduct.categoriesAdditional.find(productCategory => {
                            return productCategory.id === idToDeleteProductCategory;
                        });

                        if (deletedProductCategory) {
                            deletedProductCategory.productAdditional.forEach(productAdditional => {
                                if (updatedListDeleteProductAdditionals.find(idProductAdditionalToDelete => { return productAdditional.id === idProductAdditionalToDelete })) {
                                    updatedListDeleteProductAdditionals = updatedListDeleteProductAdditionals.filter(item => item !== productAdditional.id);
                                }

                                if (listUpdateProductAdditionals.find(idProductAdditionalToUpdate => { return productAdditional.id === idProductAdditionalToUpdate })) {
                                    updatedListUpdateProductAdditionals = listUpdateProductAdditionals.filter(item => item !== productAdditional.id);
                                }
                            });
                        }
                    });

                    updatedListDeleteProductAdditionals.forEach(async idProductAdditional => {
                        // Delete a additional for this prodcut
                        await api.delete(`product/additionals/${idProductAdditional}`);
                    });

                    // ***** Creating *****
                    selectedProduct.categoriesAdditional.forEach(async productCategory => {
                        if (productCategory.id === 0) {
                            // Create a category for this prodcut
                            const response = await api.post('product/categories', productCategory);

                            const { id } = response.data;

                            // Creating additionals for this category
                            productCategory.productAdditional.forEach(async productAdditional => {
                                await api.post('product/additionals', {
                                    ...productAdditional,
                                    additional: productAdditional.additional.id,
                                    categoryAdditional: id
                                });
                            });
                        }
                        else {
                            productCategory.productAdditional.forEach(async productAdditional => {
                                if (productAdditional.id === 0) {
                                    await api.post('product/additionals', {
                                        ...productAdditional,
                                        additional: productAdditional.additional.id,
                                        categoryAdditional: productCategory.id
                                    });
                                }
                            });
                        }
                    });

                    // ***** Updating *****
                    if (!isUpdateAllProductCategories) {
                        updatedListUpdateProductCategories.forEach(async idProductCategoryToUpdate => {
                            // Update a category for this prodcut
                            const productCategoryToUpdate = selectedProduct.categoriesAdditional.find(productCategory => {
                                return productCategory.id === idProductCategoryToUpdate;
                            });

                            if (productCategoryToUpdate) {
                                await api.put(`product/categories/${productCategoryToUpdate.id}`, { ...productCategoryToUpdate, product: selectedProduct.id });
                            }
                        });
                    }
                    else {
                        selectedProduct.categoriesAdditional.forEach(async (categoryToUpdate, index) => {
                            // Update a category for this prodcut
                            await api.put(`product/categories/${categoryToUpdate.id}`, { ...categoryToUpdate, order: index, product: selectedProduct.id });
                        });
                    }

                    selectedProduct.categoriesAdditional.forEach(prdoductCategory => {
                        prdoductCategory.productAdditional.forEach(async productAdditional => {
                            if (updatedListUpdateProductAdditionals.find(idProductAdditionalToUpdate => { return productAdditional.id === idProductAdditionalToUpdate })) {
                                await api.put(`product/additionals/${productAdditional.id}`, {
                                    ...productAdditional,
                                    additional: productAdditional.additional.id,
                                    categoryAdditional: productAdditional.categoryAdditional.id
                                });
                            }
                        })
                    });
                }

                api.get('categories')
                    .then(res => {
                        handleListCategories(res.data);
                    })
                    .catch(err => {
                        console.log('error get categories');
                        console.log(err);
                    });

                setSpinnerCreateProduct('none');
                handleCloseUpdateProduct();

                setSuccessSaveProduct(true);

                setTimeout(() => {
                    setSuccessSaveProduct(false);
                }, 5000);
            }
            catch (err) {
                setSpinnerCreateProduct('none');
                handleCloseUpdateProduct();

                setErrorSaveProduct(true);

                setTimeout(() => {
                    setErrorSaveProduct(false);
                }, 5000);

                console.log('error post a new product');
                console.log(err);
            }
        }
    }

    function handlePauseProduct(productId: number) {
        try {
            listCategories && listCategories.forEach(category => {
                category.products.forEach(product => {
                    if (product.id === productId) {
                        api.put(`products/${productId}`, {
                            id: product.id,
                            title: product.title,
                            maiority: product.maiority,
                            price_one: product.price_one,
                            price: product.price,
                            paused: !product.paused,
                            order: product.order,
                            category: category.id
                        }).then(() => {
                            api.get('categories').then(res => {
                                handleListCategories(res.data);
                            })
                        })
                    }
                });
            });
        }
        catch (err) {
            console.log('error post a product paused');
            console.log(err);
        }

    }

    function handleButtonsDeleteProduct() {
        setButtonDeleteProduct('none');
        setButtonDeleteYesProduct('inline-block');
    }

    async function handleDeleteProduct() {
        if (selectedProduct) {
            setSpinnerDeleteProduct('inline-block');

            try {

                if (listSelectedProducts) {
                    await api.delete(`products/${selectedProduct.id}`);

                    const list = listSelectedProducts.filter(item => { return item.id !== selectedProduct.id });

                    list.forEach(async (product, index) => {
                        try {
                            await api.put(`products/${product.id}`, {
                                title: product.title,
                                paused: product.paused,
                                order: index
                            });
                        }
                        catch (err) {
                            console.log('error to save categories order after deleting.');
                            console.log(err)
                        }
                    });

                    const res = await api.get('categories');

                    handleListCategories(res.data);
                }

                setSpinnerDeleteProduct('none');
                handleCloseUpdateProduct();

                setSuccessSaveProduct(true);

                setTimeout(() => {
                    setSuccessSaveProduct(false);
                }, 5000);
            }
            catch (err) {
                setSpinnerDeleteProduct('none');
                handleCloseUpdateProduct();

                setErrorSaveProduct(true);

                setTimeout(() => {
                    setErrorSaveProduct(false);
                }, 5000);

                console.log('error deleting a product');
                console.log(err);
            }
        }
    }

    /* Sort products */
    function handleOnDragEnd(result: DropResult) {
        if (result.destination) {
            const from = result.source.index;
            const to = result.destination.index;

            const updatedListProducts = produce(listSelectedProducts, draft => {
                if (draft) {
                    const dragged = draft[from];

                    draft.splice(from, 1);
                    draft.splice(to, 0, dragged);
                }
            });

            if (updatedListProducts) setListSelectedProducts(updatedListProducts);
        }
    }

    async function saveOrder(list: Product[]) {
        setSpinnerCreateProduct('inline-block');

        list.forEach(async (product, index) => {
            try {
                await api.put(`products/${product.id}`, {
                    title: product.title,
                    maiority: product.maiority,
                    price_one: product.price_one,
                    price: product.price,
                    order: index,
                    category: product.category.id
                });

                const res = await api.get('categories');

                handleListCategories(res.data);

                setSpinnerCreateProduct('none');
                handleCloseSortProduct();

                setSuccessSaveProduct(true);

                setTimeout(() => {
                    setSuccessSaveProduct(false);
                }, 5000);
            }
            catch (err) {
                setSpinnerCreateProduct('none');
                handleCloseSortProduct();
                setErrorSaveProduct(true);

                console.log(err);

                setTimeout(() => {
                    setErrorSaveProduct(false);
                }, 5000);

                console.log('error to save products order');
                console.log(err)
            }
        });
    }

    async function handleAddProductValue() {
        handleTabDetails(true);

        const updatedProductValues = listProductValues.map((productValue, index) => {
            return { ...productValue, order: index };
        });

        if (selectedProduct) {
            setListProductValues(() => ([
                ...updatedProductValues, {
                    id: 0,
                    description: '',
                    value: 0,
                    order: listProductValues.length,
                    product: selectedProduct.id
                }
            ]));
        }

        console.log(listProductValues);
    }

    function handleUpdateProductValue(productValue: ProductValue) {
        handleTabDetails(true);

        const updatedProductValues = listProductValues.map((productValueItem) => {
            if (productValueItem.id === productValue.id && productValueItem.order === productValue.order) {
                return productValue;
            }

            return productValueItem;
        });

        setListProductValues(() => (updatedProductValues));
    }

    async function handleDeleteProductValue(productValue: ProductValue) {
        handleTabDetails(true);

        setListDeleteProductValues([...listDeleteProductValues, productValue.id]);

        let updatedProductValues = listProductValues.filter(item => item !== productValue);

        setListProductValues(updatedProductValues.map((productValue, index) => {
            return { ...productValue, order: index };
        }));
    }

    // Product Category Additionals
    function handleAddProductCategory() {
        if (selectedProduct) {
            handleTabComplements(true);

            const updatedcategoriesAdditional = selectedProduct.categoriesAdditional.map((categoryAdditionals, index) => {
                return { ...categoryAdditionals, order: index };
            });

            console.log(updatedcategoriesAdditional);

            setSelectedProduct({
                ...selectedProduct, categoriesAdditional: [...updatedcategoriesAdditional, {
                    id: 0,
                    title: '',
                    min: 0,
                    max: 0,
                    repeat: true,
                    order: updatedcategoriesAdditional.length,
                    productAdditional: [],
                    product: selectedProduct.id
                }]
            });
        }
    }

    /* Sort product categories additional */
    function handleOnDragEndProductCategory(result: DropResult) {
        if (result.destination) {
            const from = result.source.index;
            const to = result.destination.index;

            const updatedListProductCategories = produce(listSelectedProductCategoriesDnd, draft => {
                if (draft) {
                    const dragged = draft[from];

                    draft.splice(from, 1);
                    draft.splice(to, 0, dragged);

                    // Need to save all product categories...
                }
            });

            if (updatedListProductCategories) {
                setListSelectedProductCategoriesDnd(updatedListProductCategories);
                setIsUpdateAllProductCategories(true);
            }
        }
    }

    /* Sort product additionals */
    function handleOnDragEndProductAdditionals(result: DropResult, idCategory: number) {
        if (result.destination) {
            const from = result.source.index;
            const to = result.destination.index;

            const updatedListProductCategories = produce(listSelectedProductCategoriesDnd, draft => {
                if (draft) {
                    const categoriesUpdated = draft.map(productCategory => {
                        if (productCategory.id === idCategory) {
                            const dragged = productCategory.productAdditional[from];

                            productCategory.productAdditional.splice(from, 1);
                            productCategory.productAdditional.splice(to, 0, dragged);

                            const idsToUpdate = listUpdateProductAdditionals;

                            productCategory.productAdditional.forEach(productAdditionalItem => {
                                if (!listUpdateProductAdditionals.find(item => { return item === productAdditionalItem.id })) {
                                    idsToUpdate.push(productAdditionalItem.id);
                                }
                            });

                            if (idsToUpdate) {
                                setListUpdateProductAdditionals(idsToUpdate);
                            }

                            return productCategory;
                        }

                        return productCategory;
                    });

                    draft = categoriesUpdated;
                }
            });

            if (updatedListProductCategories) setListSelectedProductCategoriesDnd(updatedListProductCategories);
        }
    }

    function saveOrderListProductCategoriesDnd() {
        if (selectedProduct && listSelectedProductCategoriesDnd) {
            setSelectedProduct({ ...selectedProduct, categoriesAdditional: listSelectedProductCategoriesDnd });

            setTabComplements(true);
            setShowComplementsDnd(false);
        }
    }

    /* Product Availables */
    function handleSwitchProductAvailable(idAvailable: number) {
        if (selectedProduct) {
            handleTabAvailables(true);

            const updatedProductAvailables = selectedProduct.availables.map((productAvailable) => {
                if (productAvailable.id === idAvailable) {
                    return { ...productAvailable, available: !productAvailable.available };
                }

                return productAvailable;
            });

            setSelectedProduct({ ...selectedProduct, availables: updatedProductAvailables });
        }
    }

    /* Product Promotion */
    function handleProductDiscount(field: string, value: string) {
        if (selectedProduct) {
            if (field === 'discount') {
                setSelectedProduct({ ...selectedProduct, [field]: !selectedProduct.discount });
                handleTabSale(true);
            }
            else if (field === 'discount_price') {
                console.log(Number(value.replace(".", "").replace(",", ".")));
                setSelectedProduct({ ...selectedProduct, [field]: Number(value.replace(".", "").replace(",", ".")) });
                handleTabSale(true);
            }
        }
    }

    return (
        <ContextSelectedProduct.Provider value={{
            selectedProduct,
            listAdditionals,
            handleUpdateSelectedProduct,
            handleTabDetails,
            handleTabComplements,
            handleTabAvailables,
            handleTabSale,
            handleListUpdateProductCategories,
            handleListUpdateProductAdditionals,
            handleListDeleteProductCategories,
            handleListDeleteProductAdditionals
        }}>
            <div className="mb-5">
                <section className="mt-3">
                    <Row>
                        <Col>
                            <Alert variant="success"
                                dismissible
                                show={successSaveProduct}>
                                Sucesso! As informações foram salvas.
                            </Alert>

                            <Alert variant="danger"
                                dismissible
                                show={errorSaveProduct}>
                                Algo deu errado! As informações não foram salvas.
                            </Alert>
                        </Col>
                    </Row>
                </section>

                {
                    user && rbac.can(String(user.type.code)).createAny('products').granted && <section className="mt-3">
                        <Row>
                            <Col>
                                <Button variant="danger" onClick={() => { handleShowCreateProduct(0) }} >Criar produto</Button>
                            </Col>
                        </Row>
                    </section>
                }

                <article className="mt-3">
                    <Accordion>
                        {
                            listCategories && listCategories.map((category: Category, index) => {
                                return <Card key={index}>
                                    <Card.Header>
                                        <Row>
                                            <Col md={6}>
                                                <Accordion.Toggle
                                                    as={Button}
                                                    variant="link"
                                                    eventKey={category.id.toString()}>
                                                    {category.title}
                                                </Accordion.Toggle>
                                            </Col>

                                            {
                                                user && rbac.can(String(user.type.code)).createAny('products').granted && <>
                                                    <Col md={3}>
                                                        <Button
                                                            variant="outline-danger"
                                                            className="button-link"
                                                            onClick={() => handleShowCreateProduct(category.id)}
                                                        >
                                                            <BsPlusSquare /> Adicionar produto
                                                    </Button>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Button
                                                            variant="outline-danger"
                                                            className="button-link"
                                                            onClick={() => handleShowSortProduct(category.id)}
                                                        >
                                                            <BsFilterLeft /> Reordenar itens
                                                    </Button>
                                                    </Col>
                                                </>
                                            }
                                        </Row>
                                    </Card.Header>
                                    <Accordion.Collapse eventKey={category.id.toString()}>
                                        <Card.Body>
                                            <Row>
                                                <Col>
                                                    <ListGroup>
                                                        {
                                                            category.products && category.products.map((product: Product, index) => {
                                                                return <ProductItem
                                                                    key={index}
                                                                    product={product}
                                                                    handelModalUpdateProduct={handelModalUpdateProduct}
                                                                    handlePauseProduct={handlePauseProduct}
                                                                />
                                                            })
                                                        }
                                                    </ListGroup>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Accordion.Collapse>
                                </Card>
                            })
                        }
                    </Accordion>
                </article>

                {/* Modal novo produto */}
                <Modal size="lg" show={showCreateProduct} onHide={handleCloseCreateProduct}>
                    <Modal.Header closeButton>
                        <Modal.Title>Criar um produto.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col>
                                <form>
                                    <Form.Group>
                                        <Row className="align-items-end">
                                            <Col md={3} sm={1}>
                                                <Image src={imagePreview} rounded fluid thumbnail />
                                            </Col>
                                            <Col>
                                                <Form.File id="procuctImageFile" onChange={handleSelectImage} label="Escolher imagem" />
                                            </Col>
                                        </Row>
                                    </Form.Group>

                                    <Form.Row>
                                        <Form.Group as={Col} controlId="newProductFormGridName">
                                            <Form.Label>Título</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Ex: Pizzas"
                                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                    if (selectedProduct) {
                                                        setSelectedProduct({ ...selectedProduct, title: e.target.value })
                                                    }
                                                }}
                                            />
                                            <Form.Text className="text-muted text-right">1/25 caracteres.</Form.Text>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="newProductFormGridCategory">
                                            <Form.Label>Categoria</Form.Label>
                                            <Form.Control
                                                as="select"
                                                value={selectedProduct?.category.id}
                                                onChange={(e) => {
                                                    if (selectedProduct) {
                                                        setSelectedProduct({ ...selectedProduct, category: { ...selectedProduct.category, id: Number(e.target.value) } })
                                                    }
                                                }}
                                            >
                                                <option hidden>Escolha</option>
                                                {
                                                    listCategories && listCategories.map((category: Category) => {
                                                        return <option key={category.id} value={category.id}>{category.title}</option>
                                                    })
                                                }

                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} controlId="newProductFormGridMaiority">
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch-maiority"
                                                label="Produto +18"
                                                onChange={() => {
                                                    if (selectedProduct) {
                                                        setSelectedProduct({ ...selectedProduct, maiority: !selectedProduct.maiority })
                                                    }
                                                }}
                                            />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="newProductFormGridPdv">
                                            <Form.Control
                                                type="text"
                                                placeholder="Código PDV (opcional)"
                                            />
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Group controlId="newProductFormGridDescription">
                                        <Form.Label>Descrição</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            onBlur={(e: FocusEvent<HTMLTextAreaElement>) => {
                                                if (selectedProduct) {
                                                    setSelectedProduct({ ...selectedProduct, description: e.target.value })
                                                }
                                            }}
                                        />
                                        <Form.Text className="text-muted text-right">1/250 caracteres.</Form.Text>
                                    </Form.Group>
                                </form>
                            </Col>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-danger" onClick={handleCloseCreateProduct}>
                            Cancelar
                    </Button>

                        <Button variant="danger"
                            onClick={() => { handleCreateProduct() }}>
                            Avançar{' '}
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                style={{ display: spinnerCreateProduct }}
                            />
                        </Button>
                    </Modal.Footer>
                </Modal>

                {/* Modal editar produto */}
                <Modal size="lg" show={showUpdateProduct} onHide={handleCloseUpdateProduct} >
                    <Modal.Header closeButton>
                        <Modal.Title>Editar produto</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Tabs
                            className="mt-3 mb-3"
                            defaultActiveKey="details"
                            id="tab-selected-product"
                            onSelect={(k) => k && setKeySelectedProduct(k)}
                        >
                            <Tab eventKey="details" title={tabTitleDetails}>
                                <Row className="mb-3">
                                    <Col>
                                        <form>
                                            <Form.Group>
                                                <Row className="align-items-end">
                                                    <Col md={3} sm={1}>
                                                        <Image src={imagePreview} rounded fluid thumbnail />
                                                    </Col>
                                                    <Col>
                                                        <Form.File id="procuctImageFile" onChange={handleSelectImage} label="Escolher imagem" />
                                                    </Col>
                                                </Row>
                                            </Form.Group>

                                            <Form.Row>
                                                <Form.Group as={Col} controlId={`ProductFormGridName${selectedProduct?.id}`}>
                                                    <Form.Label>Nome</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Ex: Pizzas"
                                                        defaultValue={selectedProduct?.title}
                                                        onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                            if (selectedProduct) {
                                                                setSelectedProduct({ ...selectedProduct, title: e.target.value })
                                                            }
                                                        }}
                                                    />
                                                    <Form.Text className="text-muted text-right">1/25 caracteres.</Form.Text>
                                                </Form.Group>

                                                <Form.Group as={Col} controlId={`ProductFormGridCategory${selectedProduct?.id}`}>
                                                    <Form.Label>Categoria</Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        value={selectedProduct?.category.id}
                                                        onChange={(e) => {
                                                            if (selectedProduct) {
                                                                setSelectedProduct({ ...selectedProduct, category: { ...selectedProduct.category, id: Number(e.target.value) } })
                                                            }
                                                        }}
                                                    >
                                                        {
                                                            listCategories && listCategories.map((category: Category) => {
                                                                return <option key={category.id} value={category.id} >{category.title}</option>
                                                            })
                                                        }

                                                    </Form.Control>
                                                </Form.Group>
                                            </Form.Row>

                                            <Form.Row>
                                                <Form.Group as={Col} controlId={`ProductFormGridMaiority${selectedProduct?.id}`}>
                                                    <Form.Check
                                                        type="switch"
                                                        id="custom-switch-maiority"
                                                        label="Produto +18"
                                                        checked={selectedProduct?.maiority}
                                                        onChange={() => {
                                                            if (selectedProduct) {
                                                                setSelectedProduct({ ...selectedProduct, maiority: !selectedProduct.maiority })
                                                            }
                                                        }}
                                                    />
                                                </Form.Group>

                                                <Form.Group as={Col} controlId={`ProductFormGridPdv${selectedProduct?.id}`}>
                                                    <Form.Control
                                                        type="text"
                                                        placeholder="Código PDV (opcional)"
                                                        defaultValue={selectedProduct?.code}
                                                        onBlur={(e: any) => {
                                                            if (selectedProduct) {
                                                                setSelectedProduct({ ...selectedProduct, code: e.target.value })
                                                            }
                                                        }}
                                                    />
                                                </Form.Group>
                                            </Form.Row>

                                            <Form.Group controlId={`ProductFormGridDescription${selectedProduct?.id}`}>
                                                <Form.Label>Descrição</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    rows={3}
                                                    defaultValue={selectedProduct?.description}
                                                    onBlur={(e: FocusEvent<HTMLTextAreaElement>) => {
                                                        if (selectedProduct) {
                                                            setSelectedProduct({ ...selectedProduct, description: e.target.value })
                                                        }
                                                    }}
                                                />
                                                <Form.Text className="text-muted text-right">1/250 caracteres.</Form.Text>
                                            </Form.Group>

                                            <Form.Group>
                                                <Row>
                                                    <Col md={4} sm={1}>
                                                        <Form.Check
                                                            type="switch"
                                                            id="custom-switch-price-one"
                                                            label="Preço único"
                                                            checked={selectedProduct?.price_one}
                                                            onChange={() => {
                                                                if (selectedProduct) {
                                                                    setSelectedProduct({ ...selectedProduct, price_one: !selectedProduct.price_one })
                                                                }
                                                            }}
                                                        />
                                                    </Col>

                                                    <Col md={4} sm={1} style={{ display: fieldProductValue }}>
                                                        {
                                                            selectedProduct && <InputMask
                                                                mask="currency"
                                                                prefix="R$"
                                                                defaultValue={Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(selectedProduct.price)}
                                                                onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
                                                                    if (selectedProduct) {
                                                                        setSelectedProduct({ ...selectedProduct, price: Number(e.target.value.replace(".", "").replace(",", ".")) })
                                                                    }
                                                                }}
                                                            />
                                                        }
                                                    </Col>

                                                    <Col md={4} sm={1} style={{ display: buttonAddProductValue }}>
                                                        <Button variant="outline-danger" onClick={handleAddProductValue}>
                                                            <BsPlusSquare /> Adicionar valor
                                                            </Button>
                                                    </Col>

                                                    <Col md={4} sm={1}>
                                                        <Form.Check
                                                            type="switch"
                                                            id="custom-switch-on_request"
                                                            label="Preço sob consulta"
                                                            checked={selectedProduct?.on_request}
                                                            onChange={() => {
                                                                if (selectedProduct) {
                                                                    setSelectedProduct({ ...selectedProduct, on_request: !selectedProduct.on_request })
                                                                }
                                                            }}
                                                        />
                                                    </Col>
                                                </Row>
                                            </Form.Group>

                                            {
                                                buttonAddProductValue === 'inline-block' && listProductValues && listProductValues.map((productValue, index) => {
                                                    return <ProductValueItem
                                                        key={index}
                                                        productValue={productValue}
                                                        handleUpdateProductValue={handleUpdateProductValue}
                                                        handleDeleteProductValue={handleDeleteProductValue}
                                                    />
                                                })
                                            }
                                        </form>
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="complements" title={tabTitleComplements}>
                                {
                                    !showComplementsDnd ? <>
                                        <Row className="mb-3">
                                            <Col>
                                                <Button
                                                    variant="outline-danger"
                                                    className="button-link"
                                                    onClick={handleAddProductCategory}
                                                >
                                                    <BsPlusSquare /> Adicionar categoria
                                                    </Button>
                                            </Col>
                                            <Col>
                                                <Button
                                                    variant="outline-danger"
                                                    className="button-link"
                                                    onClick={() => setShowComplementsDnd(!showComplementsDnd)}
                                                >
                                                    <BsFilterLeft /> Reordenar itens
                                                    </Button>
                                            </Col>
                                            <Col>
                                                <Button
                                                    variant="outline-danger"
                                                    className="button-link"
                                                    style={{ display: 'none' }}
                                                >
                                                    <BsArrowRepeat /> Usar de outro produto
                                                    </Button>
                                            </Col>
                                        </Row>
                                        <form>
                                            {
                                                selectedProduct && selectedProduct.categoriesAdditional.map((productCategory, index) => {
                                                    return <ProductCategoryItem
                                                        key={index}
                                                        productCategory={productCategory}
                                                    />
                                                })
                                            }
                                        </form>
                                    </> : <Tab.Container id="list-group-tabs-order-complements">
                                        <Row>
                                            <Col>
                                                <span>Categorias</span>
                                                <DragDropContext onDragEnd={handleOnDragEndProductCategory}>
                                                    <Droppable droppableId="product-categories">
                                                        {provided => (
                                                            <div
                                                                {...provided.droppableProps}
                                                                ref={provided.innerRef}
                                                            >
                                                                <ListGroup className="mt-2">
                                                                    {
                                                                        listSelectedProductCategoriesDnd && listSelectedProductCategoriesDnd.map((productCategory, index) => {
                                                                            return <Draggable
                                                                                key={productCategory.id}
                                                                                draggableId={String(productCategory.id)}
                                                                                index={index}
                                                                            >
                                                                                {provided => (
                                                                                    <div
                                                                                        {...provided.draggableProps}
                                                                                        {...provided.dragHandleProps}
                                                                                        ref={provided.innerRef}
                                                                                    >
                                                                                        <ProductCategoryDndItem productCategory={productCategory} />
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

                                            <Col>
                                                <span>Adicionais</span>
                                                <Tab.Content className="mt-2">
                                                    {
                                                        listSelectedProductCategoriesDnd && listSelectedProductCategoriesDnd.map((productCategory) => {
                                                            return <Tab.Pane key={productCategory.id} eventKey={`#${productCategory.id}`}>
                                                                <DragDropContext onDragEnd={(result) => { handleOnDragEndProductAdditionals(result, productCategory.id) }}>
                                                                    <Droppable droppableId={`product-additional-${productCategory.id}`}>
                                                                        {provided => (
                                                                            <div
                                                                                {...provided.droppableProps}
                                                                                ref={provided.innerRef}
                                                                            >
                                                                                {
                                                                                    productCategory.productAdditional.map((productAdditional, index) => {
                                                                                        return <Draggable key={productAdditional.id} draggableId={String(productAdditional.id)} index={index}>
                                                                                            {provided => (
                                                                                                <div
                                                                                                    {...provided.draggableProps}
                                                                                                    {...provided.dragHandleProps}
                                                                                                    ref={provided.innerRef}
                                                                                                >

                                                                                                    <ProductAdditionalDndItem key={productAdditional.id} productAdditional={productAdditional} />

                                                                                                </div>
                                                                                            )}
                                                                                        </Draggable>
                                                                                    })
                                                                                }
                                                                                {provided.placeholder}
                                                                            </div>
                                                                        )}
                                                                    </Droppable>
                                                                </DragDropContext>
                                                            </Tab.Pane>
                                                        })
                                                    }
                                                </Tab.Content>
                                            </Col>
                                        </Row>
                                    </Tab.Container>
                                }
                            </Tab>

                            <Tab className="mb-3" eventKey="availables" title={tabTitleAvailables}>
                                <Form>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId={`availableFormGridAll${selectedProduct?.id}`}>
                                                <div className='custom-control custom-switch'>
                                                    <input
                                                        type='checkbox'
                                                        className='custom-control-input'
                                                        id='availableFormSwitchAll'
                                                        checked={selectedProduct?.available_all}
                                                        onChange={() => {
                                                            if (selectedProduct) {
                                                                handleTabAvailables(true);
                                                                setSelectedProduct({ ...selectedProduct, available_all: !selectedProduct.available_all });
                                                            }
                                                        }}
                                                    />
                                                    <label className='custom-control-label' htmlFor='availableFormSwitchAll'>Disponível em todos os dias da loja.</label>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    {
                                        selectedProduct && !selectedProduct.available_all && <>
                                            <Row className='mb-3'>
                                                {
                                                    restaurantOpenedDays && restaurantOpenedDays.map(openedDay => {
                                                        const productAvailable = selectedProduct.availables.find(item => { return item.week_day === openedDay.week_day });

                                                        return openedDay.opened && productAvailable && <Col key={openedDay.id}>
                                                            <div className='custom-control custom-switch'>
                                                                <input
                                                                    type='checkbox'
                                                                    className='custom-control-input'
                                                                    id={`availableSwitch${openedDay.week_day}`}
                                                                    checked={productAvailable.available}
                                                                    onChange={() => { handleSwitchProductAvailable(productAvailable.id) }}
                                                                />
                                                                <label
                                                                    className='custom-control-label'
                                                                    htmlFor={`availableSwitch${openedDay.week_day}`}
                                                                >
                                                                    {dayOfWeekAsInteger(openedDay.week_day)}
                                                                </label>
                                                            </div>
                                                        </Col>
                                                    })
                                                }
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <Tabs id="availableTab">
                                                        {
                                                            restaurantOpenedDays && restaurantOpenedDays.map(openedDay => {
                                                                const productAvailable = selectedProduct.availables.find(item => { return item.week_day === openedDay.week_day });

                                                                return openedDay.opened && productAvailable && productAvailable.available && <Tab
                                                                    key={productAvailable.id}
                                                                    eventKey={String(productAvailable.week_day)}
                                                                    title={dayOfWeekAsInteger(productAvailable.week_day)}
                                                                >
                                                                    <ProductAvailableItem productAvailable={productAvailable} />
                                                                </Tab>
                                                            })
                                                        }
                                                    </Tabs>
                                                </Col>
                                            </Row>
                                        </>
                                    }
                                </Form>
                            </Tab>
                            <Tab eventKey="sale" title={tabTitleSale}>
                                <Form>
                                    <Row className="align-items-center">
                                        <Col sm={5}>
                                            <Form.Group className="text-center" controlId="saleFormGridAll">
                                                <div className='custom-control custom-switch'>
                                                    <input
                                                        type='checkbox'
                                                        className='custom-control-input'
                                                        id='saleFormSwitch'
                                                        checked={selectedProduct?.discount}
                                                        onChange={() => { handleProductDiscount('discount', '') }}
                                                    />
                                                    <label className='custom-control-label' htmlFor='saleFormSwitch'>Ativar promoção</label>
                                                </div>
                                            </Form.Group>
                                        </Col>
                                        {
                                            selectedProduct && selectedProduct.discount && <Col className="text-right" sm={7}>
                                                <Form.Group as={Row} controlId={`saleFormHorizontalOldPrice${selectedProduct?.id}`}>
                                                    <Form.Label column sm={6}>Valor original:</Form.Label>
                                                    <Col sm={4}>
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="R$ 0,00"
                                                            readOnly
                                                            defaultValue={Intl.NumberFormat(
                                                                'pt-BR',
                                                                { style: 'currency', currency: 'BRL' }
                                                            ).format(selectedProduct.price)}
                                                        />
                                                    </Col>
                                                </Form.Group>
                                                <Form.Group as={Row} controlId={`saleFormHorizontalNewPrice${selectedProduct?.id}`}>
                                                    <Form.Label column sm={6}>Valor promocional:</Form.Label>
                                                    <Col sm={4}>
                                                        <InputMask
                                                            mask="currency"
                                                            prefix="R$"
                                                            defaultValue={Intl.NumberFormat(
                                                                'pt-BR',
                                                                { style: 'currency', currency: 'BRL' }
                                                            ).format(selectedProduct.discount_price).replace("R$ ", "")}
                                                            onBlur={(e) => { handleProductDiscount('discount_price', e.target.value) }}
                                                        />
                                                    </Col>
                                                </Form.Group>
                                            </Col>
                                        }
                                    </Row>
                                </Form>
                            </Tab>
                        </Tabs>
                    </Modal.Body>

                    {
                        !showComplementsDnd ? <Modal.Footer>
                            <Button variant="outline-danger" onClick={handleCloseUpdateProduct}>
                                Cancelar
                                </Button>

                            <Button
                                variant="danger"
                                onClick={() => { handleButtonsDeleteProduct() }}
                                style={{ display: buttonDeleteProduct }}
                            >Excluir
                                </Button>

                            <Button variant="warning"
                                style={{ display: buttonDeleteYesProduct }}
                                onClick={() => { handleDeleteProduct() }}
                            >
                                Confirmar{' '}
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ display: spinnerDeleteProduct }}
                                />
                            </Button>

                            <Button variant="danger"
                                onClick={() => { handleUpdateProduct() }}>
                                Salvar{' '}
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                    style={{ display: spinnerCreateProduct }}
                                />
                            </Button>
                        </Modal.Footer> : <Modal.Footer>
                            <Button variant="outline-danger" onClick={() => {
                                setShowComplementsDnd(!showComplementsDnd);
                                selectedProduct && setListSelectedProductCategoriesDnd(selectedProduct.categoriesAdditional);
                            }}
                            >
                                Cancelar
                            </Button>

                            <Button variant="danger" onClick={saveOrderListProductCategoriesDnd} >
                                Aplicar
                            </Button>
                        </Modal.Footer>
                    }
                </Modal>

                {/* Modal reordenar produtos */}
                <Modal show={showSortProduct} onHide={handleCloseSortProduct}>
                    <Modal.Header closeButton>
                        <Modal.Title>Reordenar a lista de produtos.</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="mb-3">
                            <Col>
                                <DragDropContext onDragEnd={handleOnDragEnd}>
                                    <Droppable droppableId="products">
                                        {provided => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                            >
                                                <ListGroup>
                                                    {
                                                        listSelectedProducts && listSelectedProducts.map((product, index) => {
                                                            return <Draggable key={product.id} draggableId={String(product.id)} index={index}>
                                                                {provided => (
                                                                    <div
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                        ref={provided.innerRef}
                                                                    >
                                                                        <ProductDndItem product={product} />
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
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="outline-danger" onClick={handleCloseSortProduct}>
                            Cancelar
                    </Button>

                        <Button variant="danger"
                            onClick={() => { listSelectedProducts && saveOrder(listSelectedProducts) }}>
                            Salvar{' '}
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                style={{ display: spinnerCreateProduct }}
                            />
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div >
        </ContextSelectedProduct.Provider >
    )
};

export default ProductsTab;