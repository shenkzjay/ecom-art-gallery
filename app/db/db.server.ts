import mongoose from "mongoose";

let isConnected = false;
let db: mongoose.Connection;

export async function ConnectToDatabase() {
  if (isConnected) return db;

  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI!);
    db = connection.connection;
    isConnected = true;
    console.log("mongo connected");
    return db;
  } catch (error) {
    console.error(`error connecting to mongodb ${error}`);
    throw error;
  }
}

export { db };
