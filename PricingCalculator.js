import React, { useState } from 'react';
import axios from 'axios';

const PricingCalculator = () => {
  const [userId, setUserId] = useState('');
  const [price, setPrice] = useState(null);

  const handleCalculate = async () => {
    const result = await axios.get(`http://localhost:3000/calculate-pricing?userId=${userId}`);
    setPrice(result.data.SubscriptionPrice);
  };

  return (
    <div>
      <h1>Subscription Pricing Calculator</h1>
      <input type="text" value={userId} onChange={(e) => setUserId(e.target.value)} placeholder="Enter User ID" />
      <button onClick={handleCalculate}>Calculate</button>
      {price !== null && <div>Subscription Price: ${price}</div>}
    </div>
  );
};

export default PricingCalculator;
Update the main App.js file
javascript
Copy code
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