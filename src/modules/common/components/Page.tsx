import React, { PureComponent } from 'react';

type Props = {
    title: string;
};
type State = {};

class Page extends PureComponent<Props, State> {
    public render(): JSX.Element {
        return (
            <div>
                <h4>
                    <b>{this.props.title}</b>
                </h4>
                {this.props.children}
            </div>
        );
    }
}

export default Page;
