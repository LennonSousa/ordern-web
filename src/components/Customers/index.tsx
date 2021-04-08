import React from 'react';

export interface Customer {
    id: number;
    name: string;
    cpf: string;
    birth: Date;
    phone: string;
    email: string;
    active: boolean;
    created_at: Date;
    paused: boolean;
    address: CustomerAddress[];
}

interface CustomerAddress{
    id: number;
    zip_code: string;
    street: string;
    number: string;
    group: string;
    complement: string;
    city: string;
    country: string;
    type: string;
}