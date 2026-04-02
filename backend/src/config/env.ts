import "dotenv/config"

function required(name: string): string{
    const value = process.env[name]

    if (!value) throw new Error(`${name}: Not Found`)
    
    return value
}

export const env = {
    DATABASE_URL: required("DATABASE_URL"),
    PORT: required("PORT"),
    CHAPA_SECRET_KEY: required("CHAPA_SECRET_KEY"),
    VERCEL_URL: require("VERCEL_URL")
}