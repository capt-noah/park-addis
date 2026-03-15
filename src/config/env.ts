
function required(name: string): string{
    const value = process.env[name]

    if (!value) throw new Error(`${name}: Not Found`)
    
    return value
}

export const env = {
    DATABASE_URL: required("DATABASE_URL"),
    PORT: required("PORT")
}