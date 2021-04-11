import { AccessControl } from 'accesscontrol';

const grantsObject = {
    1: { // admin
        user: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
        },
        store: {
            'read:any': ['*'],
            'update:any': ['*'],
        },
        categories: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
        },
        additionals: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
        },
        products: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
        },
        highlights: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
        },
        orders: {
            'read:any': ['*'],
            'update:any': ['*'],
        },
        reports: {
            'read:any': ['*'],
            'update:any': ['*'],
        }
    },

    2: { // manager
        categories: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
        },
        additionals: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
        },
        products: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
        },
        highlights: {
            'create:any': ['*'],
            'read:any': ['*'],
            'update:any': ['*'],
            'delete:any': ['*'],
        },
        orders: {
            'read:any': ['*'],
            'update:any': ['*'],
        },
        reports: {
            'read:any': ['*'],
            'update:any': ['*'],
        }
    },

    3: { // operator
        additionals: {
            'read:any': ['*'],
        },
        products: {
            'read:any': ['*'],
        },
        highlights: {
            'read:any': ['*'],
        },
        orders: {
            'read:any': ['*'],
            'update:any': ['*'],
        },
    },

    4: { // delivery
        orders: {
            'read:any': ['*'],
            'update:any': ['*'],
        },
    }
};

const rbac = new AccessControl(grantsObject); // Role and Attribute based Access Control

export default rbac;