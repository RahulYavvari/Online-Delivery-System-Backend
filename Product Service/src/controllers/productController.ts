import { Request, Response } from 'express';
import { Product } from '../models/product';
import { esClient, indexName } from '../services/elasticsearchService';
import { v4 as uuidv4 } from 'uuid';

export const createProduct = async (req: Request, res: Response) => {
  try {
    const product: Product = req.body;
    product.id = product.id || uuidv4();

    const result = await esClient.index({
      index: indexName,
      id: product.id,
      document: product,  // Use 'document' instead of 'body' in ES v8+
      refresh: true
    });

    res.status(201).json({
      message: 'Product created successfully',
      productId: product.id,
      result
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ error: 'Error creating product' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await esClient.get({
      index: indexName,
      id: id
    });

    res.status(200).json(result._source); // ✅ Fixed: Use 'result._source' instead of 'result.body._source'
  } catch (error) {
    console.error('Error retrieving product:', error);
    res.status(500).json({ error: 'Error retrieving product' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updatedProduct: Partial<Product> = req.body;

    const result = await esClient.update({
      index: indexName,
      id: id,
      doc: updatedProduct,
      refresh: true
    });

    res.status(200).json({
      message: 'Product updated successfully',
      result
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ error: 'Error updating product' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await esClient.delete({
      index: indexName,
      id: id,
      refresh: true
    });

    res.status(200).json({
      message: 'Product deleted successfully',
      result
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ error: 'Error deleting product' });
  }
};

export const searchProducts = async (req: Request, res: Response) => {
  try {
    const { searchQuery, priceMin, priceMax, tag, availability } = req.query;

    let must: any[] = [];

    // If a search query (like from a search bar) is provided, search across name, description, and category
    if (searchQuery) {
      must.push({
        multi_match: {
          query: searchQuery,
          fields: ['name^2', 'category', 'description'],
          operator: 'and',
          fuzziness: 'AUTO',
        }
      });
    }

    // Filter by price range if provided
    if (priceMin || priceMax) {
      let range: any = {};
      if (priceMin) range.gte = Number(priceMin);
      if (priceMax) range.lte = Number(priceMax);
      must.push({ range: { price: range } });
    }

    // Filter by tag if provided
    if (tag) {
      must.push({ match: { tags: tag } });
    }

    // Filter by availability if provided
    if (availability !== undefined) {
      if (availability === 'true') {
        must.push({ range: { quantity: { gt: 0 } } });
      } else if (availability === 'false') {
        must.push({ term: { quantity: 0 } });
      }
    }

    // Build the query to use with Elasticsearch
    const query = {
      bool: {
        must
      }
    };

    // Execute the search
    const result = await esClient.search({
      index: 'products',
      body: {
        query, // Use the query directly inside the body
      },
      size: 10, // Limit results to top 10 for search bar (can be adjusted)
      sort: [{ _score: { order: 'desc' } }] // Sort by relevance score
    });

    // Extract the hits and return them as the response
    const hits = result.hits.hits.map((hit: any) => hit._source);
    res.status(200).json(hits);

  } catch (error) {
    console.error('Error searching products:', error);
    res.status(500).json({ error: 'Error searching products', details: error });
  }
};

