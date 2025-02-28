import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import orderRouter from './routes/order.router';
import { RabbitMQService } from './services/rabbitmq.service';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/orders', orderRouter);

mongoose
  .connect('mongodb://localhost:27017/ordersdb')
  .then(() => console.log('Connected to MongoDB (Orders DB)'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize RabbitMQ connection
RabbitMQService.connect().then(() => {
  console.log('Connected to RabbitMQ');
});

app.listen(port, () => {
  console.log(`Orders Microservice running on port ${port}`);
});
