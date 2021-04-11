import React, { useEffect, useState, useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Row, Col, ListGroup } from 'react-bootstrap';
import { BsList } from 'react-icons/bs';

import { Category } from '../../Categories';
import { ContextProductDnd } from '../../../context/productsDnd';



export interface Product {
    id: number;
    title: string;
    paused: boolean;
    order: number;
    category: Category;
}

interface ProductProps {
    product: Product;
    index: number;
}

interface item {
    type: string;
    index: number;
}

const ProductsDnd: React.FC<ProductProps> = ({ product, index }) => {
    const [cssClass, setCssClass] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    const { moveOrder } = useContext(ContextProductDnd);

    const [{ isDraggin }, dragRef] = useDrag({
        type: 'PRODUCT',
        item: index,
        collect: monitor => ({
            isDraggin: monitor.isDragging()
        })
    });

    const [, dropRef] = useDrop({
        accept: 'PRODUCT',
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

                    moveOrder(draggedIndex, targetIndex);

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
            <ListGroup.Item key={index} variant={product.paused !== true ? "light" : "danger"} >
                <Row>
                    <Col md={2}><BsList /></Col>
                    <Col md={10}><span>{product.title}</span></Col>
                </Row>
            </ListGroup.Item>
        </div>
    )
}

export default ProductsDnd;