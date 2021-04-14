import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, Form, Row, Col, Button, Toast, Badge } from 'react-bootstrap';
import { FaHome, FaDolly, FaStore, FaShoppingCart, FaAngleRight, FaChartLine } from 'react-icons/fa';

import { Context } from '../../context/auth';
import { StoreContext } from '../../context/storeContext';
import { OrdersNotificationsContext } from '../../context/ordersNotificationsContext';
import rbac from '../../services/roleBasedAccessControl';

function PageHeader() {
    const { user, signed, handleLogout } = useContext(Context);
    const { store } = useContext(StoreContext);
    const { newOrdersAmount, newOrdersTime, newOrdersShow, handleHasShown } = useContext(OrdersNotificationsContext);

    const [showBadgeNotification, setShowBadgeNotification] = useState(false);
    const toogleBadgeNotification = () => setShowBadgeNotification(!showBadgeNotification);

    useEffect(() => {
        Notification.requestPermission();
    }, []);

    useEffect(() => {
        if (newOrdersShow) {
            new Audio('/audios/new-order-notification.mp3').play();

            if (Notification.permission === "granted") {
                new Notification('Novos pedidos', {
                    body: `${newOrdersAmount} ${newOrdersAmount === 1 ? "pedido para aprovação." : "pedidos para aprovação."}`
                });
            }
            else {
                setShowBadgeNotification(true);
            }

            handleHasShown(true);
        }
    }, [newOrdersShow]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="container">
            <Navbar bg="dark" variant="dark" expand="lg">
                {
                    store && <Navbar.Brand>
                        <img
                            alt={store.title}
                            src={store.avatar}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        {store.title}
                    </Navbar.Brand>
                }
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        {
                            user && rbac.can(String(user.type.code)).readAny('reports').granted && <Link to="/dashboard" className="nav-link">
                                <Row className="justify-content-center text-center">
                                    <Col sm={10}>
                                        <FaHome />
                                    </Col>

                                    <Col>
                                        Início
                                </Col>
                                </Row>
                            </Link>
                        }

                        {
                            user && rbac.can(String(user.type.code)).readAny('products').granted && <Link to="/menu" className="nav-link">
                                <Row className="justify-content-center text-center">
                                    <Col sm={10}>
                                        <FaDolly />
                                    </Col>

                                    <Col>
                                        Produtos
                                </Col>
                                </Row>
                            </Link>
                        }

                        {
                            user && rbac.can(String(user.type.code)).readAny('store').granted && <Link to="/store" className="nav-link">
                                <Row className="justify-content-center text-center">
                                    <Col sm={10}>
                                        <FaStore />
                                    </Col>

                                    <Col>
                                        Loja
                                </Col>
                                </Row>
                            </Link>
                        }

                        <Link to="/ordering" className="nav-link">
                            <Row className="justify-content-center text-center">
                                <Col sm={10}>
                                    <FaShoppingCart /> {newOrdersAmount > 0 && <Badge variant="warning">{newOrdersAmount}</Badge>}
                                </Col>

                                <Col>
                                    Pedidos
                                </Col>
                            </Row>
                        </Link>

                        {
                            user && rbac.can(String(user.type.code)).readAny('reports').granted && <Link to="/reports" className="nav-link">
                                <Row className="justify-content-center text-center">
                                    <Col sm={10}>
                                        <FaChartLine />
                                    </Col>

                                    <Col>
                                        Relatórios
                                </Col>
                                </Row>
                            </Link>
                        }
                    </Nav>
                    {
                        signed && <Form inline>
                            <Button variant="outline-light" onClick={handleLogout}>Sair</Button>
                        </Form>
                    }
                    <div
                        aria-live="polite"
                        aria-atomic="true"
                        style={{
                            position: 'absolute',
                            minHeight: '100px',
                            right: 0,
                            top: '120%',
                            zIndex: 9999
                        }}
                    >
                        <Toast
                            style={{
                                minWidth: '300px'
                            }}
                            show={showBadgeNotification} onClose={toogleBadgeNotification}
                            autohide
                            delay={5000}
                        >
                            <Toast.Header className="bg-warning text-dark">
                                <strong className="mr-auto">Novos pedidos</strong>
                                <small>{newOrdersTime}</small>
                            </Toast.Header>
                            <Toast.Body>
                                <Row className="justify-content-center text-center">
                                    <Col className="col-10">
                                        <Badge variant="warning">{newOrdersAmount}</Badge> {newOrdersAmount === 1 ? "pedido para aprovação." : "pedidos para aprovação."}
                                    </Col>

                                    <Col className="col-2">
                                        <Link to="/ordering"><FaAngleRight /></Link>
                                    </Col>
                                </Row>
                            </Toast.Body>
                        </Toast>
                    </div>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default PageHeader;