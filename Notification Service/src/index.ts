import express from 'express';
import dotenv from 'dotenv';
import { RabbitMQService } from './services/rabbitmq.service';

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

// Start consuming notification messages
RabbitMQService.consumeNotifications().catch(err => {
  console.error('Error starting RabbitMQ consumer:', err);
});

app.listen(port, () => {
  console.log(`Notification Microservice running on port ${port}`);
});
