import React, { PureComponent } from 'react';
import { Form } from 'antd';
import { Modal, Input, InputNumber, Button, notification, Select, Spin } from 'antd';
import '../../css/AddCategoryModal.css';
import { errorHelperGenerator, isEmptyOrSpaces } from '../../../common/helpers';
import { getUserFromAdByNk } from '../../async';
import { isNullOrUndefined } from 'util';

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;

const ValidateStringType = {
    Nk: 'Nk',
    Role: 'Role',
    Reason: 'Reason',
};

export default class AdminAddModal extends PureComponent<any, any> {
    constructor(props: any) {
        super(props);
        const validityStatuses: any = {};
        const record = this.props.record;
        this.state = {
            Id: record.id,
            loading: false,
            Nk: null,
            validityStatus: validityStatuses,
            Roles: record.roles.map((x: any) => {
                return x.id;
            }),
            Employee: {
                nk: record.nk,
                fullName: record.fullName,
                position: record.jobTitle,
            },
            Reason: null,
        };
    }

    public componentDidMount = () => {
        this.setState({}, this.validateInputs);
    };

    public validateInputs = () => {
        const { Employee, Roles, Reason } = this.state;
        const validityStatus: any = {};
        if (isNullOrUndefined(Employee)) {
            validityStatus.Employee = errorHelperGenerator('Please find user');
        }
        if (Roles.length === 0) {
            validityStatus.Roles = errorHelperGenerator('Please choose roles');
        }
        if (isEmptyOrSpaces(Reason)) {
            validityStatus.Reason = errorHelperGenerator('Please write reason for editing');
        }
        this.setState({ validityStatus });
    };

    public onOk = async () => {
        const { onSubmit } = this.props;
        await this.validateInputs();
        const { Id, Employee, Roles, Reason, validityStatus } = this.state;
        if (Object.keys(validityStatus).length === 0) {
            onSubmit(Id, Employee.nk, Roles, Reason);
        }
    };

    public onChange = (e: any, type: string) => {
        const value = e && e.target ? e.target.value : e;
        switch (type) {
            case ValidateStringType.Nk:
                this.setState({ Nk: value });
                break;
            case ValidateStringType.Role:
                this.setState({ Roles: value }, this.validateInputs);
                break;
            case ValidateStringType.Reason:
                this.setState({ Reason: value }, this.validateInputs);
                break;
        }
    };

    public onSearchUser = async () => {
        const { Nk } = this.state;
        this.setState({ loading: true });
        try {
            const response = await getUserFromAdByNk(Nk);
            const responseData = response.data.data;
            this.setState({ Employee: responseData });
        } catch (error) {
            console.error('Error: ', error);
            notification.error({
                message: 'Error',
                description: 'Error on searching user. Try again.',
            });
        }
        this.setState({ loading: false }, this.validateInputs);
    };

    public render() {
        const { onClose, modalSaving, roles } = this.props;
        const { validityStatus, Nk, Employee, Roles, Reason, loading } = this.state;

        return (
            <Modal
                title="Edit admin"
                centered={true}
                visible={true}
                keyboard={false}
                maskClosable={false}
                onCancel={onClose}
                confirmLoading={modalSaving}
                okText="Create"
                onOk={this.onOk}
            >
                <Spin spinning={loading}>
                    <Form layout="vertical">
                        <div className="container-fluid">
                            <div className="row form-horizontal">
                                <div className="form-group">
                                    <label className="col-md-2">Nk</label>
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
                                    <label className="col-md-2">User</label>
                                    <div className="col-md-10">
                                        {Employee === null && (
                                            <span style={{ color: 'red' }}>
                                                User with such Nk not found. Check entered Nk
                                            </span>
                                        )}
                                        {Employee && (
                                            <span>
                                                {Employee.fullName} ({Employee.nk}) - {Employee.position}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-md-2">Roles</label>
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
                                                {roles.map((item: any) => (
                                                    <Option key={item.id} value={item.id!} title={item.normalizedName}>
                                                        {item.normalizedName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </FormItem>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="col-md-2">Reason</label>
                                    <div className="col-md-10">
                                        <FormItem
                                            style={{ marginBottom: '4px' }}
                                            className="forValidation"
                                            {...validityStatus.Reason}
                                        >
                                            <TextArea
                                                onChange={(e) => this.onChange(e, ValidateStringType.Reason)}
                                                value={Reason}
                                                rows={4}
                                            />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}
