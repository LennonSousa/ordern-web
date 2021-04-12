import React, { useContext, useEffect, useState } from 'react';

import { Row, Col, Form, Button, Spinner } from 'react-bootstrap';
import { BsCheck, BsBackspace } from 'react-icons/bs';
import { FaSave } from 'react-icons/fa';

import { ContextSelectedProduct } from '../../context/selectedProductContext';
import { convertHourToMinutes, convertMinutesToHours } from '../../utils/convertHourToMinutes';



export interface ProductAvailable {
    id: number;
    week_day: number;
    available: boolean;
    all_day: boolean;
    shift_01: boolean;
    shift_01_from: number;
    shift_01_to: number;
    shift_02: boolean;
    shift_02_from: number;
    shift_02_to: number;
    product_id: number;
}

interface ProductAvailableProps {
    productAvailable: ProductAvailable;
}

const ProductAvailables: React.FC<ProductAvailableProps> = ({ productAvailable }) => {
    const { selectedProduct, handleUpdateSelectedProduct, handleTabAvailables } = useContext(ContextSelectedProduct);

    const [productAvailableItem, setProductAvailableItem] = useState<ProductAvailable>(productAvailable);

    const [buttonSave, setButtonSave] = useState('none');
    const [buttonCancel, setButtonCancel] = useState('none');

    const [iconSaved, setIconSaved] = useState('none');
    const [iconSave, setIconSave] = useState('inline-block');
    const [loadingSave, setLoadingSave] = useState('none');

    useEffect(() => {
        setProductAvailableItem(productAvailable);
    }, [productAvailable]);

    function handleAvailableValues(field: string, value: string) {
        setIconSave('inline-block');
        setButtonSave('inline-block');
        setButtonCancel('inline-block');

        setProductAvailableItem({ ...productAvailableItem, [field]: convertHourToMinutes(value) });
    }

    function handleButtonSave() {
        if (selectedProduct) {
            setButtonCancel('none');
            setIconSave('none');
            setLoadingSave('inline-block');

            handleTabAvailables(true);

            handleUpdateSelectedProduct({
                ...selectedProduct, availables: selectedProduct.availables.map(productAvailable => {
                    if (productAvailable.id === productAvailableItem.id) {
                        return productAvailableItem;
                    }

                    return productAvailable;
                })
            });

            setTimeout(() => {
                setLoadingSave('none');
                setIconSaved('inline-block');

                setTimeout(() => {
                    setButtonSave('none');
                    setIconSaved('none');
                }, 1000);

            }, 1000);
        }
    }

    function handleButtonCancel() {
        setButtonSave('none');
        setButtonCancel('none');

        setProductAvailableItem(productAvailable);
    }

    return (
        <>
            <Row className="mt-3">
                <Col>
                    <Form.Group controlId={`availableFormGrid${productAvailable.week_day}`}>
                        <div className='custom-control custom-switch'>
                            <input
                                type='checkbox'
                                className='custom-control-input'
                                id={`availableFormSwitch${productAvailable.week_day}`}
                                checked={productAvailableItem.all_day}
                                onChange={() => {
                                    setIconSave('inline-block');
                                    setButtonSave('inline-block');
                                    setButtonCancel('inline-block');
                                    handleTabAvailables(true);
                                    setProductAvailableItem({ ...productAvailableItem, all_day: !productAvailableItem.all_day });
                                }}
                            />
                            <label className='custom-control-label' htmlFor={`availableFormSwitch${productAvailable.week_day}`}>Disponível em todos os horários da loja.</label>
                        </div>
                    </Form.Group>
                </Col>
            </Row>

            {
                !productAvailableItem.all_day && <Row>
                    <Col>
                        <Form.Group as={Row} className="align-items-center text-center">
                            <Col sm={3}>
                                <div className='custom-control custom-switch'>
                                    <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id={`availableFormSwitch${productAvailable.week_day}First`}
                                        checked={productAvailableItem.shift_01}
                                        onChange={() => {
                                            setIconSave('inline-block');
                                            setButtonSave('inline-block');
                                            setButtonCancel('inline-block');
                                            handleTabAvailables(true);
                                            setProductAvailableItem({ ...productAvailableItem, shift_01: !productAvailableItem.shift_01 });
                                        }}
                                    />
                                    <label className='custom-control-label' htmlFor={`availableFormSwitch${productAvailable.week_day}First`}>1º turno</label>
                                </div>
                            </Col>

                            <Form.Label column sm={1}>Início</Form.Label>
                            <Col sm={2}>
                                <Form.Control
                                    type="time"
                                    value={convertMinutesToHours(productAvailableItem.shift_01_from)}
                                    onChange={(e) => handleAvailableValues('shift_01_from', e.target.value)}
                                />
                            </Col>

                            <Form.Label column sm={1}>Final</Form.Label>
                            <Col sm={2}>
                                <Form.Control
                                    type="time"
                                    value={convertMinutesToHours(productAvailableItem.shift_01_to)}
                                    onChange={(e) => handleAvailableValues('shift_01_to', e.target.value)}
                                />
                            </Col>
                        </Form.Group>

                        <Form.Group as={Row} className="align-items-center text-center">
                            <Col sm={3}>
                                <div className='custom-control custom-switch'>
                                    <input
                                        type='checkbox'
                                        className='custom-control-input'
                                        id={`availableFormSwitch${productAvailable.week_day}Second`}
                                        checked={productAvailableItem.shift_02}
                                        onChange={() => {
                                            setIconSave('inline-block');
                                            setButtonSave('inline-block');
                                            setButtonCancel('inline-block');
                                            handleTabAvailables(true);
                                            setProductAvailableItem({ ...productAvailableItem, shift_02: !productAvailableItem.shift_02 });
                                        }}
                                    />
                                    <label className='custom-control-label' htmlFor={`availableFormSwitch${productAvailable.week_day}Second`}>2º turno</label>
                                </div>
                            </Col>

                            <Form.Label column sm={1}>Início</Form.Label>
                            <Col sm={2}>
                                <Form.Control
                                    type="time"
                                    value={convertMinutesToHours(productAvailableItem.shift_02_from)}
                                    onChange={(e) => handleAvailableValues('shift_02_from', e.target.value)}
                                />
                            </Col>

                            <Form.Label column sm={1}>Final</Form.Label>
                            <Col sm={2}>
                                <Form.Control
                                    type="time"
                                    value={convertMinutesToHours(productAvailableItem.shift_02_to)}
                                    onChange={(e) => handleAvailableValues('shift_02_to', e.target.value)}
                                />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
            }

            <Form.Group as={Row} className="align-items-center text-center" controlId={`availableFormGrid${productAvailable.week_day}Buttons`}>
                <Col sm={3}>
                    <Button variant="outline-success" className="mr-1" style={{ display: buttonSave }} onClick={() => handleButtonSave()} >
                        <BsCheck style={{ display: iconSaved }} />
                        <FaSave style={{ display: iconSave }} />
                        <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ display: loadingSave }}
                        />
                    </Button>

                    <Button variant="outline-danger" style={{ display: buttonCancel }} onClick={() => handleButtonCancel()} >
                        <BsBackspace />
                    </Button>
                </Col>
            </Form.Group>
        </>
    )
}

export default ProductAvailables;