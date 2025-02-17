import fs from 'fs';
import { Client } from '@elastic/elasticsearch';

import dotenv from 'dotenv';
dotenv.config();

export const esClient = new Client({
    node: 'https://localhost:9200',
    auth: {
        username: 'elastic',
        password: process.env.ELASTIC_PASSWORD || ""
    },
    tls: {
        ca: fs.readFileSync('http_ca.crt'),
        rejectUnauthorized: false
    }
});
export const indexName = 'products';

export const createProductsIndex = async () => {
  const exists = await esClient.indices.exists({ index: indexName });
  if (!exists) {  // Corrected this condition
    await esClient.indices.create({
      index: indexName,
      body: {
        mappings: {
          properties: {
            id: { type: 'keyword' },
            category: { type: 'text' },
            name: { type: 'text' },
            price: { type: 'double' },
            quantity: { type: 'integer' },
            tags: { type: 'text' },
            images: { type: 'text' },
            description: { type: 'text' }
          }
        }
      }
    });
    console.log(`Created index ${indexName}`);
  } else {
    console.log(`Index ${indexName} already exists`);
  }
};
