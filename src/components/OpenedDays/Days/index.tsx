import React, { useState, useContext } from 'react';

import { Row, Col, Button, Badge, Form, Spinner } from 'react-bootstrap';
import { BsPlus } from "react-icons/bs";

import api from '../../../services/api';
import { DaysContext } from '../../../context/openedDaysContext';
import OpenedScheduelsItem, { OpenedSchedules } from '../Schedules';
import { dayOfWeekAsInteger } from '../../../utils/dayOfWeekAsInteger';

import './styles.css';

export interface Day {
    id: number,
    week_day: number,
    opened: boolean,
    daySchedules: OpenedSchedules[]
}

interface DaysProps {
    day: Day;
}

const DayItem: React.FC<DaysProps> = ({ day }) => {
    const { handleDays } = useContext(DaysContext);

    const [waitingDay, setWaitingDay] = useState(false);

    async function handleEnabled() {
        setWaitingDay(true);

        await api.put(`store/opened-days/${day.id}`,
            {
                opened: !day.opened
            }
        );

        const res = await api.get('store/opened-days');

        handleDays(res.data);

        setWaitingDay(false);
    }

    async function addDaySchedule() {
        try {
            await api.post('store/opened-day/schedules', {
                from: 0,
                to: 0,
                paused: false,
                weedDay: day.id
            });

            const res = await api.get('store/opened-days');

            handleDays(res.data);
        }
        catch (err) {
            console.log('error post restaurants schedule day');
            console.log(err);
        }
    }

    return (
        <Row className="container-day m-3">
            <Col className="mt-3 mb-3" md={2}>
                <Row className="justify-content-center text-center">
                    <Col className={`col-12 mt-2 mb-2 ${day.opened ? "text-success" : "text-danger"}`}>
                        <h6>{dayOfWeekAsInteger(day.week_day)}</h6>
                    </Col>
                    <Col className="col-12 mt-2 mb-2">
                        <Row>
                            <Col>
                                <Badge variant={day.opened ? "success" : "danger"}>{day.opened ? "aberto" : "fechado"}</Badge>
                            </Col>
                            <Col className="text-danger">
                                {
                                    waitingDay ? <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    /> : <Form.Check
                                            type="switch"
                                            id={`day-switch-enable-${day.id}`}
                                            checked={day.opened}
                                            onChange={handleEnabled}
                                        />
                                }
                            </Col>
                        </Row>
                    </Col>
                </Row>

                <Row className="justify-content-center text-center">
                    <Col>
                        <Button variant="outline-danger" onClick={addDaySchedule} ><BsPlus /> Horário</Button>
                    </Col>
                </Row>
            </Col>

            {
                day.daySchedules && day.daySchedules.map(openedSchedules => {
                    return <OpenedScheduelsItem key={openedSchedules.id} openedSchedules={openedSchedules} />
                })
            }
        </Row>
    )
}

export default DayItem;