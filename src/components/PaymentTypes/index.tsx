import React, { useState, useEffect } from 'react';
import { Row, Col, ListGroup, Spinner } from 'react-bootstrap';

import api from '../../services/api';

import PaymentsDelivery, { PaymentDelivery } from '../PaymentsDelivery';
import PaymentStripe from '../PaymentStripe';

const PaymentTypes: React.FC = () => {
    const [paymentsDelivery, setPaymentsDelivery] = useState<PaymentDelivery[]>([]);

    const [outdated, setOutdated] = useState(true);

    const [waitingPaymentsDelivery, setWaitingPaymentsDelivery] = useState(true);

    useEffect(() => {
        if (outdated) {
            setWaitingPaymentsDelivery(true);

            api.get('payments/delivery')
                .then(res => {
                    setPaymentsDelivery(res.data);

                    setWaitingPaymentsDelivery(false);
                })
                .catch(err => {
                    console.log('error get payments delivery');
                    console.log(err);
                });

            setOutdated(false);
        }
    }, [outdated]);

    return (
        <>
            <Row>
                <Col>
                    <h5>Pagamentos na entrega</h5>
                    <ListGroup>
                        {
                            waitingPaymentsDelivery ? <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            /> : paymentsDelivery.map((paymentDelivery, index) => {
                                return <PaymentsDelivery
                                    key={index}
                                    paymentDelivery={paymentDelivery}
                                    withButton={paymentDelivery.code === 'money' ? false : true}
                                    setOutdated={setOutdated}
                                />
                            })

                        }
                    </ListGroup>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    <h5>Pagamentos on-line</h5>
                    <ListGroup>
                        <PaymentStripe />
                    </ListGroup>
                </Col>
            </Row>
        </>
    )
}

export default PaymentTypes;