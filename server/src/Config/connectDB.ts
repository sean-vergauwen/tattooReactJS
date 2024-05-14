import mongoose from "mongoose";

const connectDB = async (DATABASE_URL: string): Promise<void> => {
  try {
    await mongoose.connect(DATABASE_URL);
    console.log("Connected to Database");
  } catch (err) {
    console.log("Please connect Database" + err);
  }
};

export default connectDB;
