import mongoose, { Schema, Document } from "mongoose";

interface IReview extends Document {
  content: string;
  authorId: string;
}

const reviewSchema = new Schema<IReview>(
  {
    content: { type: String, required: true },
    authorId: { type: String, required: true },
  },
  { timestamps: true }
);

const Review = mongoose.model<IReview>('Review', reviewSchema);

export default Review;