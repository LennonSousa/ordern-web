import React, { useContext } from 'react';

import { Row, Col, ListGroup, Button, Spinner } from 'react-bootstrap';
import { BsFillPauseFill, BsFillPlayFill, BsFiles, BsPencil } from "react-icons/bs";

import { Context } from '../../context/auth';
import rbac from '../../services/roleBasedAccessControl';
import { ProductAditional } from '../ProductAditional';

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
    const { user } = useContext(Context);

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

                {
                    user && rbac.can(String(user.type.code)).updateAny('additionals').granted && <>
                        <Col><a href="/">Duplicar <BsFiles /></a></Col>
                        <Col className="text-center">
                            <Button
                                variant="outline-danger"
                                className="button-link"
                                onClick={() => handleModalAdditional(false, additional.id)}><BsPencil
                                /> Editar
                            </Button>

                        </Col>
                    </>
                }
            </Row>
        </ListGroup.Item>
    )
}

export default Additionals;