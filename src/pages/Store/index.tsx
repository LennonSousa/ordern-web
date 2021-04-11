import React, { ChangeEvent, useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Tabs, Tab, Button, Form, Image, Spinner, InputGroup } from 'react-bootstrap';
import { BsCamera, BsCloudUpload, BsXCircle, BsCheckCircle, BsExclamationOctagon } from 'react-icons/bs';
import cep, { CEP } from 'cep-promise';
import { Formik } from 'formik';
import * as Yup from 'yup';

import api from '../../services/api';

import { StoreContext } from '../../context/storeContext';
import Users from '../../components/Users';
import OpenedDays from '../../components/OpenedDays';
import PaymentTypes from '../../components/PaymentTypes';
import ShipmentTypes from '../../components/ShipmentTypes';
import { maskCurrency } from '../../utils/maskCurrency';

import PageHeader from '../../components/PageHeader';
import BreadCrumb from '../../components/BreadCrumb';


import './styles.css';

const storeValidatiionSchema = Yup.object().shape({
    title: Yup.string().required('Obrigatório!').max(25, 'Deve conter no máximo 25 caracteres!'),
    phone: Yup.string().notRequired(),
    description: Yup.string().notRequired().max(300, 'Deve conter no máximo 300 caracteres!'),
});

const addressStoreValidatiionSchema = Yup.object().shape({
    zip_code: Yup.string().required('Obrigatório!').min(8, 'Deve conter no mínimo 8 caracteres!').max(8, 'Deve conter no máximo 8 caracteres!'),
    street: Yup.string().required('Obrigatório!'),
    number: Yup.string().required('Obrigatório!'),
    group: Yup.string().required('Obrigatório!'),
    city: Yup.string().required('Obrigatório!'),
    country: Yup.string().required('Obrigatório!'),
});

let savingStatus: "saving" | "success" | "error"

function Restaurants() {
    const { store, handleStore } = useContext(StoreContext)

    const [key, setKey] = useState('');

    const [coverRestaurante, setCoverRestaurante] = useState('');
    const [coverPreview, setCoverPreview] = useState('');
    const [selectedCover, setSelectedCover] = useState<File[]>([]);
    const [divUploadCover, setDivUploadCover] = useState('inline-block');
    const [saveUploadCover, setSaveUploadCover] = useState('none');
    const [spinnerUploadCover, setSpinnerUploadCover] = useState('none');
    const [successUploadCover, setSuccessUploadCover] = useState('none');
    const [errorUploadCover, setErrorUploadCover] = useState('none');

    const [avatarRestaurante, setAvatarRestaurante] = useState('');
    const [avatarPreview, setAvatarPreview] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<File[]>([]);
    const [divUploadAvatar, setDivUploadAvatar] = useState('inline-block');
    const [saveUploadAvatar, setSaveUploadAvatar] = useState('none');
    const [spinnerUploadAvatar, setSpinnerUploadAvatar] = useState('none');
    const [successUploadAvatar, setSuccessUploadAvatar] = useState('none');
    const [errorUploadAvatar, setErrorUploadAvatar] = useState('none');

    const [savingStore, setSavingStore] = useState(false);
    const [savingStoreStatus, setSavingStoreStatus] = useState<typeof savingStatus>("saving");

    const [savingAddressStore, setSavingAddressStore] = useState(false);
    const [savingAddressStoreStatus, setSavingAddressStoreStatus] = useState<typeof savingStatus>("saving");

    const [storeMinOrder, setStoreMinOrder] = useState(0.00);

    const [spinnerCep, setSpinnerCep] = useState(false);

    useEffect(() => {
        api.get('restaurants')
            .then(res => {
                handleStore(res.data[0]);

                const {
                    cover,
                    avatar
                } = res.data[0];

                setCoverPreview(cover);
                setCoverRestaurante(cover);

                setAvatarPreview(avatar);
                setAvatarRestaurante(avatar);
            })
            .catch(err => {
                console.log('error get restaurants');
                console.log(err);
            });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        store && setStoreMinOrder(store.min_order);
    }, [store]);

    function handleSelectCover(event: ChangeEvent<HTMLInputElement>) {
        try {
            console.log(event.target.files);
            if (event.target.files) {
                setDivUploadCover('none');
                setSaveUploadCover('inline-block');

                const image = Array.from(event.target.files);

                setSelectedCover(image);

                setCoverPreview(URL.createObjectURL(image[event.target.files.length - 1]));
            }
        }
        catch {
            setSpinnerUploadCover('none');
            setSaveUploadCover('none');
            setDivUploadCover('none');
            setErrorUploadCover('inline-block');

            setTimeout(() => {
                setErrorUploadCover('none')
                setDivUploadCover('inline-block')
            }, 2000);
        }

    }

    async function handleSaveCover() {
        try {
            setSpinnerUploadCover('inline-block');
            setDivUploadCover('none');
            setSaveUploadCover('none');

            const data = new FormData();

            selectedCover.forEach(cover => {
                console.log(cover);
                data.append('cover', cover)
            });

            console.log(data);

            await api.put(`restaurant/cover/${store?.id}`, data);

            store && handleStore({
                id: store.id,
                title: store.title,
                phone: store.phone,
                description: store.description,
                min_order: store.min_order,
                cover: coverPreview,
                avatar: store.avatar,
                zip_code: store.zip_code,
                street: store.street,
                number: store.number,
                group: store.group,
                city: store.city,
                country: store.country,
                latitude: store.latitude,
                longitude: store.longitude,
                free_shipping: store.free_shipping,
                highlights: store.highlights,
                highlights_title: store.highlights_title
            });

            setSpinnerUploadCover('none');
            setSuccessUploadCover('inline-block');

            setTimeout(() => {
                setSuccessUploadCover('none')
                setDivUploadCover('inline-block')
            }, 2000);

        }
        catch (err) {
            setSpinnerUploadCover('none');
            setErrorUploadCover('inline-block');

            setTimeout(() => {
                setErrorUploadCover('none')
                setDivUploadCover('inline-block')
            }, 2000);

            console.log('error post restaurants schedule day');
            console.log(err);
        }

    }

    function handleCancelCover() {
        setDivUploadCover('inline-block');
        setSaveUploadCover('none');

        setCoverPreview(coverRestaurante);
    }

    function handleSelectAvatar(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (event.target.files) {
                setDivUploadAvatar('none');
                setSaveUploadAvatar('inline-block');

                const image = Array.from(event.target.files);

                setSelectedAvatar(image);

                setAvatarPreview(URL.createObjectURL(image[event.target.files.length - 1]));
            }
        }
        catch {
            setSpinnerUploadAvatar('none');
            setSaveUploadAvatar('none');
            setDivUploadAvatar('none');
            setErrorUploadAvatar('inline-block');

            setTimeout(() => {
                setErrorUploadAvatar('none')
                setDivUploadAvatar('inline-block')
            }, 2000);
        }

    }

    async function handleSaveAvatar() {
        try {
            setSpinnerUploadAvatar('inline-block');
            setDivUploadAvatar('none');
            setSaveUploadAvatar('none');

            const data = new FormData();

            selectedAvatar.forEach(avatar => {
                console.log(avatar);
                data.append('avatar', avatar)
            });

            console.log(data);

            await api.put(`restaurant/avatar/${store?.id}`, data);

            store && handleStore({
                id: store.id,
                title: store.title,
                phone: store.phone,
                description: store.description,
                min_order: store.min_order,
                cover: store.cover,
                avatar: avatarPreview,
                zip_code: store.zip_code,
                street: store.street,
                number: store.number,
                group: store.group,
                city: store.city,
                country: store.country,
                latitude: store.latitude,
                longitude: store.longitude,
                free_shipping: store.free_shipping,
                highlights: store.highlights,
                highlights_title: store.highlights_title
            });

            setSpinnerUploadAvatar('none');
            setSuccessUploadAvatar('inline-block');

            setTimeout(() => {
                setSuccessUploadAvatar('none')
                setDivUploadAvatar('inline-block')
            }, 2000);

        }
        catch (err) {
            setSpinnerUploadAvatar('none');
            setErrorUploadAvatar('inline-block');

            setTimeout(() => {
                setErrorUploadAvatar('none')
                setDivUploadAvatar('inline-block')
            }, 2000);

            console.log('error post restaurants schedule day');
            console.log(err);
        }

    }

    function handleCancelAvatar() {
        setDivUploadAvatar('inline-block');
        setSaveUploadAvatar('none');

        setAvatarPreview(avatarRestaurante);
    }

    return (
        <>
            <header className="bg-dark mb-2">
                <PageHeader />
            </header>

            <Container>
                <Row>
                    <Col>
                        <BreadCrumb page="Perfil" />
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row>
                    <Col className="content">
                        <Tabs defaultActiveKey="profile" onSelect={(k) => k && setKey(k)} id="tab-store" >
                            <Tab eventKey="profile" className="mt-4" title="Perfil">
                                <Row className="text-center">
                                    <Col>
                                        <div className="container-images-restaurant">
                                            <div className="container-restaurant-cover">
                                                <div className="restaurant-cover">
                                                    <div className="container-image-cover">
                                                        <Image src={coverPreview} fluid thumbnail ></Image>
                                                        <div className="restaurant-cover-controls">
                                                            <div className="cover-select-container" style={{ display: divUploadCover }}>
                                                                <label htmlFor="coverfile">
                                                                    <BsCamera size={24} />
                                                                </label>
                                                            </div>

                                                            <div className="cover-buttons-container" style={{ display: saveUploadCover }}>
                                                                <Row>
                                                                    <Col>
                                                                        <Button variant="success" onClick={handleSaveCover} >
                                                                            <BsCloudUpload size={24} />
                                                                        </Button>
                                                                    </Col>
                                                                    <Col>
                                                                        <Button variant="danger" onClick={handleCancelCover} >
                                                                            <BsXCircle size={24} />

                                                                        </Button>
                                                                    </Col>
                                                                </Row>
                                                            </div>

                                                            <div className="cover-buttons-container" style={{ display: spinnerUploadCover }}>
                                                                <label>
                                                                    <Spinner
                                                                        as="span"
                                                                        animation="border"
                                                                        size="sm"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    />
                                                                </label>
                                                            </div>

                                                            <div className="cover-select-container-success" style={{ display: successUploadCover }}>
                                                                <label >
                                                                    <BsCheckCircle size={24} />
                                                                </label>
                                                            </div>

                                                            <div className="cover-buttons-container" style={{ display: errorUploadCover }}>
                                                                <label >
                                                                    <BsExclamationOctagon size={24} />
                                                                </label>
                                                            </div>

                                                            <input type="file" id="coverfile" onChange={handleSelectCover} className="avatar-image-input" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="container-restaurant-avatar">
                                                <div className="restaurant-avatar">
                                                    <Image src={avatarPreview} roundedCircle thumbnail ></Image>
                                                </div>
                                                <div className="restaurant-avatar-controls">
                                                    <div className="avatar-select-container" style={{ display: divUploadAvatar }}>
                                                        <label htmlFor="avatarfile">
                                                            <BsCamera size={24} />
                                                        </label>
                                                    </div>

                                                    <div className="avatar-buttons-container" style={{ display: saveUploadAvatar }}>
                                                        <Row>
                                                            <Col>
                                                                <Button variant="success" onClick={handleSaveAvatar} >
                                                                    <BsCloudUpload size={24} />
                                                                </Button>
                                                            </Col>
                                                            <Col>
                                                                <Button variant="danger" onClick={handleCancelAvatar} >
                                                                    <BsXCircle size={24} />

                                                                </Button>
                                                            </Col>
                                                        </Row>
                                                    </div>

                                                    <div className="avatar-buttons-container" style={{ display: spinnerUploadAvatar }}>
                                                        <label>
                                                            <Spinner
                                                                as="span"
                                                                animation="border"
                                                                size="sm"
                                                                role="status"
                                                                aria-hidden="true"
                                                            />
                                                        </label>
                                                    </div>

                                                    <div className="avatar-select-container-success" style={{ display: successUploadAvatar }}>
                                                        <label >
                                                            <BsCheckCircle size={24} />
                                                        </label>
                                                    </div>

                                                    <div className="avatar-buttons-container" style={{ display: errorUploadAvatar }}>
                                                        <label >
                                                            <BsExclamationOctagon size={24} />
                                                        </label>
                                                    </div>

                                                    <input type="file" id="avatarfile" onChange={handleSelectAvatar} className="cover-image-input" />
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col>
                                        {
                                            store && <Formik
                                                initialValues={
                                                    {
                                                        title: store.title,
                                                        phone: store.phone,
                                                        description: store.description,
                                                    }
                                                }
                                                onSubmit={async values => {
                                                    setSavingStoreStatus("saving");
                                                    setSavingStore(true);

                                                    try {
                                                        await api.put(`restaurants/${store.id}`, {
                                                            title: values.title,
                                                            phone: values.phone,
                                                            description: values.description,
                                                            min_order: storeMinOrder,
                                                            zip_code: store.zip_code,
                                                            street: store.street,
                                                            number: store.number,
                                                            group: store.group,
                                                            city: store.city,
                                                            country: store.country,
                                                            latitude: store.latitude,
                                                            longitude: store.longitude,
                                                            free_shipping: store.free_shipping,
                                                        });

                                                        const res = await api.get(`restaurants/${store.id}`);

                                                        handleStore(res.data);

                                                        setSavingStoreStatus("success");
                                                        setSavingStore(true);

                                                        setTimeout(() => {
                                                            setSavingStore(false);
                                                            setSavingStoreStatus("saving");
                                                        }, 2000);
                                                    }
                                                    catch {
                                                        setTimeout(() => {
                                                            setSavingStoreStatus("error");

                                                            setSavingStore(false);
                                                            setSavingStoreStatus("saving");
                                                        }, 2000);
                                                    }
                                                }}
                                                validationSchema={storeValidatiionSchema}
                                            >
                                                {({ handleChange, handleSubmit, values, errors }) => (
                                                    <Form onSubmit={handleSubmit} className="mt-4">
                                                        <Form.Row>
                                                            <Form.Group as={Col} controlId="formRestaurantName">
                                                                <Form.Label>Nome da empresa</Form.Label>
                                                                <Form.Control type="text"
                                                                    placeholder="Nome da sua empresa"
                                                                    onChange={handleChange}
                                                                    value={values.title}
                                                                    name="title"
                                                                    isInvalid={!!errors.title}
                                                                />
                                                                <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                                                                <Form.Text className="text-muted text-right">{`${values.title.length}/25 caracteres.`}</Form.Text>
                                                            </Form.Group>

                                                            <Form.Group as={Col} controlId="formRestaurantPhone">
                                                                <Form.Label>Telefone</Form.Label>
                                                                <Form.Control type="text"
                                                                    placeholder="Telefone da sua empresa"
                                                                    onChange={handleChange}
                                                                    value={values.phone}
                                                                    name="phone"
                                                                    isInvalid={!!errors.phone}
                                                                />
                                                            </Form.Group>
                                                        </Form.Row>

                                                        <Form.Group controlId="formRestaurantAbout">
                                                            <Form.Label>Descrição</Form.Label>
                                                            <Form.Control as="textarea"
                                                                rows={3}
                                                                onChange={handleChange}
                                                                value={values.description}
                                                                name="description"
                                                                isInvalid={!!errors.description}
                                                            />
                                                            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                                                            <Form.Text className="text-muted text-right">{`${values.description.length}/300 caracteres.`}</Form.Text>
                                                        </Form.Group>

                                                        <Row>
                                                            <Col lg={2}>
                                                                <Form.Group controlId="formRestaurantMinOrder">
                                                                    <Form.Label>Pedido mínimo</Form.Label>
                                                                    <InputGroup className="mb-2">
                                                                        <InputGroup.Prepend>
                                                                            <InputGroup.Text>R$</InputGroup.Text>
                                                                        </InputGroup.Prepend>
                                                                        <Form.Control
                                                                            type="text"
                                                                            placeholder="Valor"
                                                                            value={Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2 }).format(storeMinOrder)}
                                                                            onChange={(e) => setStoreMinOrder(
                                                                                Number(
                                                                                    maskCurrency(
                                                                                        e.target.value.replace('.', '').replace(',', '.')
                                                                                    )
                                                                                )
                                                                            )}
                                                                        />
                                                                    </InputGroup>
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <Button variant="danger" type="submit" >
                                                            {
                                                                savingStore ? (
                                                                    savingStoreStatus === "saving" ? <Spinner
                                                                        as="span"
                                                                        animation="border"
                                                                        size="sm"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    /> : (
                                                                        savingStoreStatus === "success" ? <BsCheckCircle size={24} /> : savingStoreStatus === "error" && <BsXCircle size={24} />
                                                                    )
                                                                ) : "Salvar"
                                                            }
                                                        </Button>
                                                    </Form>
                                                )}
                                            </Formik>
                                        }
                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="address" className="mt-4" title="Endereço">
                                <Row>
                                    <Col>
                                        {
                                            store && <Formik
                                                initialValues={
                                                    {
                                                        zip_code: store.zip_code,
                                                        street: store.street,
                                                        number: store.number,
                                                        group: store.group,
                                                        city: store.city,
                                                        country: store.country
                                                    }
                                                }
                                                onSubmit={async values => {
                                                    setSavingAddressStoreStatus("saving");
                                                    setSavingAddressStore(true);

                                                    try {
                                                        await api.put(`restaurants/${store.id}`, {
                                                            title: store.title,
                                                            phone: store.phone,
                                                            description: store.description,
                                                            min_order: store.min_order,
                                                            zip_code: values.zip_code,
                                                            street: values.street,
                                                            number: values.number,
                                                            group: values.group,
                                                            city: values.city,
                                                            country: values.country,
                                                            latitude: store.latitude,
                                                            longitude: store.longitude,
                                                            free_shipping: store.free_shipping,
                                                        });

                                                        const res = await api.get(`restaurants/${store.id}`);

                                                        handleStore(res.data);

                                                        setSavingAddressStoreStatus("success");
                                                        setSavingAddressStore(true);

                                                        setTimeout(() => {
                                                            setSavingAddressStore(false);
                                                            setSavingAddressStoreStatus("saving");
                                                        }, 2000);
                                                    }
                                                    catch {
                                                        setTimeout(() => {
                                                            setSavingAddressStoreStatus("error");

                                                            setSavingAddressStore(false);
                                                            setSavingAddressStoreStatus("saving");
                                                        }, 2000);
                                                    }
                                                }}
                                                validationSchema={addressStoreValidatiionSchema}
                                            >
                                                {({ handleChange, handleSubmit, values, setFieldValue, errors }) => (
                                                    <Form onSubmit={handleSubmit}>
                                                        <Row>
                                                            <Col lg={2} md={3} sm={5}>
                                                                <Form.Group controlId="zipCode">
                                                                    <Form.Label>CEP</Form.Label>
                                                                    <Form.Control type="text"
                                                                        placeholder="00000000"
                                                                        onChange={(e) => {
                                                                            handleChange(e);

                                                                            if (e.target.value !== '' && e.target.value.length === 8) {
                                                                                setSpinnerCep(true);
                                                                                cep(e.target.value)
                                                                                    .then((cep: CEP) => {
                                                                                        const { street, neighborhood, city, state } = cep;

                                                                                        setFieldValue('street', street);
                                                                                        setFieldValue('group', neighborhood);
                                                                                        setFieldValue('city', city);
                                                                                        setFieldValue('country', state);

                                                                                        setSpinnerCep(false);
                                                                                    })
                                                                                    .catch(() => {
                                                                                        setSpinnerCep(false);
                                                                                    });
                                                                            }
                                                                        }}
                                                                        value={values.zip_code}
                                                                        name="zip_code"
                                                                        isInvalid={!!errors.zip_code}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{errors.zip_code}</Form.Control.Feedback>
                                                                    <Form.Text className="text-muted text-right">Somente números</Form.Text>
                                                                </Form.Group>
                                                            </Col>
                                                            <Col style={{ display: 'flex', alignItems: 'center' }}>
                                                                {
                                                                    spinnerCep && <Spinner
                                                                        as="span"
                                                                        animation="border"
                                                                        variant="danger"
                                                                        role="status"
                                                                        size="sm"
                                                                        aria-hidden="true"
                                                                    />
                                                                }
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col lg={10}>
                                                                <Form.Group controlId="street">
                                                                    <Form.Label>Rua</Form.Label>
                                                                    <Form.Control type="text"
                                                                        onChange={handleChange}
                                                                        value={values.street}
                                                                        name="street"
                                                                        isInvalid={!!errors.street}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{errors.street}</Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                            <Col lg={2}>
                                                                <Form.Group controlId="number">
                                                                    <Form.Label>Número</Form.Label>
                                                                    <Form.Control type="text"
                                                                        onChange={handleChange}
                                                                        value={values.number}
                                                                        name="number"
                                                                        isInvalid={!!errors.number}
                                                                    />
                                                                    <Form.Control.Feedback type="invalid">{errors.number}</Form.Control.Feedback>
                                                                </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <Form.Row>
                                                            <Form.Group as={Col} controlId="neighborhood">
                                                                <Form.Label>Bairro</Form.Label>
                                                                <Form.Control type="text"
                                                                    onChange={handleChange}
                                                                    value={values.group}
                                                                    name="group"
                                                                    isInvalid={!!errors.group}
                                                                />
                                                                <Form.Control.Feedback type="invalid">{errors.group}</Form.Control.Feedback>
                                                            </Form.Group>
                                                            <Form.Group as={Col} controlId="city">
                                                                <Form.Label>Cidade</Form.Label>
                                                                <Form.Control type="text"
                                                                    onChange={handleChange}
                                                                    value={values.city}
                                                                    name="city"
                                                                    isInvalid={!!errors.city}
                                                                />
                                                                <Form.Control.Feedback type="invalid">{errors.city}</Form.Control.Feedback>
                                                            </Form.Group>
                                                            <Form.Group as={Col} controlId="state">
                                                                <Form.Label>Estado</Form.Label>
                                                                <Form.Control type="text"
                                                                    onChange={handleChange}
                                                                    value={values.country}
                                                                    name="country"
                                                                    isInvalid={!!errors.country}
                                                                />
                                                                <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                                                            </Form.Group>
                                                        </Form.Row>

                                                        <Button variant="danger" type="submit" >
                                                            {
                                                                savingAddressStore ? (
                                                                    savingAddressStoreStatus === "saving" ? <Spinner
                                                                        as="span"
                                                                        animation="border"
                                                                        size="sm"
                                                                        role="status"
                                                                        aria-hidden="true"
                                                                    /> : (
                                                                        savingAddressStoreStatus === "success" ? <BsCheckCircle size={24} /> : savingAddressStoreStatus === "error" && <BsXCircle size={24} />
                                                                    )
                                                                ) : "Salvar"
                                                            }
                                                        </Button>
                                                    </Form>
                                                )}
                                            </Formik>
                                        }

                                    </Col>
                                </Row>
                            </Tab>

                            <Tab eventKey="opened-days" className="mt-4" title="Horários" onClick={() => { }}>
                                {
                                    key === 'opened-days' && <OpenedDays />
                                }
                            </Tab>

                            <Tab eventKey="payments" className="mt-4" title="Formas de pagamento">
                                {
                                    key === 'payments' && <PaymentTypes />
                                }
                            </Tab>

                            <Tab eventKey="shipment" className="mt-4" title="Entrega">
                                {
                                    key === 'shipment' && <ShipmentTypes />
                                }
                            </Tab>

                            <Tab eventKey="access-management" className="mt-4" title="Gestão de acessos">
                                {
                                    key === "access-management" && <Users />
                                }
                            </Tab>
                        </Tabs>
                    </Col>
                </Row>
            </Container>
        </>
    )
};

export default Restaurants;