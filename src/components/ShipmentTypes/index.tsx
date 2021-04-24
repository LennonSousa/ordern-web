import React, { useState, useEffect } from 'react';
import { Row, Col, ListGroup, Spinner } from 'react-bootstrap';

import api from '../../services/api';

import StoreShipments, { StoreShipment } from '../StoreShipments';

const ShipmentTypes: React.FC = () => {
    const [storeDeliveryGroups, setStoreDeliveryGroups] = useState<StoreShipment[]>([]);

    const [outdated, setOutdated] = useState(true);

    const [waitingStoreDeliveryGroups, setWaitingStoreDeliveryGroups] = useState(true);

    useEffect(() => {
        if (outdated) {
            api.get('store/shipments')
                .then(res => {
                    setWaitingStoreDeliveryGroups(true);

                    setStoreDeliveryGroups(res.data);

                    setWaitingStoreDeliveryGroups(false);
                })
                .catch(() => { });

            setOutdated(false);
        }
    }, [outdated]);

    return (
        <Row>
            <Col>
                <h5>Tipos de entrega</h5>
                <ListGroup>
                    {
                        waitingStoreDeliveryGroups ? <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        /> : storeDeliveryGroups.map((StoreShipment, index) => {
                            return <StoreShipments
                                key={index}
                                storeShipment={StoreShipment}
                                withButton={StoreShipment.code === 'pickup' ? false : true}
                                setOutdated={setOutdated}
                            />
                        })

                    }
                </ListGroup>
            </Col>
        </Row>
    )
}

export default ShipmentTypes;