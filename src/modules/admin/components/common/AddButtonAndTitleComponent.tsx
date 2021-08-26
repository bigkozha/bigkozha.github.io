import React, { PureComponent } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';

export default class AddButtonAndTitleComponent extends PureComponent<any, any> {
    public render() {
        const { title, onClickAction } = this.props;
        return (
            <h4>
                <b>{title}</b>
                <Button
                    className="pull-right"
                    style={{ marginTop: '-7px' }}
                    icon={<PlusOutlined />}
                    onClick={onClickAction}
                >
                    Add new
                </Button>
            </h4>
        );
    }
}
