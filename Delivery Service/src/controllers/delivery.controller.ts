import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Delivery, { IDelivery } from '../models/delivery.model';
import { sendDeliveryNotification } from '../services/notification.service';

// Assign a new delivery (create a delivery assignment)
export const assignDelivery = asyncHandler(async (req: Request, res: Response) => {
  const { orderId, agentId, customerEmail, initialLocation } = req.body;
  if (!orderId || !agentId || !customerEmail || !initialLocation) {
    res.status(400);
    throw new Error('Missing required fields: orderId, agentId, customerEmail, initialLocation');
  }

  const delivery: IDelivery = await Delivery.create({
    orderId,
    agentId,
    customerEmail,
    status: 'assigned',
    currentLocation: initialLocation,
    routeHistory: [{ ...initialLocation, timestamp: new Date() }],
  });

  // Notify customer that a delivery agent has been assigned
  await sendDeliveryNotification(
    customerEmail,
    'Delivery Assigned',
    `Your order ${orderId} has been assigned to delivery agent ${agentId}.`
  );

  res.status(201).json(delivery);
});

// Update delivery location (real-time GPS tracking)
export const updateDeliveryLocation = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { latitude, longitude } = req.body;
  if (latitude === undefined || longitude === undefined) {
    res.status(400);
    throw new Error('Missing latitude or longitude');
  }
  const delivery = await Delivery.findById(id);
  if (!delivery) {
    res.status(404);
    throw new Error('Delivery not found');
  }
  // Update current location and add to route history
  delivery.currentLocation = { latitude, longitude };
  delivery.routeHistory.push({ latitude, longitude, timestamp: new Date() });
  await delivery.save();

  res.json(delivery);
});

// Update delivery status (and optionally attach proof of delivery)
export const updateDeliveryStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, proofOfDelivery } = req.body;
  if (!status) {
    res.status(400);
    throw new Error('Status is required');
  }
  const delivery = await Delivery.findById(id);
  if (!delivery) {
    res.status(404);
    throw new Error('Delivery not found');
  }
  delivery.status = status;
  if (proofOfDelivery) {
    delivery.proofOfDelivery = proofOfDelivery;
  }
  await delivery.save();

  // Send notification on status change
  const subject = status === 'delivered' ? 'Order Delivered' : 'Delivery Update';
  const message =
    status === 'delivered'
      ? `Your order ${delivery.orderId} has been delivered.`
      : `Your order ${delivery.orderId} status is now: ${status}.`;

  await sendDeliveryNotification(delivery.customerEmail, subject, message);

  res.json(delivery);
});

// Retrieve delivery details by ID
export const getDelivery = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const delivery = await Delivery.findById(id);
  if (!delivery) {
    res.status(404);
    throw new Error('Delivery not found');
  }
  res.json(delivery);
});

// List deliveries, optionally filtering by orderId (for customer tracking)
export const listDeliveries = asyncHandler(async (req: Request, res: Response) => {
  const { orderId } = req.query;
  const deliveries = orderId
    ? await Delivery.find({ orderId: orderId as string })
    : await Delivery.find();
  res.json(deliveries);
});
