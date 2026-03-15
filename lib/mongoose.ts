import mongoose from "mongoose";

const CONN_URI = "mongodb+srv://capt_noah:vG6T9Kfsx76V@cluster0.lxbg0x1.mongodb.net/park_addis"

let cached = (global as any).mongoose

if (!cached) {
    cached = (global as any).mongoose = {conn: null, promise: null}
}

async function dbConnect() {
    if (cached.conn) return cached.conn
    
    if (!cached.promise) {
        cached.promise = mongoose.connect(CONN_URI).then((mongoose) => mongoose)
    }

    cached.conn = await cached.promise
    return cached.conn
}

export default dbConnect;