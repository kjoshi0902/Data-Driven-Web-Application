// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Upload from './components/Upload';
import DataDisplay from './components/DataDisplay';
import PricingCalculator from './components/PricingCalculator';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Upload} />
        <Route path="/data" component={DataDisplay} />
        <Route path="/calculate-pricing" component={PricingCalculator} />
      </Switch>
    </Router>
  );
}

export default App;
