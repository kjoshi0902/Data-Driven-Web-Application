import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DataDisplay = () => {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`http://localhost:3000/data?page=${page}&limit=${limit}`);
      setData(result.data);
    };

    fetchData();
  }, [page, limit]);

  return (
    <div>
      <h1>Data Display</h1>
      <ul>
        {data.map((item, index) => (
          <li key={index}>{item.Name} - {item.CreditScore} - {item.CreditLines}</li>
        ))}
      </ul>
      <button onClick={() => setPage(page - 1)} disabled={page === 1}>Previous</button>
      <button onClick={() => setPage(page + 1)}>Next</button>
    </div>
  );
};

export default DataDisplay;