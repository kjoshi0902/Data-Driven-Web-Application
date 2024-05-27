import React, { useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const Upload = () => {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('socketId', socket.id);

    await axios.post('http://localhost:3000/upload', formData);

    socket.on('progress', (data) => {
      setProgress(data.progress);
    });

    socket.on('completed', (data) => {
      alert(data.message);
      setProgress(100);
    });
  };

  return (
    <div>
      <h1>Upload CSV File</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
      <div>Progress: {progress}%</div>
    </div>
  );
};

export default Upload;
