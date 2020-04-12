/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { NotFound } from 'strapi-helper-plugin';
// Utils
import pluginId from '../../pluginId';
// Containers
import All from '../HomePage/all';
import Offline from '../HomePage/offline';
import Deal from '../HomePage/deal';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path={`/plugins/${pluginId}/offline`} component={Offline} exact />
        <Route path={`/plugins/${pluginId}/deal`} component={Deal} exact />
        <Route path={`/plugins/${pluginId}/all`} component={All} exact />
        <Route component={NotFound} />
      </Switch>
    </div>
  );
};

export default App;
