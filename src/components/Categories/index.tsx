import React, { useEffect, useState, useRef, useContext } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { Row, Col, ListGroup, Button, Spinner } from 'react-bootstrap';
import { BsFillPauseFill, BsFillPlayFill, BsFiles, BsPencil } from 'react-icons/bs';

import { Product } from '../Products';
import { ContextDnd } from '../../context/categoriesDnd';

import 'bootstrap/dist/css/bootstrap.min.css';

export interface Category {
    id: number;
    title: string;
    paused: boolean;
    order: number;
    products: Product[];
}

interface CategoryProps {
    category: Category;
    index: number;
    handelModalCategory: any;
    handelPauseCategory: any;
}

interface item {
    type: string;
    index: number;
}

const Categories: React.FC<CategoryProps> = ({ category, index, handelModalCategory, handelPauseCategory }) => {
    const [cssClass, setCssClass] = useState('');
    const ref = useRef<HTMLDivElement>(null);

    const { moveOrder, saveOrder } = useContext(ContextDnd);

    const [{ isDraggin }, dragRef] = useDrag({
        type: 'CARD',
        item: index,
        collect: monitor => ({
            isDraggin: monitor.isDragging()
        })
    });

    const [, dropRef] = useDrop({
        accept: 'CARD',
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
        },
        drop() {
            saveOrder();
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
            <ListGroup.Item variant={category.paused !== true ? "light" : "danger"} >
                <Row>
                    <Col><span>{category.title}</span></Col>

                    <Col>
                        <Button
                            variant="outline-danger"
                            className="button-link"
                            onClick={() => handelPauseCategory(category.id)}>
                            {category.paused === true ? (<>Pausado <BsFillPlayFill /></>) : (<>Pausar <BsFillPauseFill /></>)}
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

                    <Col><a href="/">Duplicar <BsFiles /></a></Col>
                    <Col className="text-center">
                        <Button variant="outline-danger" className="button-link" onClick={() => handelModalCategory(false, category.id)}><BsPencil /> Editar</Button>
                    </Col>
                </Row>
            </ListGroup.Item>
        </div>
    )
}

export default Categories;