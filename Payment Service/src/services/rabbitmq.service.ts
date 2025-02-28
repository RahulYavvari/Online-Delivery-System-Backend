import amqplib from 'amqplib';
import { processPayment } from './razorpay.service';
import Payment from '../models/payment.model';
import Order from '../models/order.model';

export class RabbitMQService {
  public static async consumeOrders(): Promise<void> {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('order', { durable: true });
    console.log('Waiting for order messages...');

    channel.consume('order', async (msg) => {
      if (msg) {
        try {
          const messageData = JSON.parse(msg.content.toString());
          if (messageData.type === 'order') {
            const order = messageData.data;
            // Process payment using Razorpay
            const razorpayOrder = await processPayment(order);
            // Save payment details in Payment collection (initially "pending")
            await Payment.create({
              orderId: order._id,
              razorpayPaymentId: razorpayOrder.id,
              status: 'pending',
              amount: order.amount,
            });
            // Update order with payment reference and change status to 'payment_initiated'
            await Order.findByIdAndUpdate(order._id, {
              status: 'payment_initiated',
              paymentReference: razorpayOrder.id,
            });
            channel.ack(msg);
          }
        } catch (error) {
          console.error('Error processing order message:', error);
          channel.nack(msg);
        }
      }
    });
  }
}
