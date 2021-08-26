import { Form, Input, Button, Divider, Table, Select, notification } from 'antd';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { RegestryClient, RegistryVm } from '../../../services/ApiClient'

const inputStyle = { style: { width: '35%' } };

const MainPage = () => {
    const { t } = useTranslation();
    const [data, setData] = useState<RegistryVm[]>([]);
    const [filterredPersons, setFilteredPersons] = useState<string[]>([]);
    const [selectedPersons, setSelectedPersons] = useState<string[]>([]);
    const [form] = Form.useForm();

    const filterPersons = async (performers: string) => {
        if (performers && performers.length > 1) {
            try {
                const creationName = form.getFieldValue('creationName');
                const client = new RegestryClient();
                const result = await client.getTodoItemsWithPagination(performers, creationName);
                const performersz = result.filter(r => r.performers !== undefined).map(r => r.performers!);
                const uniq = performersz.filter((v, i, a) => a.indexOf(v) === i);
                setFilteredPersons(uniq);
            } catch (error) {
                notification.error({
                    message: 'Error',
                });
            }
        } else {
            setFilteredPersons([]);
        }
    };

    const setPersons = (lastname: string) => {
        const client = new RegestryClient();
        try {
            const creationName = form.getFieldValue('creationName')
            client.getTodoItemsWithPagination(lastname, creationName).then(result => {
                setData(result);
            })
        } catch (error) {

        }


        setFilteredPersons([]);
    };

    const searchableSelect = (placeholder: string) => (
        <Select
            {...inputStyle}
            allowClear
            showSearch
            placeholder={placeholder}
            onSearch={filterPersons}
            onSelect={setPersons}
        >
            {filterredPersons.map((x, index) => (
                <Select.Option key={index} value={x}>
                    {x}
                </Select.Option>
            ))}
        </Select>
    );

    const onFinish = async (values: any) => {
        if (values.performers || values.creationName) {
            const client = new RegestryClient();

            try {
                const result = await client.getTodoItemsWithPagination(values.performers, values.creationName);
                setData(result);
            } catch (error) {

            }

        }
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    const columns = [
        {
            title: t('registry.performers'),
            dataIndex: 'performers',
            key: 'performers',
        },
        {
            title: t('registry.creationName'),
            dataIndex: 'creationName',
            key: 'creationName',
        },
        {
            title: t('registry.musicAuthor'),
            dataIndex: 'musicAuthor',
            key: 'musicAuthor',
        },
        {
            title: t('registry.lyricsAuthor'),
            dataIndex: 'lyricsAuthor',
            key: 'lyricsAuthor0',
        },
    ];

    return (
        <>
            <Form
                form={form}
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
            >
                <Form.Item
                    label={t('registry.performers')}
                    name="performers"
                >
                    {searchableSelect('')}
                </Form.Item>

                <Form.Item
                    label={t('registry.creationName')}
                    name="creationName"

                >

                    <Input {...inputStyle} />
                </Form.Item>

                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        {t('common.search')}
                    </Button>
                </Form.Item>
            </Form>
            <Divider />
            <Table dataSource={data} columns={columns} />;
        </>
    );
};


export default MainPage;