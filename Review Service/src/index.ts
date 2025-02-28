import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import connectDB from "./db";

import { authReviewService } from './middleware/review.middleware';
import reviewsRoute from "./routes/review.route";

dotenv.config();

const app = express();
const port = process.env.PORT || 11000;

app.use(express.json());
app.use(authReviewService);

app.use("/reviews", reviewsRoute);
interface UserRequest extends Request {
  user?: { id: string; role: string };
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({status: "healthy"});
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  connectDB();
});
