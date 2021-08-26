import React, { PureComponent } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { Input, Button, Select, Collapse, Form } from 'antd';
import '../../css/AddCategoryModal.css';
import { isEmptyOrSpaces } from '../../../common/helpers';

const FormItem = Form.Item;
const ButtonGroup = Button.Group;
const Option = Select.Option;
const Panel = Collapse.Panel;
const Search = Input.Search;

const Parameter = {
    NkOrName: 'NkOrName',
    Role: 'Role',
    IsActive: 'IsActive',
};

const styleEmpty = {
    width: '100%',
    borderRadius: '4px',
    border: '1px solid transparent',
};

const styleNotEmpty = {
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #40a9ff',
};

export default class AdminsSearchPanelComponent extends PureComponent<any, any> {
    public render() {
        const { total, filter, onSearch, onReset, onHandleParameters, roles } = this.props;
        const activeKey = filter.Expand ? ['1'] : undefined;
        return (
            <Collapse
                accordion={true}
                defaultActiveKey={activeKey}
                expandIconPosition="right"
                style={{ marginBottom: '10px' }}
            >
                <Panel
                    header={
                        <b>
                            <SearchOutlined /> Search panel
                        </b>
                    }
                    key="1"
                    extra={<b style={{ color: '#1890ff' }}>Found {total} items</b>}
                >
                    <div className="container-fluid">
                        <div className="row">
                            <div className="col-sm-6 col-xs-12 form-horizontal">
                                <div className="form-group" style={{ marginBottom: '4px' }}>
                                    <label className="col-md-3">Nk or Full name:</label>
                                    <div className="col-md-9">
                                        <FormItem className="searchFormItem">
                                            <Search
                                                placeholder="Type nk or full name"
                                                style={
                                                    filter.NkOrName === null ? { ...styleEmpty } : { ...styleNotEmpty }
                                                }
                                                value={filter.NkOrName}
                                                onChange={(e: any) => onHandleParameters(e, Parameter.NkOrName)}
                                            />
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                            <div className="col-sm-6 col-xs-12 form-horizontal">
                                <div className="form-group" style={{ marginBottom: '4px' }}>
                                    <label className="col-md-3">Is active:</label>
                                    <div className="col-md-9">
                                        <FormItem className="searchFormItem">
                                            <Select
                                                mode="multiple"
                                                style={
                                                    filter.Roles.length > 0 ? { ...styleNotEmpty } : { ...styleEmpty }
                                                }
                                                value={filter.Roles}
                                                placeholder="Please select"
                                                optionFilterProp="title"
                                                onChange={(e: any) => {
                                                    onHandleParameters(e, Parameter.Role);
                                                }}
                                            >
                                                {roles.map((item: any) => (
                                                    <Option value={item.id!} key={item.id} title={item.normalizedName}>
                                                        {item.normalizedName}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </FormItem>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-sm-6 col-xs-12 pull-right">
                                <ButtonGroup className="pull-right">
                                    <Button
                                        type="primary"
                                        disabled={isEmptyOrSpaces(filter.NkOrName) && filter.Roles.length < 1}
                                        onClick={onSearch}
                                    >
                                        Search
                                    </Button>
                                    <Button disabled={false} onClick={onReset}>
                                        Reset
                                    </Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    </div>
                </Panel>
            </Collapse>
        );
    }
}
