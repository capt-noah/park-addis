import {
  index,
  timestamp,
  uuid,
  pgTable,
} from "drizzle-orm/pg-core";
import { users } from "./users";
import { employees } from "./employees";
import { admins } from "./admins";

export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
    employeeId: uuid("employee_id").references(() => employees.id, { onDelete: "cascade" }),
    adminId: uuid("admin_id").references(() => admins.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({
    sessionUserIndex: index("idx_sessions_user_id").on(table.userId),
    sessionEmployeeIndex: index("idx_sessions_employee_id").on(table.employeeId),
    sessionAdminIndex: index("idx_sessions_admin_id").on(table.adminId),
  }),
);
