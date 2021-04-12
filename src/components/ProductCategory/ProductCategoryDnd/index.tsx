import React from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';

import { ProductCategory } from '../';

interface ProductCategoryProps {
    productCategory: ProductCategory;
}

const ProductCategoryDnd: React.FC<ProductCategoryProps> = ({ productCategory }) => {
    return (
        <div>
            <ListGroup.Item eventKey={`#${productCategory.id}`}>
                <Row>
                    <Col md={2}><BsList /></Col>
                    <Col md={10}><span>{productCategory.title}</span></Col>
                </Row>
            </ListGroup.Item>
        </div>
    )
}

export default ProductCategoryDnd;