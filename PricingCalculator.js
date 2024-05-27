import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PricingCalculator = () => {
  const [creditScore, setCreditScore] = useState(0);
  const [creditLines, setCreditLines] = useState(0);
  const [subscriptionPrice, setSubscriptionPrice] = useState(0);

  const calculatePrice = async () => {
    try {
      const response = await axios.post('http://localhost:5000/calculate-price', {
        creditScore,
        creditLines,
      });
      setSubscriptionPrice(response.data.subscriptionPrice);
    } catch (error) {
      console.error('Error calculating price:', error);
      alert('Error calculating price. Please try again.');
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [creditScore, creditLines]);

  return (
    <div>
      <input type="number" value={creditScore} onChange={(e) => setCreditScore(e.target.value)} />
      <input type="number" value={creditLines} onChange={(e) => setCreditLines(e.target.value)} />
      <button onClick={calculatePrice}>Calculate Price</button>
      <div>Subscription Price: ${subscriptionPrice}</div>
    </div>
  );
};

export default PricingCalculator;
// API endpoint for subscription price calculation
app.post('/calculate-price', (req, res) => {
    const { creditScore, creditLines } = req.body;
    const basePrice = 50; // Example base price
    const pricePerCreditLine = 10; // Example price per credit line
    const pricePerCreditScorePoint = 5; // Example price per credit score point
  
    const subscriptionPrice =
      basePrice + pricePerCreditLine * creditLines + pricePerCreditScorePoint * creditScore;
  
    res.status(200).json({ subscriptionPrice });
  });