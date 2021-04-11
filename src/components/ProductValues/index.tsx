import React, { useEffect, useState } from 'react';
import { Form, Row, Col, InputGroup, Button, Spinner } from 'react-bootstrap';
import { BsCheck, BsFillTrashFill, BsBackspace, BsExclamationOctagon } from "react-icons/bs";
import { FaSave } from 'react-icons/fa';

import { maskCurrency } from '../../utils/maskCurrency';



export interface ProductValue {
    id: number;
    description: string;
    value: number;
    order: number;
    product: number;
}

interface ProductValueProps {
    productValue: ProductValue;
    handleUpdateProductValue: any;
    handleDeleteProductValue: any;
}

const ProductValues: React.FC<ProductValueProps> = ({ productValue, handleUpdateProductValue, handleDeleteProductValue }) => {
    const [description, setDescription] = useState('');
    const [value, setValue] = useState(0);

    const [buttonSave, setButtonSave] = useState('none');
    const [buttonCancel, setButtonCancel] = useState('none');

    const [iconSaved, setIconSaved] = useState('none');
    const [iconSave, setIconSave] = useState('inline-block');
    const [loadingSave, setLoadingSave] = useState('none');

    const [buttonDelete, setButtonDelete] = useState('inline-block');
    const [buttonDeleteYes, setButtonDeleteYes] = useState('none');

    useEffect(() => {
        setDescription(productValue.description);
        setValue(productValue.value);
    }, [productValue.description, productValue.value]);

    function handleDescription(description: string) {
        setButtonDelete('none');
        setButtonDeleteYes('none');
        setIconSave('inline-block');
        setButtonSave('inline-block');
        setButtonCancel('inline-block');

        setDescription(description);
    }

    function handleValue(value: string) {
        setButtonDelete('none');
        setButtonDeleteYes('none');
        setIconSave('inline-block');
        setButtonSave('inline-block');
        setButtonCancel('inline-block');

        console.log('handleValue', maskCurrency(value));

        setValue(Number(maskCurrency(value)));
    }

    function handleButtonSave() {
        setButtonCancel('none');
        setIconSave('none');
        setLoadingSave('inline-block');

        handleUpdateProductValue({ ...productValue, description: description, value: value })

        setTimeout(() => {
            setLoadingSave('none');
            setIconSaved('inline-block');

            setTimeout(() => {
                setButtonSave('none');
                setIconSaved('none');
                setButtonDelete('inline-block');
            }, 1000);

        }, 1000);
    }

    function handleButtonDelete() {
        setButtonDelete('none');
        setButtonDeleteYes('inline-block');
        setButtonCancel('inline-block');
    }

    function handleButtonCancel() {
        setButtonDelete('inline-block');
        setButtonDeleteYes('none');
        setButtonSave('none');
        setButtonCancel('none');

        setDescription(productValue.description);
        setValue(productValue.value);
    }

    function handleDeleteValue() {
        setButtonDeleteYes('none');
        setButtonCancel('none');
        setButtonDelete('inline-block');

        handleDeleteProductValue(productValue)
    }

    return (
        <Form.Group>
            <Row>
                <Col md={7} sm={1}>
                    <Form.Control
                        type="text"
                        placeholder="Nome"
                        value={description}
                        onChange={(e) => handleDescription(e.target.value)}
                    ></Form.Control>
                </Col>

                <Col md={3} sm={1}>
                    <InputGroup className="mb-2">
                        <InputGroup.Prepend>
                            <InputGroup.Text>R$</InputGroup.Text>
                        </InputGroup.Prepend>
                        <Form.Control
                            type="text"
                            placeholder="0,00"
                            value={Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(value)}
                            onChange={(e) => handleValue(e.target.value.replace('.', '').replace(',', '.'))}
                        />
                    </InputGroup>
                </Col>

                <Col md={2} sm={1}>
                    <Button variant="outline-danger" style={{ display: buttonDelete }} onClick={() => handleButtonDelete()} >
                        <BsFillTrashFill />
                    </Button>

                    <Button variant="warning"
                        style={{ display: buttonDeleteYes }}
                        onClick={() => { handleDeleteValue() }}
                    >
                        <BsExclamationOctagon />
                    </Button>

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
            </Row>
        </Form.Group>
    )
}

export default ProductValues;