import React, { PureComponent } from 'react';
// import { Form } from '@ant-design/compatible';
import { Modal, InputNumber, Button, notification, Select, Spin } from 'antd';
import '../../css/AddCategoryModal.css';
// import { errorHelperGenerator } from '../../../common/helpers';
import { isNullOrUndefined } from 'util';
// import { AdUsersClient, RoleVm } from '../../../../services/Client';

// const FormItem = Form.Item;
// const Option = Select.Option;

const ValidateStringType = {
    Nk: 'Nk',
    Role: 'Role',
};

export default class AdminAddModal extends PureComponent<any, any> {
    // adUsersClient = new AdUsersClient();

    constructor(props: any) {
        super(props);
        const validityStatuses: any = {};
        this.state = {
            loading: false,
            Nk: null,
            validityStatus: validityStatuses,
            Roles: [],
            Employee: undefined,
        };
    }

    // public componentDidMount = () => {
    //     this.setState({}, this.validateInputs);
    // };

    // public validateInputs = () => {
    //     const { Employee, Roles } = this.state;
    //     const validityStatus: any = {};
    //     if (isNullOrUndefined(Employee)) {
    //         validityStatus.Employee = errorHelperGenerator('Please find user');
    //     }
    //     if (Roles.length === 0) {
    //         validityStatus.Roles = errorHelperGenerator('Please choose roles');
    //     }
    //     this.setState({ validityStatus });
    // };

    // public onOk = async () => {
    //     const { onSubmit } = this.props;
    //     await this.validateInputs();
    //     const { Employee, Roles, validityStatus } = this.state;
    //     if (Object.keys(validityStatus).length === 0) {
    //         onSubmit(Employee[0].nk, Roles);
    //     }
    // };

    // public onChange = (e: any, type: string) => {
    //     const value = e && e.target ? e.target.value : e;
    //     switch (type) {
    //         case ValidateStringType.Nk:
    //             this.setState({ Nk: value });
    //             break;
    //         case ValidateStringType.Role:
    //             this.setState({ Roles: value }, this.validateInputs);
    //             break;
    //     }
    // };

    // public onSearchUser = async () => {
    //     const { Nk } = this.state;
    //     this.setState({ loading: true });
    //     try {
    //         const response = await this.adUsersClient.getUsersFromAdByQuery(Nk);
    //         this.setState({ Employee: response });
    //     } catch (error) {
    //         console.error('Error: ', error);
    //         notification.error({
    //             message: 'Error on searching user. Try again.',
    //             description: error.toString(),
    //         });
    //     }
    //     this.setState({ loading: false }, this.validateInputs);
    // };

    public render() {
        const { onClose, modalSaving, roles } = this.props;
        const { validityStatus, Nk, Employee, Roles, loading } = this.state;

        return (
            <Modal
                title="Add new user"
                // centered={true}
                // visible={true}
                visible={false}
            // keyboard={false}
            // maskClosable={false}
            // onCancel={onClose}
            // confirmLoading={modalSaving}
            // okText="Create"
            // onOk={this.onOk}
            >
                {/* <Spin spinning={loading}>
                    <Form layout="vertical">
                        <div className="container-fluid">
                            <div className="row form-horizontal">
                                <div className="form-group">
                                    <label className="col-md-2">Nk:</label>
                                    <div className="col-md-7">
                                        <FormItem
                                            style={{ marginBottom: '4px' }}
                                            className="forValidation"
                                            {...validityStatus.Employee}
                                        >
                                            <InputNumber
                                                placeholder="Type user nk"
                                                onChange={(e) => this.onChange(e, ValidateStringType.Nk)}
                                                value={Nk}
                                                style={{ width: '100%' }}
                                                min={10000000}
                                                max={99999999}
                                            />
                                        </FormItem>
                                    </div>
                                    <div className="col-md-3">
                                        <Button
                                            disabled={isNullOrUndefined(Nk)}
                                            type="primary"
                                            onClick={this.onSearchUser}
                                            block={true}
                                        >
                                            Search
                                        </Button>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-md-2">User:</label>
                                    <div className="col-md-10">
                                        {Employee === undefined && (
                                            <span style={{ color: 'red' }}>Please enter nk and click search</span>
                                        )}
                                        {Employee === null && (
                                            <span style={{ color: 'red' }}>
                                                User with such Nk not found. Check entered Nk
                                            </span>
                                        )}
                                        {Employee && (
                                            <span>
                                                {Employee[0].fullName} ({Employee[0].nk}) - {Employee[0].position}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-md-2">Roles:</label>
                                    <div className="col-md-10">
                                        <FormItem
                                            style={{ marginBottom: '4px' }}
                                            className="forValidation"
                                            {...validityStatus.Roles}
                                        >
                                            <Select
                                                mode="multiple"
                                                showSearch={true}
                                                value={Roles}
                                                optionFilterProp="title"
                                                placeholder="Please select"
                                                onChange={(e: any, option: any) =>
                                                    this.onChange(e, ValidateStringType.Role)
                                                }
                                            >
                                                {roles.map((item: RoleVm) => (
                                                    <Option
                                                        value={item.name!}
                                                        key={item.name}
                                                        title={item.normalizedName}
                                                    >
                                                        {item.name}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Spin> */}
            </Modal>
        );
    }
}
