import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { changeAdminFiltersReducer } from '../ducks/adminSideDucks';
import { connect } from 'react-redux';
import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { notification, Spin, Table, Divider, Button } from 'antd';
import { editAdmin } from '../async';
import AddButtonAndTitle from './common/AddButtonAndTitleComponent';
import DeactivationModal from './common/DeactivateRsaonModal';
import DetailsModal from './adminUserManagement/AdminViewDetailsModal';
import AddModal from './adminUserManagement/AdminAddModal';
import HistoryModal from './adminUserManagement/AdminHistoryModal';
import EditModal from './adminUserManagement/AdminEditModal';
import FilterPanel from './adminUserManagement/FilterAdminsPanel';
// import { UsersClient } from '../../../services/Client';

const ButtonGroup = Button.Group;
const ModalType = {
    Add: 'Add',
    Edit: 'Edit',
    Details: 'Details',
    History: 'History',
    Deactivation: 'Deactivation',
};

const Parameter = {
    NkOrName: 'NkOrName',
    Role: 'Role',
    IsActive: 'IsActive',
};

class UserManagementListComponent extends PureComponent<any, any> {
    // usersClient = new UsersClient();
    constructor(props: any) {
        super(props);
        this.state = {
            filter: this.props.UserManagementFilter,
            loading: false,
            data: [],
            total: 0,
            allRoles: [],
            tempRecord: null,
            modalSaving: false,
            addModalVisible: false,
            viewDetailsModal: false,
            historyLogModal: false,
            editModalVisible: false,
            deactivateModalVisible: false,
        };
    }

    public componentDidMount = () => {
        this.setState({ loading: true }, this.loadRoles);
    };

    public loadRoles = async () => {
        try {
            // const response = await this.usersClient.getRoles();
            // this.setState({ allRoles: response });
        } catch (error) {
            console.error('Error: ', error);
            notification.error({
                message: 'Error on loading all roles',
                description: error.toString(),
            });
        }
        this.setState({}, this.loadAllData);
    };

    public loadAllData = async () => {
        const { UserManagementFilter } = this.props;
        try {
            const queryData = {
                PageNumber: UserManagementFilter.CurrentPage,
                PageSize: UserManagementFilter.CountPerPage,
            };
            // const response = await this.usersClient.getUsers(queryData.PageNumber, queryData.PageSize);
            // this.setState({ data: response.items, total: response.totalCount });
        } catch (error) {
            console.error('Error: ', error);
            notification.error({
                message: 'Error on loading admins list',
                description: error.toString(),
            });
        }
        this.setState({ loading: false });
    };

    public onOpenModals = (temp: any, type: string) => {
        switch (type) {
            case ModalType.Add:
                this.setState({ addModalVisible: true });
                break;
            case ModalType.Details:
                this.setState({ tempRecord: temp, viewDetailsModal: true });
                break;
            case ModalType.Edit:
                this.setState({ tempRecord: temp, editModalVisible: true });
                break;
            case ModalType.Deactivation:
                this.setState({ tempRecord: temp, deactivateModalVisible: true });
                break;
            default:
                this.setState({ tempRecord: temp, historyLogModal: true });
                break;
        }
    };

    public onCloseModals = (type: string) => {
        switch (type) {
            case ModalType.Add:
                this.setState({ addModalVisible: false });
                break;
            case ModalType.Details:
                this.setState({ viewDetailsModal: false, tempRecord: null });
                break;
            case ModalType.Edit:
                this.setState({ editModalVisible: false, tempRecord: null });
                break;
            case ModalType.Deactivation:
                this.setState({ deactivateModalVisible: false, tempRecord: null });
                break;
            default:
                this.setState({ historyLogModal: false, tempRecord: null });
                break;
        }
    };

    public onCreateAdmin = async (nk: string, roles: any) => {
        const { changeAdminFiltersReducer } = this.props;
        try {
            this.setState({ modalSaving: true });
            // await this.usersClient.add({ nk: nk, roles: roles });
            notification.success({
                message: 'Success',
                description: 'New admin successfully created.',
            });
            this.setState({ addModalVisible: false });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response.data.errors[0],
            });
        }
        const filter = {
            NkOrName: null,
            Roles: [],
            CurrentPage: 1,
            CountPerPage: 10,
            Expand: false,
        };
        changeAdminFiltersReducer({ UserManagementFilter: filter });
        this.setState({ modalSaving: false, loading: true, filter }, this.loadAllData);
    };

    public onEditAdmin = async (id: string, nk: string, roles: any, reason: string) => {
        try {
            this.setState({ modalSaving: true });
            const data = {
                Id: id,
                Nk: nk,
                Roles: roles,
                Comment: reason,
            };
            await editAdmin(data);
            notification.success({
                message: 'Success',
                description: 'Admin record successfully edited.',
            });
            this.setState({ editModalVisible: false, tempRecord: null });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response.data.errors[0],
            });
        }
        this.setState({ modalSaving: false }, this.loadAllData);
    };

    public onDeactivate = async (reason: string) => {
        const { tempRecord } = this.state;
        try {
            this.setState({ modalSaving: true });
            // await this.usersClient.deactivate({ id: tempRecord.id, comment: reason });
            notification.success({
                message: 'Success',
                description: 'Admin user successfully deactivated.',
            });
            this.setState({ deactivateModalVisible: false, tempRecord: null });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response.data.errors[0],
            });
        }
        this.setState({ modalSaving: false }, this.loadAllData);
    };

    public tableTitle = () => {
        const { total, filter, allRoles } = this.state;
        return (
            <FilterPanel
                filter={filter}
                total={total}
                onSearch={this.onSearch}
                onReset={this.onReset}
                onHandleParameters={this.onHandleParameters}
                roles={allRoles}
            />
        );
    };

    public onSearch = () => {
        const { filter } = this.state;
        const { changeAdminFiltersReducer } = this.props;
        changeAdminFiltersReducer({ UserManagementFilter: { ...filter, CurrentPage: 1, Expand: true } });
        this.setState(
            {
                filter: { ...filter, CurrentPage: 1, Expand: true },
                loading: true,
            },
            this.loadAllData
        );
    };

    public onReset = () => {
        const { changeAdminFiltersReducer } = this.props;
        const filter = {
            NkOrName: null,
            Roles: [],
            IsActive: [],
            CurrentPage: 1,
            CountPerPage: 10,
            Expand: false,
        };
        changeAdminFiltersReducer({ UserManagementFilter: filter });
        this.setState({ loading: true, filter }, this.loadAllData);
    };

    public onChangePage = async (page: any) => {
        const { UserManagementFilter, changeAdminFiltersReducer } = this.props;
        changeAdminFiltersReducer({ UserManagementFilter: { ...UserManagementFilter, CurrentPage: page } });
        this.setState(
            {
                loading: true,
                filter: UserManagementFilter,
            },
            this.loadAllData
        );
    };

    public onHandleParameters = (value: any, type: string) => {
        const { filter } = this.state;
        switch (type) {
            case Parameter.NkOrName:
                const query = value.target ? value.target.value.toLowerCase() : value.toLowerCase();
                this.setState({
                    filter: { ...filter, NkOrName: query.length > 0 ? query : null },
                });
                break;
            case Parameter.Role:
                this.setState({
                    filter: { ...filter, Roles: value },
                });
                break;
        }
    };

    public render() {
        const { UserManagementFilter } = this.props;
        const {
            data,
            loading,
            addModalVisible,
            modalSaving,
            viewDetailsModal,
            historyLogModal,
            editModalVisible,
            deactivateModalVisible,
            tempRecord,
            total,
            allRoles,
        } = this.state;

        const columns = [
            {
                title: <b>NK</b>,
                dataIndex: 'nk',
                width: '12%',
                render: (text: any, record: any, index: any) => (
                    <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>
                ),
            },
            {
                title: <b>Full name</b>,
                dataIndex: 'fullName',
                width: '43%',
                render: (text: any, record: any, index: any) => (
                    <div style={{ wordWrap: 'break-word', wordBreak: 'break-all' }}>{text}</div>
                ),
            },
            {
                title: <b>Action</b>,
                key: 'operation',
                fixed: false,
                width: '34%',
                render: (text: any, record: any, index: any) => (
                    <div>
                        <ButtonGroup>
                            <Button onClick={() => this.onOpenModals(record, ModalType.Details)}>
                                <EyeOutlined /> Details
                            </Button>
                            {/* <Button type="primary" onClick={() => this.onOpenModals(record, ModalType.Edit)}>
                                <EditOutlined /> Edit
                            </Button> */}
                        </ButtonGroup>
                        <Button
                            danger={true}
                            style={{ marginLeft: '15px' }}
                            onClick={() => this.onOpenModals(record, ModalType.Deactivation)}
                        >
                            <CloseOutlined />
                        </Button>
                    </div>
                ),
            },
        ];

        const that = this;
        const pagination = {
            total,
            current: UserManagementFilter.CurrentPage,
            hideOnSinglePage: true,
            pageSize: UserManagementFilter.CountPerPage,
            onChange: (page: any) => that.onChangePage(page),
        };

        return (
            <div className="componentContent">
                <Spin spinning={loading}>
                    {viewDetailsModal && (
                        <DetailsModal onClose={() => this.onCloseModals(ModalType.Details)} value={tempRecord} />
                    )}
                    {deactivateModalVisible && (
                        <DeactivationModal
                            onSubmit={this.onDeactivate}
                            onClose={() => this.onCloseModals(ModalType.Deactivation)}
                            modalSaving={modalSaving}
                        />
                    )}
                    {historyLogModal && (
                        <HistoryModal record={tempRecord} onClose={() => this.onCloseModals(ModalType.History)} />
                    )}
                    {editModalVisible && (
                        <EditModal
                            record={tempRecord}
                            onClose={() => this.onCloseModals(ModalType.Edit)}
                            onSubmit={this.onEditAdmin}
                            modalSaving={modalSaving}
                            roles={allRoles}
                        />
                    )}
                    <AddButtonAndTitle
                        title={'User Management'}
                        onClickAction={() => this.onOpenModals(null, ModalType.Add)}
                    />
                    {addModalVisible && (
                        <AddModal
                            onClose={() => this.onCloseModals(ModalType.Add)}
                            onSubmit={this.onCreateAdmin}
                            modalSaving={modalSaving}
                            roles={allRoles}
                        />
                    )}
                    <Divider style={{ marginBottom: '10px' }} />
                    <Table
                        rowKey={(record) => record.id}
                        title={this.tableTitle}
                        dataSource={data}
                        scroll={{ x: 1140, y: undefined }}
                        columns={columns}
                        bordered={true}
                        pagination={pagination}
                    />
                </Spin>
            </div>
        );
    }
}
const mapStateToProp = (state: any) => {
    const { UserManagementFilter } = state.adminUserManagementDuck;
    return { UserManagementFilter };
};

const mapDispatchToProp = (dispatch: any) => bindActionCreators({ changeAdminFiltersReducer }, dispatch);

export default connect(mapStateToProp, mapDispatchToProp)(UserManagementListComponent);
