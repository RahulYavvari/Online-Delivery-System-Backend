import { Schema, model, Document } from 'mongoose';

export interface IPayment extends Document {
  orderId: string;
  razorpayPaymentId: string;
  status: string; // e.g., "pending", "successful", "failed"
  amount: number;
}

const paymentSchema = new Schema<IPayment>(
  {
    orderId: { type: String, required: true },
    razorpayPaymentId: { type: String, required: true },
    status: { type: String, required: true },
    amount: { type: Number, required: true },
  },
  { timestamps: true }
);

export default model<IPayment>('Payment', paymentSchema);
