import React from 'react';

import { Link } from 'react-router-dom';

import { Breadcrumb } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

interface BreadCrumbProps {
    page: string;
}

const BreadCrumb: React.FC<BreadCrumbProps> = (props) => {
    return (
        <div className="col">
                <Breadcrumb>
                    <Breadcrumb.Item linkAs="div">
                        <Link to="/panel">Início</Link>
                    </Breadcrumb.Item>

                    <Breadcrumb.Item active>
                        {props.page}
                    </Breadcrumb.Item>
                </Breadcrumb>
        </div>
    );
}

export default BreadCrumb;