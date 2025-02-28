import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost:27017/reviewsdb')
        console.log('Connected to MongoDB');
    } catch (err) {
        console.error("Error while connecting to database", err);
    }
}

export default connectDB;