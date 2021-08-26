import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route, Switch, RouteProps } from 'react-router-dom';

import './App.css';
import PageTemplate from './modules/common/components/PageTemplate';
import NotFound from './modules/common/containers/NotFoundContainer';

import moment from 'moment';
import routes from './routes';
import configureStore from './store/configureStore';
import AuthorizeRoute from './api-authorization/AuthorizeRoute';
import { ApplicationPaths } from './api-authorization/ApiAuthorizationConstants';
import ApiAuthorizationRoutes from './api-authorization/ApiAuthorizationRoutes';
import i18n from './i18n/i18n'
import 'moment/locale/en-gb';
import 'moment/locale/ru';
import 'moment/locale/kk';


const store = configureStore();

const appRoutes = routes.map((i: RouteProps, index: number) => (
    <Route path={i.path} key={`route${index}`} exact={i.exact} component={i.component} />
));
appRoutes.push(
  <Route key="routeAuth" path={ApplicationPaths.ApiAuthorizationPrefix} component={ApiAuthorizationRoutes} />
);

class App extends React.Component {
  public componentDidMount = (): void => {
    moment.updateLocale(i18n.language, {
      week: {
        dow: 1,
      },
    } as any);
  };

  public render(): JSX.Element {
    return (
      <Provider store={store}>
        <Router>
          <PageTemplate>
            <Switch>
              {appRoutes}
              <Route component={NotFound} />
            </Switch>
          </PageTemplate>
        </Router>
      </Provider>
    );
  }
}

export default App;
