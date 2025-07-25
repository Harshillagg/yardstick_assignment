import mongoose from "mongoose";

interface ConnectionObject {
  isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
  if (connection.isConnected) {
    console.log("Already connected to database");
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI || "");
    connection.isConnected = db.connections[0].readyState;
    console.log("DB connected Succesfully");
  } catch (error) {
    console.log("Connection failed", error);
    process.exit(1);
  }
}

export default dbConnect;
