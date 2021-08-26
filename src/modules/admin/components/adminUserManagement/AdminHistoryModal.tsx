import React, { PureComponent } from 'react';
import { Modal, Table, notification } from 'antd';
import moment from 'moment';
import ShowMoreText from 'react-show-more-text';
import { isEmptyOrSpaces } from '../../../common/helpers';
import { getAdminHistory } from '../../async';

class AdminHistoryLogModal extends PureComponent<any, any> {
    public state = {
        data: [],
        loading: false,
    };

    public componentDidMount = () => {
        this.setState({ loading: true }, this.loadHistory);
    };

    public loadHistory = async () => {
        const { record } = this.props;
        try {
            const id = record.id;
            const response = await getAdminHistory(id);
            this.setState({ data: response.data.data });
        } catch (error) {
            console.log(error.response);
            notification.error({
                message: 'Error on loading history',
                description: 'Something went wrong. Please try again',
            });
        }
        this.setState({ loading: false });
    };

    public render() {
        const { data, loading } = this.state;
        const { onClose, record } = this.props;

        const columns = [
            { title: <b>Action</b>, dataIndex: 'action', width: '8%' },
            {
                title: <b>When</b>,
                dataIndex: 'when',
                width: '12%',
                render: (text: any, record: any, index: any) => moment(text).format('DD/MM/YYYY HH:mm'),
            },
            {
                title: <b>Admin info</b>,
                dataIndex: 'nk',
                width: '25%',
                render: (text: any, record: any, index: any) =>
                    !isEmptyOrSpaces(text) ? (
                        <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
                            {record.fullName} ({record.nk}) - {record.position}
                        </div>
                    ) : (
                        ''
                    ),
            },
            {
                title: <b>Roles</b>,
                dataIndex: 'roles',
                width: '18%',
                render: (text: any, record: any, index: any) => (
                    <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>
                ),
            },
            { title: <b>Is active</b>, dataIndex: 'isActive', width: '8%' },
            {
                title: <b>Comment</b>,
                dataIndex: 'comment',
                width: '15%',
                render: (text: any, record: any, index: any) => (
                    <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>
                        <ShowMoreText anchorClass="shomMoreClassCss" lines={2}>
                            {text}
                        </ShowMoreText>
                    </div>
                ),
            },
            { title: <b>User</b>, dataIndex: 'user', width: '14%' },
        ];

        return (
            <Modal
                title="Admin user history"
                centered={true}
                visible={true}
                keyboard={false}
                maskClosable={false}
                width="70%"
                footer={null}
                onCancel={onClose}
            >
                <div className="container-fluid">
                    <div className="row form-horizontal">
                        <div className="form-group">
                            <label className="col-md-2">Identificator:</label>
                            <div className="col-md-10">{record.id}</div>
                        </div>
                        <Table
                            rowKey={(record) => record.key}
                            dataSource={data}
                            loading={loading}
                            columns={columns}
                            scroll={{ x: 1284.09, y: undefined }}
                            pagination={{ hideOnSinglePage: true, pageSize: 5 }}
                            bordered={true}
                        />
                    </div>
                </div>
            </Modal>
        );
    }
}
export default AdminHistoryLogModal;
