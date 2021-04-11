import React, { useEffect, useState, useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Row, Col, ListGroup } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';

import { Additional } from '../../Additionals';
import { ProductCategory } from '../../ProductCategory';
import { ContextProductAdditionalDnd } from '../../../context/productAdditionalsDnd';



export interface ProductAditional {
    id: number;
    pdv: string;
    order: number;
    additional: Additional;
    categoryAdditional: ProductCategory;
}

interface ProductCategoryProps {
    productAdditional: ProductAditional;
    index: number;
}

interface item {
    type: string;
    index: number;
}

const ProductCategoryDnd: React.FC<ProductCategoryProps> = ({ productAdditional, index }) => {
    const [cssClass, setCssClass] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    const { moveAdditionalOrder } = useContext(ContextProductAdditionalDnd);

    const [{ isDraggin }, dragRef] = useDrag({
        type: 'PRODUCTADDITIONAL',
        item: index,
        collect: monitor => ({
            isDraggin: monitor.isDragging()
        })
    });

    const [, dropRef] = useDrop({
        accept: 'PRODUCTADDITIONAL',
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

                    moveAdditionalOrder(productAdditional.categoryAdditional.id, draggedIndex, targetIndex);

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
            <ListGroup.Item key={index} variant={productAdditional.additional.paused !== true ? "light" : "danger"} >
                <Row>
                    <Col md={2}><BsList /></Col>
                    <Col md={10}><span>{productAdditional.additional.title}</span></Col>
                </Row>
            </ListGroup.Item>
        </div>
    )
}

export default ProductCategoryDnd;