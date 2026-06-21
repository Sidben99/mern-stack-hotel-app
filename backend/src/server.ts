import app from "./app";
import connectToDatabase from "./conf/mongodbConnection.conf";
const PORT = process.env.PORT || 5000;
import { initEnv } from "./conf/env.conf";
async function startServer() {
  try {
    initEnv();
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
