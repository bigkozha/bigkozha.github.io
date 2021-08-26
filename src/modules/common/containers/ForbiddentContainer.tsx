import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

class ForbiddenContainer extends React.Component<any, any> {
    public render(): JSX.Element {
        return (
            <Result
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
                extra={
                    <Link to="/">
                        <Button>Go to main page</Button>
                    </Link>
                }
            />
        );
    }
}

export default ForbiddenContainer;
