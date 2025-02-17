import express from 'express';
import {
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  searchProducts
} from '../controllers/productController';

const router = express.Router();

// CRUD endpoints
router.get('/search/', searchProducts);
router.post('/', createProduct);
router.get('/:id', getProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Search endpoint with filtering

export default router;
