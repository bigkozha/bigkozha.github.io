import {
    ReadOutlined,
    ContainerOutlined,
    OrderedListOutlined,
    FlagOutlined,
    PlusCircleOutlined,
    UsergroupAddOutlined,
    FileExcelOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { LoginType } from '../constants';
import logoWithoutText from './img/logo.png';
import i18n from '../../../i18n/i18n';
import { useTranslation } from 'react-i18next';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;
const { Sider } = Layout;

const lngs: any = {
    en: { nativeName: 'English' },
    ru: { nativeName: 'Русский' },
    kz: { nativeName: 'Қазақша' },
};

const handleSwitchLanguage = (lng: string): void => {
    i18n.changeLanguage(lng).then(() => {
        window.location.reload();
        return false;
    });
};

const PageTemplateMenuComponent = ({ userRoles }: { userRoles: string[] }) => {
    const { t } = useTranslation();
    const isAdmin = userRoles ? userRoles.includes(LoginType.Admin.code) : false;

    return (
        <Sider style={{ height: 'auto' }} theme="light">
            <div className="logo" style={{ padding: '0 10%' }}>
                <div className="moaLogo">
                    <NavLink to="/">
                        <img src={logoWithoutText} alt="Logo" />
                    </NavLink>
                </div>
            </div>
            <Menu theme="light" mode="inline">
                {!isAdmin && (
                    <>
                        <MenuItem key="/">
                            <NavLink to="/">
                                <OrderedListOutlined />
                                <span>{t('leftMenu.registry')}</span>
                            </NavLink>
                        </MenuItem>
                        <MenuItem key="kz">
                            <FlagOutlined />
                            <span onClick={() => handleSwitchLanguage('kz')}>{lngs['kz'].nativeName}</span>
                        </MenuItem>
                        <MenuItem key="ru">
                            <FlagOutlined />
                            <span onClick={() => handleSwitchLanguage('ru')}>{lngs['ru'].nativeName}</span>
                        </MenuItem>
                        <MenuItem key="en">
                            <FlagOutlined />
                            <span onClick={() => handleSwitchLanguage('en')}>{lngs['en'].nativeName}</span>
                        </MenuItem>
                    </>
                )}
                {isAdmin && (
                    <>
                        <MenuItem key="/admin/Contractors">
                            <NavLink to="/admin/Contractors">
                                <OrderedListOutlined />
                                <span>Contractors list</span>
                            </NavLink>
                        </MenuItem>
                        <MenuItem key="/admin/userTasks">
                            <NavLink to="/admin/userTasks">
                                <ContainerOutlined />
                                <span>User Tasks</span>
                            </NavLink>
                        </MenuItem>
                        <MenuItem key="/admin/createTask">
                            <NavLink to="/admin/createTask">
                                <PlusCircleOutlined />
                                <span>Create task</span>
                            </NavLink>
                        </MenuItem>
                        <MenuItem key="/admin/Form1">
                            <NavLink to="/admin/Form1">
                                <OrderedListOutlined />
                                <span>Form 1 List</span>
                            </NavLink>
                        </MenuItem>
                        <MenuItem key="/admin/report">
                            <NavLink to="/admin/report">
                                <FileExcelOutlined />
                                <span>Generate report</span>
                            </NavLink>
                        </MenuItem>
                        <MenuItem key="/admin/userManagement">
                            <NavLink to="/admin/userManagement">
                                <UsergroupAddOutlined />
                                <span>User Management</span>
                            </NavLink>
                        </MenuItem>
                    </>
                )}
            </Menu>
        </Sider>
    );
};

export default PageTemplateMenuComponent;
