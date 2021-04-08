import React from 'react';

import { Row, Col, ListGroup, Button, Spinner } from 'react-bootstrap';
import { BsFillPauseFill, BsFillPlayFill, BsFiles, BsPencil } from "react-icons/bs";

import { ProductAditional } from '../ProductAditional';

import 'bootstrap/dist/css/bootstrap.min.css';


export interface Additional {
    id: number;
    title: string;
    code: string;
    paused: boolean;
    productAdditionals: ProductAditional[];
}

interface AdditionalProps {
    additional: Additional;
    handleModalAdditional: any;
    handlePauseAdditional: any;
}

const Additionals: React.FC<AdditionalProps> = ({ additional, handleModalAdditional, handlePauseAdditional }) => {
    return (
        <ListGroup.Item variant={additional.paused !== true ? "light" : "danger"} >
            <Row>
                <Col><span>{additional.title}</span></Col>

                <Col>
                    <Button
                        variant="outline-danger"
                        className="button-link"
                        onClick={() => handlePauseAdditional(additional.id)}>
                        {additional.paused === true ? (<>Pausado <BsFillPlayFill /></>) : (<>Pausar <BsFillPauseFill /></>)}
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
                    <Button variant="outline-danger" className="button-link" onClick={() => handleModalAdditional(false, additional.id)}><BsPencil /> Editar</Button>
                </Col>
            </Row>
        </ListGroup.Item>
    )
}

export default Additionals;