import { Router } from 'express';
import {
  assignDelivery,
  updateDeliveryLocation,
  updateDeliveryStatus,
  getDelivery,
  listDeliveries,
} from '../controllers/delivery.controller';

const router = Router();

router.post('/', assignDelivery);
router.patch('/:id/location', updateDeliveryLocation);
router.patch('/:id/status', updateDeliveryStatus);
router.get('/:id', getDelivery);
router.get('/', listDeliveries);

export default router;
