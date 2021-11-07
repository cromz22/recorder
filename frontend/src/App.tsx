import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  useLocation,
} from "react-router-dom";

import Task from "./components/Task";
import Finished from "./components/Finished";

const NoMatch = () => {
  let location = useLocation();

  return (
    <div>
      <h3>
        No match for <code>{location.pathname}</code>
      </h3>
    </div>
  );
};

const App = () => {
  return (
    <Router
      basename={
        process.env.NODE_ENV === "development" ? "" : process.env.PUBLIC_URL
      }
    >
      <Switch>
        <Route exact path="/finished/:nutt/:taskId">
          <Finished />
        </Route>
        <Route exact path="/task/:nutt/:taskId">
          <Task />
        </Route>
        <Route path="*">
          <NoMatch />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
