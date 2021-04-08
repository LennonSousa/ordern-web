import React, { useEffect, useState, useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Row, Col, ListGroup } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';

import { ProductAditional } from '../../ProductAditional';
import { ContextProductCategoryDnd } from '../../../context/productCategoriesDnd';

import 'bootstrap/dist/css/bootstrap.min.css';

export interface ProductCategory {
    id: number;
    title: string;
    min: number;
    max: number;
    order: number;
    productAdditional: ProductAditional[];
    product: number;
}

interface ProductCategoryProps {
    productCategory: ProductCategory;
    index: number;
}

interface item {
    type: string;
    index: number;
}

const ProductCategoryDnd: React.FC<ProductCategoryProps> = ({ productCategory, index }) => {
    const [cssClass, setCssClass] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    const { moveCategoryOrder } = useContext(ContextProductCategoryDnd);

    const [{ isDraggin }, dragRef] = useDrag({
        type: 'PRODUCTCATEGORY',
        item: index,
        collect: monitor => ({
            isDraggin: monitor.isDragging()
        })
    });

    const [, dropRef] = useDrop({
        accept: 'PRODUCTCATEGORY',
        hover(item: item, monitor) {
            if (!ref.current) {
                return;
            }

            const draggedIndex = item.index;
            const targetIndex = index;

            if (draggedIndex === targetIndex) {
                return;
            }

            const targetSize = ref.current?.getBoundingClientRect();

            if (targetSize) {
                const targetCenter = (targetSize.bottom - targetSize.top) / 2;

                const draggedOffset = monitor.getClientOffset();

                if (draggedOffset) {
                    const draggedTop = draggedOffset.y - targetSize.top;

                    if (draggedIndex < targetIndex && draggedTop < targetCenter) {
                        return;
                    }

                    if (draggedIndex > targetIndex && draggedTop > targetCenter) {
                        return;
                    }

                    moveCategoryOrder(draggedIndex, targetIndex);

                    item.index = targetIndex;
                }
            }
        }
    });

    useEffect(() => {
        if (isDraggin) {
            setCssClass('isDragging');
        }
        else {
            setCssClass('');
        }
    }, [isDraggin, dragRef]);

    dragRef(dropRef(ref));

    return (
        <div ref={ref} className={cssClass}>
            <ListGroup.Item action href={`#${productCategory.id}`} key={index} >
                <Row>
                    <Col md={2}><BsList /></Col>
                    <Col md={10}><span>{productCategory.title}</span></Col>
                </Row>
            </ListGroup.Item>
        </div>
    )
}

export default ProductCategoryDnd;