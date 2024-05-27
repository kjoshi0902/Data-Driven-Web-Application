const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 5000;

// MongoDB connection setup
mongoose.connect('mongodb://localhost:27017/subscription_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define MongoDB Schema
const subscriptionSchema = new mongoose.Schema({
  creditScore: Number,
  creditLines: Number,
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Multer setup for CSV upload
const upload = multer({ dest: 'uploads/' });

// API endpoint for CSV upload
app.post('/upload-csv', upload.single('csvFile'), (req, res) => {
  const results = [];

  fs.createReadStream(req.file.path)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      // Save data to MongoDB
      Subscription.insertMany(results)
        .then(() => {
          res.status(200).json({ message: 'CSV uploaded successfully' });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: 'Failed to upload CSV' });
        });
    });
});

app.listen(port, () => {
  console.log(Server running on port ${port});
});