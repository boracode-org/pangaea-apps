import { inject, observer } from 'mobx-react';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import { IStores } from '../../stores';

interface INotFoundProps {
    //
}

@observer
export class NotFound extends React.Component<INotFoundProps, {}> {
    public render() {
        return (
            <div>
                <Helmet>
                    <title>Not Found</title>
                </Helmet>
                <h1>Sorry, can’t find that.</h1>
            </div>
        );
    }
};
