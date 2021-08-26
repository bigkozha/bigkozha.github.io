import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

const InternalError = (): JSX.Element => (
    <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong. Please contact with IT Administrator"
        extra={
            <Link to="/">
                <Button>Go to main page</Button>
            </Link>
        }
    />
);

export default InternalError;
