import mongoose from "mongoose";
import { getEnv } from "./env.conf";

export async function connectToDatabase() {
  const envs = getEnv();
  const { MONGODB_URI } = envs;
  await mongoose.connect(MONGODB_URI, {
    dbName: "mern-booking-app",
  });
  console.log("Connected to MongoDB successfully");
}

export default connectToDatabase;
