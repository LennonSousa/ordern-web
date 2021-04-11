import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format, addHours, addDays, isWithinInterval, startOfToday, endOfToday, eachDayOfInterval } from 'date-fns';
import br from 'date-fns/locale/pt-BR';
import { BsArrowRight } from 'react-icons/bs';
import { Container, Row, Col } from 'react-bootstrap';
import LineChart from '../../components/Graphs/LineChart';

import api from '../../services/api';
import { OrdersContext } from '../../context/ordersContext';
import { Order } from '../../components/Orders';
import { Customer } from '../../components/Customers';
import PageHeader from '../../components/PageHeader';
import BreadCrumb from '../../components/BreadCrumb';




import './styles.css';

interface ordersPerOur {
    total: number,
    range: string,
}

interface newRegisteredCustomer {
    day: Date,
    amount: number,
}

function Dashboard() {
    const { orders } = useContext(OrdersContext);

    const [ordersPerHour, setOrdersPerHour] = useState<number[]>([]);
    const [ordersTodayTotal, setOrdersTodayTotal] = useState(0);
    const [ordersTodayAmount, setOrdersTodayAmount] = useState(0);

    const [bestHourTotal, setBestHourTotal] = useState('');
    const [totalPerHour, setTotalPerHour] = useState(0);

    const [newRegisteredCustomers, setNewRegisteredCustomer] = useState<newRegisteredCustomer[]>();
    const [bestRegisteredCustomers, setBestRegisteredCustomers] = useState('');
    const [totalRegisteredCustomers, setTotalRegisteredCustomers] = useState(0);

    const startOfDay = startOfToday();
    const endOfDay = endOfToday();

    useEffect(() => {
        if (orders && orders.length > 0) {
            // --- Orders today graph --- //
            const ordersToday: Order[] = orders.filter(order => {
                return isWithinInterval(new Date(order.ordered_at), {
                    start: startOfDay,
                    end: endOfDay
                })
            });

            let amountToday = 0;

            ordersToday.forEach(order => {
                amountToday += Number(order.total);
            });

            setOrdersTodayTotal(amountToday);
            setOrdersTodayAmount(ordersToday.length);

            let ordersPerHourAmount: number[] = [];
            let totalPerHourAmount: ordersPerOur[] = [];

            for (let x = 0; x < 24; x++) {
                const ordersPerHour: Order[] = ordersToday.filter(order => {
                    return isWithinInterval(new Date(order.ordered_at), {
                        start: addHours(startOfDay, x),
                        end: addHours(startOfDay, x + 1)
                    })
                });

                // Best total
                let hourTotal = 0;

                ordersPerHour.forEach(order => {
                    hourTotal += Number(order.total);
                });

                // Orders in a hour
                totalPerHourAmount.push({ total: hourTotal, range: `${x < 10 ? `0${x}` : x}:00 - ${x + 1 < 10 ? `0${x + 1}` : x + 1}:00` });

                // Orders in a hour
                ordersPerHourAmount.push(ordersPerHour.length);
            }

            const bestHour = totalPerHourAmount.sort((a, b) => { return b.total - a.total })[0];

            setOrdersPerHour(ordersPerHourAmount);
            setTotalPerHour(bestHour.total);
            setBestHourTotal(bestHour.range);

            // --- New customers in last 7 days graph --- //
            api.get('customer', {
                params: {
                    start: addDays(startOfDay, -6),
                    end: endOfDay
                }
            })
                .then(res => {
                    const registeredCustomers: Customer[] = res.data;

                    const days = eachDayOfInterval({
                        start: addDays(startOfDay, -6),
                        end: endOfDay
                    });

                    let totalRegisteredCustomers: newRegisteredCustomer[] = [];

                    for (let x = 6; x >= 0; x--) {
                        const customersPerDay: Customer[] = registeredCustomers.filter(customer => {
                            return isWithinInterval(new Date(customer.created_at), {
                                start: addDays(startOfDay, -x),
                                end: addDays(endOfDay, -x)
                            })
                        });

                        totalRegisteredCustomers.push({ day: days[6 - x], amount: customersPerDay.length });
                    }

                    let newCustomersAmount = 0;

                    totalRegisteredCustomers.forEach(newCustomers => {
                        newCustomersAmount += Number(newCustomers.amount);
                    });

                    const bestDay = totalRegisteredCustomers.map((item: newRegisteredCustomer) => { return item });
                    bestDay.sort((a, b) => { return b.amount - a.amount })

                    setTotalRegisteredCustomers(newCustomersAmount);
                    setBestRegisteredCustomers(
                        `${format(bestDay[0].day, 'EEEE', { locale: br })} (${bestDay[0].amount} ${bestDay[0].amount === 1 ? "novo registro" : "novos registros"})`
                    );

                    setNewRegisteredCustomer(totalRegisteredCustomers);
                })
                .catch(err => {
                    console.log('Error to get customers. ', err)
                });
        }
    }, [orders]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <>
            <header className="bg-dark mb-2">
                <PageHeader />
            </header>

            <Container>
                <Row>
                    <Col>
                        <BreadCrumb page="" />
                    </Col>
                </Row>
            </Container>

            <Container>
                <Row className="content">
                    <Col>
                        <section className="mt-4 mb-4 border-top border-secondary">
                            <Row className="mt-2">
                                <Col>
                                    <h3 className="text-secondary">Hoje</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={8}>
                                    <LineChart
                                        labels={[
                                            '00:00',
                                            '01:00',
                                            '02:00',
                                            '03:00',
                                            '04:00',
                                            '05:00',
                                            '06:00',
                                            '07:00',
                                            '08:00',
                                            '09:00',
                                            '10:00',
                                            '11:00',
                                            '12:00',
                                            '13:00',
                                            '15:00',
                                            '16:00',
                                            '17:00',
                                            '18:00',
                                            '19:00',
                                            '20:00',
                                            '21:00',
                                            '22:00',
                                            '23:00'
                                        ]}
                                        label='Vendas'
                                        data={ordersPerHour}
                                    />
                                </Col>
                                <Col sm={4}>
                                    <Row style={
                                        {
                                            height: '50%',
                                            border: 'solid #969696',
                                            alignItems: 'center',
                                            borderWidth: '0 0 0.1rem 0',
                                        }
                                    }>
                                        <Col sm={8}><h6>Total</h6></Col>
                                        <Col sm={8}><h5 className="text-danger">{
                                            `${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ordersTodayTotal)} -  ${ordersTodayAmount === 1 ? `(${ordersTodayAmount} venda)` : `(${ordersTodayAmount} vendas)`}`
                                        }</h5></Col>
                                    </Row>

                                    <Row style={
                                        {
                                            height: '50%',
                                            alignItems: 'center'
                                        }
                                    }>
                                        <Col sm={8}><h6>Melhor horário</h6></Col>
                                        <Col sm={8}><h5 className="text-danger">{
                                            totalPerHour === 0 ? 'Sem vendas no dia' :
                                                `${bestHourTotal} (${Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalPerHour)})`
                                        }</h5></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </section>

                        <section className="mt-5 mb-4 border-top border-secondary">
                            <Row className="mt-2">
                                <Col>
                                    <h3 className="text-secondary">Novos clientes registrados (últimos 07 dias)</h3>
                                </Col>
                            </Row>
                            <Row>
                                <Col sm={8}>
                                    {
                                        newRegisteredCustomers && <LineChart
                                            labels={newRegisteredCustomers.map(item => { return format(item.day, 'EEE dd/MM', { locale: br }) })}
                                            label='Clientes registrados'
                                            data={newRegisteredCustomers.map(item => { return item.amount })}
                                        />
                                    }
                                </Col>
                                <Col sm={4}>
                                    <Row style={
                                        {
                                            height: '50%',
                                            border: 'solid #969696',
                                            alignItems: 'center',
                                            borderWidth: '0 0 0.1rem 0',
                                        }
                                    }>
                                        <Col sm={8}><h6>Total</h6></Col>
                                        <Col sm={8}><h5 className="text-danger">{`${totalRegisteredCustomers} ${totalRegisteredCustomers === 1 ? "novo registro" : "novos registros"}`}</h5></Col>
                                    </Row>

                                    <Row style={
                                        {
                                            height: '50%',
                                            alignItems: 'center'
                                        }
                                    }>
                                        <Col sm={8}><h6>Melhor dia</h6></Col>
                                        <Col sm={8}><h5 className="text-danger">{bestRegisteredCustomers}</h5></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </section>

                        <Row style={{ textAlign: 'end' }} className="mt-3">
                            <Col>
                                <Link className="nav-link" to="/reports">Mais relatórios <BsArrowRight /></Link>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        </>
    )
};

export default Dashboard;