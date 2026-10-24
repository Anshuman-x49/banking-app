import app from "./app/app.js";
import connectDB from "./config/db.js";
import config from "./config/config.js";

const startServer = async () => {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Error starting server", error);
    process.exit(1);
  }
};

startServer();
