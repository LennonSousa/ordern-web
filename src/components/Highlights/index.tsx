import React, { useState } from 'react';
import { Row, Col, ListGroup, Button, Spinner } from 'react-bootstrap';
import { BsPencil, BsFillPlayFill, BsFillPauseFill } from "react-icons/bs";

import { Product } from '../Products';

import api from '../../services/api';

export interface Highlight {
    id: number;
    active: boolean;
    product: Product;
}

interface HighlightProps {
    highlight: Highlight;
    handleHighlights: any;
    handleModalHighlight: any;
}

const Highlights: React.FC<HighlightProps> = ({ highlight, handleHighlights, handleModalHighlight }) => {
    const [iconWaiting, setIconWaiting] = useState(false);

    function handleModalToEditHighlight() {
        handleModalHighlight("edit", highlight.id);
    }

    async function handlePauseAdditional() {
        setIconWaiting(true);

        await api.put(`highlights/landing/${highlight.id}`, {
            active: !highlight.active,
            product: highlight.product.id
        });

        handleHighlights();

        setIconWaiting(false);
    }

    return (
        <ListGroup.Item variant={highlight.active ? "light" : "danger"} >
            <Row>
                <Col><span>{highlight.product.title}</span></Col>

                <Col><span>{highlight.product.category.title}</span></Col>

                <Col>
                    <Button
                        variant="outline-danger"
                        className="button-link"
                        onClick={handlePauseAdditional}>
                        {
                            iconWaiting ? <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> :
                                highlight.active ? (<>Pausar <BsFillPauseFill /></>) : (<>Pausado <BsFillPlayFill /></>)
                        }
                    </Button>
                </Col>

                <Col className="text-center">
                    <Button variant="outline-danger" className="button-link" onClick={handleModalToEditHighlight}><BsPencil /> Editar</Button>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}

export default Highlights;