import React from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';

import PageHeader from '../../components/PageHeader';
import BreadCrumb from '../../components/BreadCrumb';

// Tabs
import CategoriesTab from './Categories';
import ProductsTab from './Products';
import HighlightsTab from './Highlights';
import AdditionalsTab from './Additionals';

function Menu() {
    return (
        <>
            <header className="bg-dark mb-2">
                <PageHeader />
            </header>

            <Container>
                <Row>
                    <Col>
                        <BreadCrumb page="Cardápio / Categorias" />
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
                    <Col className="content">
                        <Row>
                            <Col>
                                <Tabs defaultActiveKey="categories" id="tab-menu">
                                    <Tab eventKey="categories" title="Categorias">
                                        <CategoriesTab />
                                    </Tab>

                                    <Tab eventKey="additionals" title="Adicionais">
                                        <AdditionalsTab />
                                    </Tab>

                                    <Tab eventKey="products" title="Produtos">
                                        <ProductsTab />
                                    </Tab>

                                    <Tab eventKey="highlights" title="Destaques">
                                        <HighlightsTab />
                                    </Tab>
                                </Tabs>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
};

export default Menu;