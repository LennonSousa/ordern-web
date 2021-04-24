import React, { useState, useEffect, useContext } from 'react';
import { Row, Col, Spinner } from 'react-bootstrap';

import api from '../../services/api';

import { DaysContext } from '../../context/openedDaysContext';
import DaysItem from '../OpenedDays/Days';

const OpenedDays: React.FC = () => {
    const { days, handleDays } = useContext(DaysContext);

    const [waitingOpenedDays, setWaitingOpenedDays] = useState(true);

    useEffect(() => {
        setWaitingOpenedDays(true);

        api.get('store/opened-days')
            .then(res => {
                handleDays(res.data);

                setWaitingOpenedDays(false);
            })
            .catch(err => {
                console.log('error get opened days');
                console.log(err);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <Row>
                <Col>
                    {
                        waitingOpenedDays ? <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                        /> : days.map((day, index) => {
                            return <DaysItem
                                key={index}
                                day={day}
                            />
                        })
                    }
                </Col>
            </Row>
        </>
    )
}

export default OpenedDays;