import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async (): Promise<void> => {
  if (isConnected) {
    console.log("Already connected to MongoDB");
    return;
  }

  const mongoUrl = process.env.MONGO_URL;
  if (!mongoUrl) {
    console.error(" MONGO_URL is not defined in environment variables");
    throw new Error("MONGO_URL not defined");
  }

  try {
    await mongoose.connect(mongoUrl || '' , {
    //   dbName: "your-db-name", // Can be passed here or set in MONGO_URL
    });

    // on is the eventlistner give by the mongodb , 
    // "event-name given" i.e connected / error / disconnected and then call back function
    mongoose.connection.on("connected", () => { 
      isConnected = true;
      console.log("MongoDB connected successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
    });

    mongoose.connection.on("disconnected", () => {
      isConnected = false;
      console.warn("MongoDB disconnected");
    });

  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
};

export default connectToDB;
