import { Schema, model, Document } from 'mongoose';

export interface IOrder extends Document {
  product: string;
  amount: number;
  status: string; // e.g., 'created', 'payment_initiated', 'paid'
  paymentReference?: string;
}

const orderSchema = new Schema<IOrder>(
  {
    product: { type: String, required: true },
    amount: { type: Number, required: true },
    status: { type: String, required: true },
    paymentReference: { type: String },
  },
  { timestamps: true }
);

export default model<IOrder>('Order', orderSchema);
