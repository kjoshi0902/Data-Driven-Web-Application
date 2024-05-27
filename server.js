// server.js
const express = require('express');
const multer = require('multer');
const socketIo = require('socket.io');
const http = require('http');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const Bull = require('bull');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const upload = multer({ dest: 'uploads/' });

let db;
MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true }, (err, client) => {
  if (err) return console.error(err);
  db = client.db('subscriptionDB');
  console.log('Connected to Database');
});

const csvQueue = new Bull('csv-queue');

app.post('/upload', upload.single('file'), (req, res) => {
  const filePath = path.join(__dirname, 'uploads', req.file.filename);
  csvQueue.add({ filePath, socketId: req.body.socketId });
  res.status(200).send('File uploaded successfully');
});

csvQueue.process(async (job) => {
  const { filePath, socketId } = job.data;
  const results = [];
  const collection = db.collection('subscriptions');

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      results.push(data);
      io.to(socketId).emit('progress', { progress: results.length });
    })
    .on('end', async () => {
      await collection.insertMany(results);
      io.to(socketId).emit('completed', { message: 'CSV processing completed' });
      fs.unlinkSync(filePath);
    });
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.get('/data', async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const collection = db.collection('subscriptions');
  const data = await collection.find({})
    .skip((page - 1) * limit)
    .limit(parseInt(limit))
    .toArray();
  res.json(data);
});

app.get('/calculate-pricing', async (req, res) => {
  const { userId } = req.query;
  const collection = db.collection('subscriptions');
  const user = await collection.findOne({ _id: new ObjectId(userId) });

  const BasePrice = 50;
  const PricePerCreditLine = 10;
  const PricePerCreditScorePoint = 0.1;

  const SubscriptionPrice = BasePrice + (PricePerCreditLine * user.CreditLines) + (PricePerCreditScorePoint * user.CreditScore);

  res.json({ SubscriptionPrice });
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});
