// import "dotenv/config"

// function required(name: string, defaultValue?: string): string{
//     const value = process.env[name] || defaultValue

//     if (!value) {
//         console.error(`--- ENV DEBUG ---`)
//         console.error(`Current keys:`, Object.keys(process.env).filter(k => !k.includes('KEY') && !k.includes('SECRET') && !k.includes('PASSWORD')))
//         console.error(`Searching for: ${name}`)
//         console.error(`Found: ${value}`)
//         throw new Error(`${name}: Not Found`)
//     }
    
//     return value
// }

// export const env = {
//     DATABASE_URL: required("DATABASE_URL"),
//     PORT: required("PORT"),
//     CHAPA_SECRET_KEY: required("CHAPA_SECRET_KEY"),
//     APP_URL: required("APP_URL", "http://localhost:3000")
// }