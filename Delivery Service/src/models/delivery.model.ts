import { Schema, model, Document } from 'mongoose';

export interface IDelivery extends Document {
  orderId: string;
  agentId: string;
  customerEmail: string;
  status: string; // e.g., "assigned", "in_transit", "delivered", "failed"
  currentLocation: {
    latitude: number;
    longitude: number;
  };
  routeHistory: {
    latitude: number;
    longitude: number;
    timestamp: Date;
  }[];
  proofOfDelivery?: string;
}

const deliverySchema = new Schema<IDelivery>(
  {
    orderId: { type: String, required: true },
    agentId: { type: String, required: true },
    customerEmail: { type: String, required: true },
    status: { type: String, required: true, default: 'assigned' },
    currentLocation: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true },
    },
    routeHistory: [
      {
        latitude: { type: Number, required: true },
        longitude: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    proofOfDelivery: { type: String },
  },
  { timestamps: true }
);

export default model<IDelivery>('Delivery', deliverySchema);
