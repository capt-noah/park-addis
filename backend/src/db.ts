import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { env } from "@/backend/src/config/env";

const client = postgres(env.DATABASE_URL, { ssl: "require" });

export const db = drizzle(client);
