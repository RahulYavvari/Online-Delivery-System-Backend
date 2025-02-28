import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Order, { IOrder } from '../models/order.model';
import { RabbitMQService } from '../services/rabbitmq.service';

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const { product, amount, userEmail } = req.body;
  // Create an order with initial status "created"
  const order: IOrder = await Order.create({ product, amount, status: 'created', userEmail });
  
  // Publish order message for Payment Service
  await RabbitMQService.publishMessage('order', order);
  
  // Publish notification message for Notification Service
  const notificationPayload = {
    email: userEmail,
    orderId: order._id,
    status: order.status,
    message: `Your order for ${product} has been created. Current status: ${order.status}.`,
  };
  await RabbitMQService.publishMessage('notification', notificationPayload);
  
  res.status(201).json(order);
});
