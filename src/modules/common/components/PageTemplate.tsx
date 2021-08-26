import { Layout } from 'antd';
import React, { PureComponent } from 'react';
import './css/PageTemplate.css';
import MainMenuComponent from './PageTemplateMenuComponent';
import authService from '../../../api-authorization/AuthorizeService'
import { LoginMenu } from '../../../api-authorization/LoginMenu';

const { Content, Header, Footer } = Layout;

class PageTemplate extends PureComponent<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            userRoles: [],
        };
    }

    componentDidMount() {
        this.getCurrentUser().then((user) => {
            if (user && user.role) {
                this.setState({ userRoles: user.role });
            }
        });
    }

    getCurrentUser = async (): Promise<any> => {
        const user = await authService.getUser();
        if (user && user.role && typeof user.role === 'string') {
            user.role = user.role.split();
        }

        return user;
    };

    public render(): JSX.Element {
        const { children } = this.props;
        return (
            <Layout>
                <div className="center-block label label-danger navbar-fixed-top text-uppercase">
                    {process.env.REACT_APP_ENVIRONMENT}
                </div>
                <MainMenuComponent userRoles={this.state.userRoles} />
                <Layout className="wrapper" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                    <Header
                        style={{
                            background: '#fff',
                            padding: '0',
                            marginBottom: '10px',
                            height: '30px',
                            flexShrink: 0,
                        }}
                    >
                        <div
                            className="container-fluid"
                            style={{
                                borderBottom: '1px solid #d9d9d9',
                            }}
                        >
                            <div className="row">
                                <div className="col-md-12" style={{ textAlign: 'left' }}>
                                    <LoginMenu />
                                </div>
                            </div>
                        </div>
                    </Header>
                    <Content style={{ background: '#fff', flex: '1 0 auto' }}>
                        <div className="container-fluid">{children}</div>
                    </Content>
                    <Footer
                        style={{
                            background: '#fff',
                            textAlign: 'center',
                            flexShrink: 0,
                        }}
                    >
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}

export default PageTemplate;
