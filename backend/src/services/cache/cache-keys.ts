export const cachedKeys = {
    nearByParking: (lat: number, lng: number, range: number) => {
        return `nearby-parking:${lat},${lng}:${range}`
    },

    route: (startLat: number, startLng: number, endLat: number, endLng: number) => {
        return `route:${startLat},${startLng}:${endLat},${endLng}`
    },

    user: (userId: string) => {
        return `user:${userId}`
    },

    rateLimit: (ip: string, action: string) => {
        return `rate-limit:${ip}:${action}`
    },

    activeReservation: (userId: string) => {
        return `active-reservation:${userId}`
    },

    searchParking: (query: string) => {
        return `search-parking:${query}`
    }
}

