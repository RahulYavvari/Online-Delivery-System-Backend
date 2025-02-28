import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { RabbitMQService } from './services/rabbitmq.service';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

mongoose
  .connect('mongodb://localhost:27017/paymentsdb')
  .then(() => console.log('Connected to MongoDB (Payments DB)'))
  .catch(err => console.error('MongoDB connection error:', err));

// Start consuming order messages from RabbitMQ to process payments
RabbitMQService.consumeOrders().catch((err) =>
  console.error('RabbitMQ consumer error:', err)
);

app.listen(port, () => {
  console.log(`Payment Microservice running on port ${port}`);
});
