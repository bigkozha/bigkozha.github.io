import React, { PureComponent } from 'react';
import AccessDenied from '../modules/common/containers/ForbiddentContainer';
import authService from '../api-authorization/AuthorizeService';

const withAccessCheck = (WrappedComponent: typeof PureComponent | any, checkroles: string[], menuKey: string) => {
    class WithAccessCheckComponent extends PureComponent<any, any> {
        constructor(props: any) {
            super(props);
            this.state = {
                isHaveAccess: false,
            };
        }
        async componentDidMount() {
            const user = await authService.getUser();

            if (!Array.isArray(user.role)) {
                user.role = [user.role];
            }

            this.setState({
                isHaveAccess: user && user.role.some((x: string) => checkroles.some((y: string) => y === x)),
            });
        }

        public render(): JSX.Element {
            return this.state.isHaveAccess ? (
                <div className="row">
                    <div className="col-xs-12">
                        <WrappedComponent {...this.props} />
                    </div>
                </div>
            ) : (
                <AccessDenied />
            );
        }
    }

    return WithAccessCheckComponent;
};
export default withAccessCheck;
