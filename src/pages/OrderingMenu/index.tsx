import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Container, Row, Col, Button, ListGroup, Accordion, Card } from 'react-bootstrap';
import { BsFillBagFill, BsBook, BsFillPauseFill } from 'react-icons/bs';

import PageHeader from '../../components/PageHeader';
import { Category } from '../../components/Categories';
import ProductItem, { Product } from '../../components/Products';

import 'bootstrap/dist/css/bootstrap.min.css';

function OrderingMenu() {
    /* Categorias */
    const [listCategories] = useState<Category[]>([]);

    const [listProducts] = useState<Product[]>([]);

    return (
        <div>
            <header className="bg-dark">
                <PageHeader />
            </header>

            <Container fluid>
                <Row className="menu-side-container">
                    <Col md={1} className="bg-danger text-center">
                        <Link to="/ordering" className="nav-link rounded container-ordering-menu-links mt-2">
                            <Row>
                                <Col>
                                    <div>
                                        <BsFillBagFill />
                                    </div>
                                    <div className="container-ordering-menu-links-title">
                                        Pedidos
                                </div>
                                </Col>
                            </Row>
                        </Link>


                        <div className="nav-link rounded link-ative">
                            <Row>
                                <Col>
                                    <div>
                                        <BsBook />
                                    </div>
                                    <div className="container-ordering-menu-links-title">
                                        Cardápio
                                </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>

                    <Col md={11}>
                        <Accordion className="mt-2">
                            {
                                listCategories && listCategories.map((card: Category) => {
                                    return <div key={card.id}>
                                        <Card>
                                            <Card.Header>
                                                <Row>
                                                    <Col md={9}>
                                                        <Accordion.Toggle
                                                            as={Button}
                                                            variant="link"
                                                            eventKey={card.id.toString()}>
                                                            {card.title}
                                                        </Accordion.Toggle>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Button variant="outline-danger" className="button-link" ><BsFillPauseFill /> Pausar</Button>
                                                    </Col>
                                                </Row>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey={card.id.toString()}>
                                                <Card.Body>
                                                    <Row>
                                                        <Col>
                                                            <ListGroup>
                                                                {
                                                                    listProducts && listProducts.map((product, index) => {
                                                                        return card.id === product.category.id &&
                                                                            <div key={product.id}>
                                                                                <ProductItem key={product.id} product={product} />
                                                                            </div>
                                                                    })
                                                                }
                                                            </ListGroup>
                                                        </Col>
                                                    </Row>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </div>
                                })
                            }
                        </Accordion>
                    </Col>
                </Row>

                {/*<div className="container-ordering-panel">

                        </div>*/}
            </Container>

        </div>
    )
};

export default OrderingMenu;