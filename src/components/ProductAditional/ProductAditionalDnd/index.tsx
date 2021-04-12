import React from 'react';
import { Row, Col, ListGroup } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';

import { ProductAditional } from '../';

interface ProductCategoryProps {
    productAdditional: ProductAditional;
}

const ProductCategoryDnd: React.FC<ProductCategoryProps> = ({ productAdditional }) => {
    return (
        <div >
            <ListGroup.Item variant={productAdditional.additional.paused !== true ? "light" : "danger"} >
                <Row>
                    <Col md={2}><BsList /></Col>
                    <Col md={10}><span>{productAdditional.additional.title}</span></Col>
                </Row>
            </ListGroup.Item>
        </div>
    )
}

export default ProductCategoryDnd;