import React, { useState } from "react";
// import Container from 'react-bootstrap/Container';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";

import Task from "./Task";
import Finished from "./Finished";

const App = () => {
  const [taskId, setTaskId] = useState("12345");

  console.log(window.location);
  console.log(process.env);

  // TODO: 404 handling
  return (
    <Router
      basename={
        process.env.NODE_ENV === "development" ? "" : process.env.PUBLIC_URL
      }
    >
      <Switch>
        <Route exact path="/">
          root
        </Route>
        <Route exact path="/finished">
          <Finished taskId={taskId} />
        </Route>
        <Route exact path="/task">
          <Task />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;
