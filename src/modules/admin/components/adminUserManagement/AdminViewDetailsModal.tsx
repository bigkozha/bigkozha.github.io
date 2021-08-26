import React, { PureComponent } from 'react';
import { Modal } from 'antd';

class AdminViewModal extends PureComponent<any, any> {
    public render() {
        const { onClose, value } = this.props;
        return (
            <Modal
                title="User details"
                centered={true}
                visible={true}
                keyboard={false}
                maskClosable={false}
                footer={null}
                onCancel={onClose}
            >
                <div className="container-fluid">
                    <div className="row form-horizontal">
                        <div className="form-group">
                            <label className="col-md-4">ID:</label>
                            <div className="col-md-8">
                                <span>{value.id}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4">Nk:</label>
                            <div className="col-md-8">
                                <span>{value.nk}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4">Full name:</label>
                            <div className="col-md-8">
                                <span>{value.fullName}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4">Job title:</label>
                            <div className="col-md-8">
                                <span>{value.jobTitle}</span>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="col-md-4">Roles:</label>
                            <div className="col-md-8">
                                {value.roles
                                    .map((x: any) => {
                                        return x.normalizedName;
                                    })
                                    .join('; ')}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
export default AdminViewModal;
