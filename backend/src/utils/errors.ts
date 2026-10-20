import { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 400,
    public code: string = "BAD_REQUEST"
  ) {
    super(message);
    this.name = "AppError";
    Error.captureStackTrace(this, this.constructor);
  }
}

export interface SanitizedErrorResponse {
  error: string;
  code: string;
  statusCode: number;
}

/**
 * Sanitizes any error (especially raw Postgres / Drizzle errors) into
 * a secure, human-readable response without leaking table names,
 * database schema details, or system internals.
 */
export function sanitizeError(err: any): SanitizedErrorResponse {
  // If it's a known domain AppError
  if (err instanceof AppError) {
    return {
      error: err.message,
      code: err.code,
      statusCode: err.statusCode,
    };
  }

  // Extract underlying driver error if wrapped by Drizzle ORM
  const cause = err?.cause || err;
  const pgCode = cause?.code || err?.code;
  const detail = String(cause?.detail || err?.detail || err?.message || "");

  // PostgreSQL unique violation error (e.g. email or phone already registered)
  if (
    pgCode === "23505" ||
    detail.includes("violates unique constraint") ||
    detail.includes("duplicate key")
  ) {
    if (detail.includes("email")) {
      return {
        error: "An account with this email already exists.",
        code: "EMAIL_EXISTS",
        statusCode: 409,
      };
    }
    if (detail.includes("phone_number") || detail.includes("phoneNumber")) {
      return {
        error: "An account with this phone number already exists.",
        code: "PHONE_EXISTS",
        statusCode: 409,
      };
    }
    if (detail.includes("plate_number") || detail.includes("plateNumber")) {
      return {
        error: "A vehicle with this license plate number is already registered.",
        code: "PLATE_EXISTS",
        statusCode: 409,
      };
    }
    return {
      error: "A record with these unique details already exists.",
      code: "DUPLICATE_ENTRY",
      statusCode: 409,
    };
  }

  // PostgreSQL foreign key violation error (e.g. location or user not found)
  if (
    pgCode === "23503" ||
    detail.includes("violates foreign key constraint")
  ) {
    return {
      error: "The referenced item could not be found or has been removed.",
      code: "RESOURCE_NOT_FOUND",
      statusCode: 404,
    };
  }

  // PostgreSQL invalid text representation (e.g. invalid UUID format)
  if (
    pgCode === "22P02" ||
    detail.includes("invalid input syntax for type uuid")
  ) {
    return {
      error: "Invalid request format or identifier.",
      code: "INVALID_IDENTIFIER",
      statusCode: 400,
    };
  }

  // PostgreSQL not-null constraint violation
  if (
    pgCode === "23502" ||
    detail.includes("violates not-null constraint")
  ) {
    return {
      error: "A required field was missing from the request.",
      code: "MISSING_REQUIRED_FIELD",
      statusCode: 400,
    };
  }

  // Network / Connection timeouts
  if (pgCode === "ETIMEDOUT" || pgCode === "ECONNREFUSED") {
    return {
      error: "Service temporarily unavailable. Please try again in a moment.",
      code: "SERVICE_UNAVAILABLE",
      statusCode: 503,
    };
  }

  // Fallback for all other unhandled internal errors:
  // Log the real error on the server, but return a safe message to the client
  return {
    error: "An unexpected error occurred. Please try again later.",
    code: "INTERNAL_ERROR",
    statusCode: 500,
  };
}

/**
 * Global Express error handling middleware.
 * Must be registered after all route handlers.
 */
export function globalErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const sanitized = sanitizeError(err);

  // Log full stack trace internally for debugging
  console.error(
    `[SERVER ERROR] ${req.method} ${req.originalUrl || req.url} - Status: ${sanitized.statusCode} - Code: ${sanitized.code}`,
    err?.stack || err
  );

  return res.status(sanitized.statusCode).json({
    error: sanitized.error,
    code: sanitized.code,
  });
}
