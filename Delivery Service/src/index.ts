import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import deliveryRouter from './routes/delivery.router';

dotenv.config();
const app = express();
const port = process.env.PORT || 6000;

app.use(express.json());
app.use('/deliveries', deliveryRouter);

mongoose
  .connect('mongodb://localhost:27017/deliverydb')
  .then(() => console.log('Connected to MongoDB (Delivery DB)'))
  .catch(err => console.error('MongoDB connection error:', err));

app.listen(port, () => {
  console.log(`Delivery Microservice running on port ${port}`);
});
