import React, { useContext } from 'react';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';

import { CategoriesContext } from '../../context/categoriesContext';
import PageHeader from '../../components/PageHeader';
import BreadCrumb from '../../components/BreadCrumb';

// Tabs
import CategoriesTab from './Categories';
import ProductsTab from './Products';
import HighlightsTab from './Highlights';
import AdditionalsTab from './Additionals';

function Menu() {
    const { listCategories } = useContext(CategoriesContext);

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
                                        <HighlightsTab categories={listCategories} />
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