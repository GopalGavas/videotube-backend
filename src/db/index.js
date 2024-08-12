import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connenctionInstance = await mongoose.connect(
      `${process.env.MONGODB_URL}`
    );
    console.log(
      `\n MongoDB connected !! DB HOST: ${connenctionInstance.connection.host}`
    );
  } catch (error) {
    console.log("MongoDB connection error!", error);
    process.exit(1);
  }
};

export { connectDB };
