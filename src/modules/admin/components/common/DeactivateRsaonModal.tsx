import React, { PureComponent } from 'react'
import { Modal, Input, Form } from 'antd';
import "../../css/AddCategoryModal.css"
import { isEmptyOrSpaces, errorHelperGenerator } from "../../../common/helpers"

const FormItem = Form.Item
const TextArea = Input.TextArea

export default class DeactivateReasonModal extends PureComponent<any, any>{

    constructor(props: any) {
        super(props);
        this.state = {
            validityStatus: {},
            reason: null
        }
    }

    componentDidMount = () => {
        this.setState({}, this.validateInputs)
    }

    validateInputs = () => {
        const { reason } = this.state
        let validityStatus: any = {}
        if (isEmptyOrSpaces(reason)) {
            validityStatus.Reason = errorHelperGenerator("Please write reason of deactivation.");
        }
        this.setState({ validityStatus: validityStatus });
    }

    onOk = async () => {
        const { onSubmit } = this.props;
        await this.validateInputs();
        const { reason, validityStatus } = this.state;
        if (Object.keys(validityStatus).length === 0) {
            onSubmit(reason);
        }
    }

    onChange = (e: any) => {
        const value = e && e.target ? e.target.value : e
        this.setState({ reason: value }, this.validateInputs)
    }

    public render() {
        const { onClose, modalSaving } = this.props
        const { reason, validityStatus } = this.state

        return (
            <Modal
                title="Deactivation reason"
                centered
                visible
                keyboard={false}
                maskClosable={false}
                onCancel={onClose}
                confirmLoading={modalSaving}
                okText="Deactivate"
                onOk={this.onOk}
            >
                <Form layout="vertical">
                    <div className="container-fluid">
                        <div className="row form-horizontal">
                            <div className="form-group">
                                <label className="col-md-4">Reason:</label>
                                <div className="col-md-8">
                                    <FormItem style={{ marginBottom: "4px" }} className="forValidation" {...validityStatus.Reason}>
                                        <TextArea
                                            onChange={this.onChange}
                                            value={reason}
                                            rows={4} />
                                    </FormItem>
                                </div>
                            </div>
                        </div>
                    </div>
                </Form>
            </Modal>
        )
    }
}