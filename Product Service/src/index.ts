import express from 'express';
import bodyParser from 'body-parser';
import productRoutes from './routes/productRoutes';
import { createProductsIndex } from './services/elasticsearchService';

import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 10000;

app.use(bodyParser.json());

// Register product routes under the "/products" path
app.use('/products', productRoutes);

// Initialize Elasticsearch index on startup
createProductsIndex()
  .then(() => {
    app.listen(port, () => {
      console.log(`[LOG] Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('[ERR LOG] Failed to create Elasticsearch index:', err);
  });
