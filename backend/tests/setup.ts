import mongoose from "mongoose";
import { afterAll, beforeAll, afterEach, beforeEach } from "vitest";
import { initEnv } from "../src/conf/env.conf";
import { server } from "../mocks/node.js";
import "dotenv/config";
initEnv();
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
beforeAll(async () => {
  console.log("envs setup correctly");
  await mongoose.connect(process.env.MONGODB_URI_TEST as string, {
    dbName: "mern-booking-app",
  });
  console.log("Connected to MongoDB successfully");
});

afterAll(async () => {
  const collections = await mongoose.connection.db!.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
  await mongoose.connection.close();
});
