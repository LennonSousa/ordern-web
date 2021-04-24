import React, { useContext } from 'react';

import { Row, Col, Button, ListGroup, Spinner } from 'react-bootstrap';
import { BsFillPlayFill, BsFillPauseFill, BsFiles, BsPencil } from "react-icons/bs";

import { Context } from '../../context/auth';
import rbac from '../../services/roleBasedAccessControl';
import { Category } from '../Categories';
import { ProductImages } from '../ProductImages';
import { ProductValue } from '../ProductValues';
import { ProductCategory } from '../ProductCategory';
import { ProductAvailable } from '../ProductAvailable';

import './styles.css';

export interface Product {
    id: string;
    title: string;
    description: string;
    images: ProductImages[];
    maiority: boolean;
    code: string;
    price_one: boolean;
    price: number;
    discount: boolean;
    discount_price: number;
    paused: boolean;
    order: number;
    available_all: boolean;
    on_request: boolean;
    category: Category;
    values: ProductValue[];
    categoriesAdditional: ProductCategory[];
    availables: ProductAvailable[];
}

interface ProductProps {
    product: Product;
    handelModalUpdateProduct?: any;
    handlePauseProduct?: any
}

const Products: React.FC<ProductProps> = ({ product, handelModalUpdateProduct, handlePauseProduct }) => {
    const { user } = useContext(Context);
    return (
        <div>
            <ListGroup.Item variant={product.paused !== true ? "light" : "danger"} >
                <Row>
                    <Col><span>{product.title}</span></Col>

                    <Col>
                        <Button
                            variant="outline-danger"
                            className="button-link"
                            onClick={() => handlePauseProduct(product.id)}>
                            {product.paused === true ? (<>Pausado <BsFillPlayFill /></>) : (<>Pausar <BsFillPauseFill /></>)}
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                style={{ display: 'none' }}
                            />
                        </Button>
                    </Col>

                    {
                        user && rbac.can(String(user.type.code)).updateAny('products').granted && <>
                            <Col><a href="/">Duplicar <BsFiles /></a></Col>
                            <Col>
                                <Button variant="outline-danger" className="button-link" onClick={() => handelModalUpdateProduct(product.id)}><BsPencil /> Editar</Button>
                            </Col>
                        </>
                    }
                </Row>
            </ListGroup.Item>
        </div>

    )
}

export default Products;