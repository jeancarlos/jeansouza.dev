import React, { Suspense } from 'react';
import '@fortawesome/fontawesome-free/js/all.js'
import {
  HashRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import routes from './routes'

function App () {
  let history = useHistory();
  const placeHolder = (
    <div><i className="Loading fas fa-sync" /></div>
  )
  return (<div className="App">
    <Router><Switch>
      {routes.map(({ path, exact, theme: Theme, component: Component }) => (
        <Route key={path} exact={exact} path={path}>
          <Suspense fallback={placeHolder}>
            <Theme><Component history={history} /></Theme>
          </Suspense>
        </Route>
      ))}
    </Switch></Router>
  </div>);
}

export default App;
