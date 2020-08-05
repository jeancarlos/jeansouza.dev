import React, { Suspense } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useHistory
} from "react-router-dom";
import Emoji from 'components/Emoji'
import routes from './routes'

function App() {
  let history = useHistory();
  const placeHolder = (
    <header className="App--Header">
      <Emoji className="App--Header App--Loading" symbol="⏳" />
    </header>
  )
  return (<div className="App">
    <Router><Switch>
      {routes.map(({ path, Component }) => (
        <Route exact path={path}>
          <Suspense fallback={placeHolder}>
            <Component history={history} />
          </Suspense>
        </Route>
      ))}
    </Switch></Router>
  </div>);
}

export default App;
