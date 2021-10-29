import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

import Task from "./components/Task";
import Finished from "./components/Finished";

const App = () => {
  const [taskId, setTaskId] = useState("12345");

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
