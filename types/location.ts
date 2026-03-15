export interface ParkingLocation {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  price: number;
  status: 'Available' | 'Full';
  image: string;
  rating: number;
  distance: number;
  popular: number;
}
