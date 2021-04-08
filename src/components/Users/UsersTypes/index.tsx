import React from 'react';

import { Form, Row, Col, ListGroup } from 'react-bootstrap';

export interface UserType {
    id: number;
    type: number;
    description: string;
    code: number;
}

interface UsersTypesProps {
    userType: UserType;
    handleChecks: any;
    handleChange: any;
    selected?: boolean;
}

const UsersTypesItem: React.FC<UsersTypesProps> = ({ userType, handleChecks, handleChange, selected = false }) => {
    return (
        <ListGroup.Item action as="div" variant="light">
            <Row>
                <Col>
                    <Form.Check
                        checked={selected}
                        required
                        type="radio"
                        label={userType.type}
                        name="type"
                        id={`formHorizontalRadios${userType.id}`}
                        value={userType.id}
                        onClick={() => { handleChecks(userType.id) }}
                        onChange={handleChange}
                    />
                </Col>
                <Col>
                    {userType.description}
                </Col>
            </Row>
        </ListGroup.Item>
    )
}

export default UsersTypesItem;