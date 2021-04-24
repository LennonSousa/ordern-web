import React, { useState, useContext } from 'react';
import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { BsFillTrashFill, BsCheck } from "react-icons/bs";
import { FaSave } from "react-icons/fa";
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../../services/api';
import { DaysContext } from '../../../context/openedDaysContext';
import { convertHourToMinutes, convertMinutesToHours } from '../../../utils/convertHourToMinutes';

import './styles.css';

export interface OpenedSchedules {
    id: number,
    from: number,
    to: number,
    paused: boolean,
    weedDay: number
}

interface OpenedSchedulesProps {
    openedSchedules: OpenedSchedules;
}

const validatiionSchema = Yup.object().shape({
    from: Yup.string().required('Obrigatório!'),
    to: Yup.string().required('Obrigatório'),
});

let savingStatus: "saved" | "touched" | "saving";

const OpenedSchedulesItem: React.FC<OpenedSchedulesProps> = ({ openedSchedules }) => {
    const { handleDays } = useContext(DaysContext);

    const [fieldsFormTouched, setFieldsFormTouched] = useState(false);
    const [savingScheduleStatus, setSavingScheduleStatus] = useState<typeof savingStatus>("saved");
    const [waitingDelete, setWaitingDelete] = useState(false);

    async function removeDaySchedule() {
        setWaitingDelete(true);

        try {
            await api.delete(`store/opened-day/schedules/${openedSchedules.id}`);

            const res = await api.get('store/opened-days');

            handleDays(res.data);
        }
        catch (err) {
            console.log('error post store schedules day');
            console.log(err);
            setWaitingDelete(false);
        }
    }

    return (
        <Col className="container-schedule mt-3 mb-3" md={2}>
            <Formik
                initialValues={{
                    from: convertMinutesToHours(openedSchedules.from),
                    to: convertMinutesToHours(openedSchedules.to),
                }}

                onSubmit={async values => {
                    setFieldsFormTouched(false);

                    setSavingScheduleStatus("saving");

                    try {
                        await api.put(`store/opened-day/schedules/${openedSchedules.id}`, {
                            from: convertHourToMinutes(values.from),
                            to: convertHourToMinutes(values.to),
                            paused: openedSchedules.paused
                        });

                        const res = await api.get('store/opened-days');

                        handleDays(res.data);
                    }
                    catch (err) {
                        console.log('error post store schedules day');
                        console.log(err);
                    }

                    setSavingScheduleStatus("saved");
                }}
                validationSchema={validatiionSchema}
            >
                {({ handleSubmit, values, setFieldValue, errors }) => (
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row} className="justify-content-center text-center" controlId={"formHours" + openedSchedules.id + "from"}>
                            <Form.Label column className="col-md-3 col-4">De</Form.Label>
                            <Col className="col-md-9 col-8">
                                <Form.Control
                                    type="time"
                                    placeholder="Ex: R$ 14:00"
                                    onChange={(e) => { setFieldValue('from', e.target.value, true); setFieldsFormTouched(true); setSavingScheduleStatus("touched"); }}
                                    defaultValue={values.from}
                                    name="from"
                                    isInvalid={!!errors.from}
                                />
                                <Form.Control.Feedback type="invalid">{errors.from}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="justify-content-center text-center" controlId={"formHours" + openedSchedules.id + "to"}>
                            <Form.Label column className="col-md-3 col-4">Até</Form.Label>
                            <Col className="col-md-9 col-8">
                                <Form.Control
                                    type="time"
                                    placeholder="Ex: R$ 14:00"
                                    onChange={(e) => { setFieldValue('to', e.target.value, true); setFieldsFormTouched(true); setSavingScheduleStatus("touched"); }}
                                    defaultValue={values.to}
                                    name="to"
                                    isInvalid={!!errors.to}
                                />
                                <Form.Control.Feedback type="invalid">{errors.to}</Form.Control.Feedback>
                            </Col>
                        </Form.Group>

                        <Form.Row className="justify-content-center">
                            <Col className="col-4">
                                <Button variant="outline-danger" onClick={removeDaySchedule}>
                                    {
                                        waitingDelete ? <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> : <BsFillTrashFill />
                                    }
                                </Button>
                            </Col>
                            <Col className="col-4">
                                <Button variant="outline-success" disabled={!fieldsFormTouched} type="submit" >
                                    {
                                        savingScheduleStatus === "saving" ? <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        /> : (
                                            savingScheduleStatus === "saved" ? <BsCheck /> : savingScheduleStatus === "touched" && <FaSave />
                                        )
                                    }
                                </Button>
                            </Col>
                        </Form.Row>
                    </Form>
                )}
            </Formik>

        </Col>
    )
}

export default OpenedSchedulesItem;