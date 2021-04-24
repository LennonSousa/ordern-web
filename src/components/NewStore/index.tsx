import React, { ChangeEvent, useState } from 'react';
import { Container, Row, Col, Button, Form, Image, Spinner, InputGroup, Modal } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { BsCamera, BsXCircle, BsCheckCircle } from 'react-icons/bs';
import cep, { CEP } from 'cep-promise';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { format } from 'date-fns';

import api from '../../services/api';
import { UserType } from '../Users/UsersTypes';
import { maskCurrency } from '../../utils/maskCurrency';

import './styles.css';
import activatedUserImg from '../../assets/images/undraw_Astronaut_re_8c33.svg';
import error404Img from '../../assets/images/undraw_page_not_found_su7k.svg';

const storeValidatiionSchema = Yup.object().shape({
    title: Yup.string().required('Obrigatório!').max(25, 'Deve conter no máximo 25 caracteres!'),
    phone: Yup.string().notRequired(),
    description: Yup.string().notRequired().max(300, 'Deve conter no máximo 300 caracteres!'),
    zip_code: Yup.string().required('Obrigatório!').min(8, 'Deve conter no mínimo 8 caracteres!').max(8, 'Deve conter no máximo 8 caracteres!'),
    street: Yup.string().required('Obrigatório!'),
    number: Yup.string().required('Obrigatório!'),
    group: Yup.string().required('Obrigatório!'),
    complement: Yup.string().notRequired(),
    city: Yup.string().required('Obrigatório!'),
    state: Yup.string().required('Obrigatório!'),
});

const userValidatiionSchema = Yup.object().shape({
    name: Yup.string().required('Obrigatório!'),
    cpf: Yup.string().notRequired(),
    birth: Yup.date().required('Obrigatório!'),
});

let savingStatus: "saving" | "success" | "error";

interface NewStoreProps {
    email: string;
    token: string;
}

const NewStore: React.FC<NewStoreProps> = ({ email, token }) => {
    const history = useHistory();

    const [newUser, setNewUser] = useState(false);

    const [coverPreview, setCoverPreview] = useState('');
    const [selectedCover, setSelectedCover] = useState<File>();

    const [avatarPreview, setAvatarPreview] = useState('');
    const [selectedAvatar, setSelectedAvatar] = useState<File>();

    const [savingStore, setSavingStore] = useState(false);
    const [savingStoreStatus, setSavingStoreStatus] = useState<typeof savingStatus>("saving");

    const [storeMinOrder, setStoreMinOrder] = useState(0.00);

    const [spinnerCep, setSpinnerCep] = useState(false);

    const [isSaving, setIsSaving] = useState(false);

    const [showUserActivated, setShowUserActivated] = useState(false);
    const handleCloseUserActivated = () => setShowUserActivated(false);
    const handelShowUserActivated = () => setShowUserActivated(true);

    const [showError, setShowError] = useState(false);
    const handleCloseError = () => setShowError(false);
    const handelShowError = () => setShowError(true);

    function handleSelectCover(event: ChangeEvent<HTMLInputElement>) {
        try {
            console.log(event.target.files);
            if (event.target.files) {
                const image = event.target.files[0];

                setSelectedCover(image);

                setCoverPreview(URL.createObjectURL(image));
            }
        }
        catch {
        }
    }

    function handleSelectAvatar(event: ChangeEvent<HTMLInputElement>) {
        try {
            if (event.target.files) {
                const image = event.target.files[0];

                setSelectedAvatar(image);

                setAvatarPreview(URL.createObjectURL(image));
            }
        }
        catch {
        }
    }

    function handleToLogin() {
        handleCloseUserActivated();
        history.replace('/');
    }

    return (
        <Container>
            {
                newUser ? <Formik
                    initialValues={
                        {
                            name: '',
                            birth: format(new Date(), 'yyyy-MM-dd'),
                        }
                    }
                    onSubmit={async values => {
                        setIsSaving(true);

                        try {
                            const res = await api.get('users/types', {
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            const userTypes: UserType[] = res.data;

                            const adminUserType = userTypes.find(type => { return type.code === 1 });

                            if (!adminUserType) {
                                handelShowError();
                                return;
                            }

                            await api.post('users', {
                                name: values.name,
                                birth: values.birth,
                                email,
                                type: adminUserType.id,
                            }, {
                                headers: { Authorization: `Bearer ${token}` }
                            });

                            handelShowUserActivated();
                        }
                        catch (err) {
                            console.log('error put new user');
                            console.log(err);

                            handelShowError();
                        }

                        setIsSaving(false);
                    }}
                    validationSchema={userValidatiionSchema}
                >
                    {({ handleChange, handleSubmit, values, errors }) => (
                        <Form style={{ width: '100%' }} onSubmit={handleSubmit}>
                            <Row className="justify-content-center">
                                <Col sm={10}>
                                    <h1 className="text-danger">Loja criada!</h1>
                                    <h2 className="text-secondary">Agora você precisa criar o seu cadastro para acessar a plataforma.</h2>
                                </Col>
                            </Row>
                            <Row className="mt-2 justify-content-center">
                                <Col sm={10}>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="teamFormGridName">
                                            <Form.Label>Nome</Form.Label>
                                            <Form.Control type="text"
                                                onChange={handleChange}
                                                value={values.name}
                                                name="name"
                                                isInvalid={!!errors.name}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>

                                    <Form.Row>
                                        <Form.Group as={Col} sm={4} controlId="teamFormGridBirth">
                                            <Form.Label>Nascimento</Form.Label>
                                            <Form.Control
                                                type="date"
                                                onChange={handleChange}
                                                value={values.birth}
                                                name="birth"
                                                isInvalid={!!errors.birth}
                                            />
                                            <Form.Control.Feedback type="invalid">{errors.birth}</Form.Control.Feedback>
                                        </Form.Group>
                                    </Form.Row>
                                </Col>
                            </Row>
                            <Row className="justify-content-center">
                                <Col sm={10}>
                                    <Button variant="danger" type="submit">
                                        {
                                            isSaving ? <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            /> : "Salvar"
                                        }
                                    </Button>
                                </Col>
                            </Row>

                            <Modal
                                show={showUserActivated}
                                onHide={handleCloseUserActivated}
                                backdrop="static"
                                keyboard={false}
                            >
                                <Modal.Header>
                                    <Modal.Title className="text-danger">Confirme o seu e-mail</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Row>
                                        <Col className="mt-3" sm={6}>
                                            <Image fluid src={activatedUserImg} alt="Confirme o seu e-mail" />
                                        </Col>
                                        <Col className="mt-3 text-secondary" sm={6}>
                                            <p>Enviamos um e-mail para: <strong>{email}</strong></p>
                                            <p>Agora entre no seu e-mail e clique no endereço para ativar o seu cadastro.</p>
                                        </Col>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="danger" onClick={handleToLogin}>Tudo bem</Button>
                                </Modal.Footer>
                            </Modal>
                        </Form>
                    )}
                </Formik> :
                    <Formik
                        initialValues={
                            {
                                title: '',
                                phone: '',
                                description: '',
                                zip_code: '',
                                street: '',
                                number: '',
                                group: '',
                                complement: '',
                                city: '',
                                state: ''
                            }
                        }
                        onSubmit={async values => {
                            setSavingStoreStatus("saving");
                            setSavingStore(true);

                            try {
                                const data = new FormData();

                                data.append('title', values.title);
                                data.append('phone', values.phone);
                                data.append('description', values.description);
                                data.append('min_order', String(storeMinOrder));

                                selectedCover && data.append('cover', selectedCover);

                                selectedAvatar && data.append('avatar', selectedAvatar);

                                data.append('zip_code', values.zip_code);
                                data.append('street', values.street);
                                data.append('number', values.number);
                                data.append('group', values.group);
                                data.append('complement', values.complement);
                                data.append('city', values.city);
                                data.append('state', values.state);
                                data.append('latitude', '0');
                                data.append('longitude', '0');

                                await api.post('stores', data,
                                    {
                                        headers: { Authorization: `Bearer ${token}` }
                                    }
                                );

                                setSavingStoreStatus("success");
                                setSavingStore(true);

                                setTimeout(() => {
                                    setSavingStore(false);
                                    setSavingStoreStatus("saving");

                                    setNewUser(true);
                                }, 2000);
                            }
                            catch {
                                setTimeout(() => {
                                    setSavingStoreStatus("error");

                                    setSavingStore(false);
                                    setSavingStoreStatus("saving");

                                    handelShowError();
                                }, 2000);
                            }
                        }}
                        validationSchema={storeValidatiionSchema}
                    >
                        {({ handleChange, handleSubmit, values, setFieldValue, errors }) => (
                            <Form onSubmit={handleSubmit}>
                                <Row className="justify-content-center">
                                    <Col sm={10}>
                                        <h1 className="text-danger">Bem-vindo(a),</h1>
                                        <h2 className="text-secondary">Insira as informações da sua loja para iniciar na plataforma.</h2>
                                    </Col>
                                </Row>

                                <Row className="mt-3" style={{ minHeight: 300 }}>
                                    <Col
                                        sm={5}
                                        style={{
                                            boxShadow: '0 2px 2px rgb(0 0 0 / 30%)',
                                            borderRadius: 5,
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <Row
                                            style={{
                                                height: 100,
                                                backgroundColor: '#d3d3d3',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                position: 'relative',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    overflow: 'hidden',
                                                }}
                                            >
                                                <Image src={coverPreview} alt="Cover" style={{ width: '100%', objectFit: 'cover' }} ></Image>
                                            </div>

                                            <div
                                                style={{
                                                    width: 80,
                                                    height: 80,
                                                    backgroundColor: '#fff',
                                                    borderRadius: 50,
                                                    overflow: 'hidden',
                                                    position: 'absolute',
                                                    top: 10,
                                                }}
                                            >
                                                <Image src={avatarPreview} alt="Avatar" fluid style={{ objectFit: 'cover' }} ></Image>
                                            </div>
                                        </Row>
                                    </Col>
                                    <Col sm={4}>
                                        <Row className="justify-content-center">
                                            <Col sm={10}>
                                                <label className="btn btn-danger" htmlFor="avatarfile">
                                                    <BsCamera size={24} /> Logomarca
                                                </label>
                                                <input type="file" id="avatarfile" onChange={handleSelectAvatar} className="cover-image-input" />
                                            </Col>
                                        </Row>

                                        <Row className="mt-2 justify-content-center">
                                            <Col sm={10}>
                                                <label className="btn btn-danger" htmlFor="coverfile">
                                                    <BsCamera size={24} /> Capa
                                                </label>
                                                <input type="file" id="coverfile" onChange={handleSelectCover} className="avatar-image-input" />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>

                                <Row className="mt-3">
                                    <Col>
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
                                            <Col lg={3}>
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

                                        <Row>
                                            <Col lg={3} md={4} sm={6}>
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
                                                                        setFieldValue('state', state);

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

                                        <Row>
                                            <Col>
                                                <Form.Group controlId="complement">
                                                    <Form.Label>Complemento</Form.Label>
                                                    <Form.Control type="text"
                                                        onChange={handleChange}
                                                        value={values.complement}
                                                        name="complement"
                                                        isInvalid={!!errors.complement}
                                                    />
                                                    <Form.Control.Feedback type="invalid">{errors.complement}</Form.Control.Feedback>
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
                                                    value={values.state}
                                                    name="state"
                                                    isInvalid={!!errors.state}
                                                />
                                                <Form.Control.Feedback type="invalid">{errors.state}</Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>

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

                                    </Col>
                                </Row>
                            </Form>
                        )}
                    </Formik>
            }

            <Modal show={showError}
                onHide={handleCloseError} >
                <Modal.Header>
                    <Modal.Title className="text-danger">Algo deu errado!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col className="mt-3" sm={6}>
                            <Image fluid src={error404Img} alt="Erro de conexão" />
                        </Col>
                        <Col className="mt-3 text-secondary" sm={6}>
                            <p>Infelizmente algo deu errado com a sua solicitação.</p>
                            <p>Pode ser a conexão com a internet ou o nosso servidor. Por favor tente outra vez.</p>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseError}>Entendi</Button>
                </Modal.Footer>
            </Modal>
        </Container >
    )
};

export default NewStore;