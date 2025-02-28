import amqplib from 'amqplib';
import { sendEmail } from './email.service';

export class RabbitMQService {
  public static async consumeNotifications(): Promise<void> {
    const connection = await amqplib.connect('amqp://localhost');
    const channel = await connection.createChannel();
    await channel.assertQueue('notification', { durable: true });
    console.log('Notification Service: Waiting for notification messages...');

    channel.consume('notification', async (msg) => {
      if (msg) {
        try {
          const messageData = JSON.parse(msg.content.toString());
          if (messageData.type === 'notification') {
            const { email, orderId, status, message } = messageData.data;
            // Send email to the user
            await sendEmail(email, `Order Update: ${orderId}`, message);
            console.log(`Notification sent to ${email} for Order ${orderId}`);
          }
          channel.ack(msg);
        } catch (error) {
          console.error('Error processing notification message:', error);
          channel.nack(msg);
        }
      }
    });
  }
}
