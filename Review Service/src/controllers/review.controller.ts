import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import Review from '../models/review.model';

// Extend Request to include user property
interface UserRequest extends Request {
  user?: { id: string; role: string };
}

// Create Review
export const createReview = asyncHandler(async (req: UserRequest, res: Response) => {
  if (!req.user?.id) {
    res.status(401);
    throw new Error('Unauthorized: No user ID provided');
  }

  const review = await Review.create({ content: req.body.content, authorId: req.user.id });
  res.status(201).json(review);
});

// Get All Reviews
export const getAllReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await Review.find();
  res.json(reviews);
});

// Get Single Review
export const getReviewById = asyncHandler(async (req: Request, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }
  res.json(review);
});

// Update Review (Only Author)
export const updateReview = asyncHandler(async (req: UserRequest, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.authorId !== req.user?.id) {
    res.status(403);
    throw new Error('Forbidden: You can only update your own review');
  }

  review.content = req.body.content || review.content;
  await review.save();
  res.json(review);
});

// Delete Review (Author or Admin)
export const deleteReview = asyncHandler(async (req: UserRequest, res: Response) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  if (review.authorId !== req.user?.id && req.user?.role !== 'admin') {
    res.status(403);
    throw new Error('Forbidden: You are not allowed to delete this review');
  }

  await review.deleteOne();
  res.json({ message: 'Review deleted successfully' });
});
