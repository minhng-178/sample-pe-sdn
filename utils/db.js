import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const DBURI = process.env.MONGO_URI || "";

const connectDB = async () => {
  try {
    await mongoose.connect(DBURI).then((data) => {
      console.log(`Database connect with ${data.connection.host}`);
    });
  } catch (error) {
    console.log(error.message);
    setTimeout(connectDB, 5000);
  }
};

export default connectDB;
