import Razorpay from 'razorpay';
import dotenv from 'dotenv';

dotenv.config();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string,
});

export const processPayment = async (order: any): Promise<any> => {
  const options = {
    amount: order.amount * 100, // converting amount to paise
    currency: 'INR',
    receipt: order._id.toString(),
  };

  try {
    const razorpayOrder = await razorpayInstance.orders.create(options);
    return razorpayOrder;
  } catch (error: any) {
    throw new Error('Payment processing failed: ' + error.message);
  }
};
