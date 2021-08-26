import React from 'react';
import PageTemplate from '../components/PageTemplate';

class PageTemplateContainer extends React.Component<any, any> {
    public render(): JSX.Element {
        const { children } = this.props;

        return <PageTemplate>{children}</PageTemplate>;
    }
}

export default PageTemplateContainer;
