import amqplib from 'amqplib';

export class RabbitMQService {
  private static channel: amqplib.Channel;

  public static async connect(): Promise<void> {
    const connection = await amqplib.connect('amqp://localhost');
    RabbitMQService.channel = await connection.createChannel();
    // Assert queues for different message types
    await RabbitMQService.channel.assertQueue('order', { durable: true });
    await RabbitMQService.channel.assertQueue('notification', { durable: true });
  }

  public static async publishMessage(type: string, data: any): Promise<void> {
    if (!RabbitMQService.channel) {
      await RabbitMQService.connect();
    }
    const payload = JSON.stringify({ type, data });
    const queue = type === 'notification' ? 'notification' : 'order';
    RabbitMQService.channel.sendToQueue(queue, Buffer.from(payload), { persistent: true });
  }
}
