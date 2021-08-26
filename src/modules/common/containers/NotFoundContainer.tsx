import { Button, Result } from 'antd';
import React from 'react';
import { Link } from 'react-router-dom';

class NotFoundContainer extends React.Component<any, any> {
    public render(): JSX.Element {
        return (
            <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Link to="/">
                        <Button>Go to main page</Button>
                    </Link>
                }
            />
        );
    }
}

export default NotFoundContainer;
