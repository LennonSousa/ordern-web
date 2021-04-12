import React from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';

import { Product } from '../';

interface ProductProps {
    product: Product;
}

const ProductsDnd: React.FC<ProductProps> = ({ product }) => {
    return (
        <div>
            <ListGroup.Item variant={product.paused !== true ? "light" : "danger"} >
                <Row>
                    <Col md={2}><BsList /></Col>
                    <Col md={10}><span>{product.title}</span></Col>
                </Row>
            </ListGroup.Item>
        </div>
    )
}

export default ProductsDnd;