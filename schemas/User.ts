import mongoose, { Schema, models, model } from "mongoose";

const userSchema = new Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    role: { type: String, enum: ["driver", "owner"], default: "driver" },
    createdAt: {type: Date, default: Date.now}
})

export const User = models.User || model("User", userSchema)