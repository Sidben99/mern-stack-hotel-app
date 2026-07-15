import mongoose from "mongoose";
import { afterAll, beforeAll, afterEach, beforeEach } from "vitest";
import { initEnv } from "../src/conf/env.conf";
import { server } from "../mocks/node.js";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
beforeAll(async () => {
  initEnv();
  console.log("envs setup correctly");
  await mongoose.connect(process.env.MONGODB_URI_TEST as string);
  console.log("Connected to MongoDB successfully");
});
beforeEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});
afterEach(async () => {
  const collections = await mongoose.connection.db!.collections();
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});
afterAll(async () => {
  await mongoose.connection.close();
});
