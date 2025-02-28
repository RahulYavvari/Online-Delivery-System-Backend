import express, { Request, Response, NextFunction } from 'express';

interface UserRequest extends Request {
  user?: { id: string; role: string };
}

export const authReviewService = (req: UserRequest, res: Response, next: NextFunction) => {
  req.user = {
    id: req.headers['x-user-id'] as string || '',
    role: req.headers['x-user-role'] as string || 'user',
  };
  next();
}
