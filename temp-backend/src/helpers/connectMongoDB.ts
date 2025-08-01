import mongoose from "mongoose";

export default async function connectMongoDB(){
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('DB connected successfully');
    } catch (error) {
        console.log('DB connection failed');
    }
}