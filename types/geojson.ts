
export interface ParkingFeatures {
    type: 'Feature',
    geometry: {
        type: 'Point',
        coordinates: [lng: number, lat: number]
    },
    properties: {
        id: string,
        name: string,
        address: string,
        ratingsCount: number,
        ratingsSum: number,
        ratings: number,
        price: number,
        distance: number, 
        eta: number
    }
}

export interface GeoJSONFeature {
    type: 'FeatureCollection',
    features: ParkingFeatures[]
}