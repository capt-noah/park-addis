import mongoose, { Schema, models, model } from "mongoose"

const sessionSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    token: { type: String, required: true, unique: true },
    createdAt: { type: Date, default: Date.now },
    expiresAt: {type: Date, default: () => new Date(Date.now() + 1000 * 60 * 60 * 24 * 7)}
})

export const Session = models.Session || model("Session", sessionSchema)