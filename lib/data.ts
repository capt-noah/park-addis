import { ParkingLocation } from "@/types/location";

export const locationsData: ParkingLocation[] = [
  {
    id: "1",
    name: "Bole Medhanialem",
    address: "Cameroon Street, near Edna Mall",
    lat: 9.0033,
    lng: 38.7845,
    price: 50,
    status: 'Available',
    image: '/bole.png',
    rating: 4.8,
    distance: 3,
    popular: 3
  },
  {
    id: "2",
    name: "Churchill Plaza",
    address: "Churchill Avenue, Downtown",
    lat: 9.0270,
    lng: 38.7510,
    price: 35,
    status: 'Available',
    image: '/piassa.png',
    rating: 4.5,
    distance: 2,
    popular: 3
  },
  {
    id: "3",
    name: "Friendship Park",
    address: "Bole Road, Opposite Airport",
    lat: 9.0190,
    lng: 38.7620,
    price: 50,
    status: 'Available',
    image: '/bole.png',
    rating: 5,
    distance: 8,
    popular: 3
  },
  {
    id: "4",
    name: "Meskel Square",
    address: "Meskel Square, Exhibition Center",
    lat: 9.0105,
    lng: 38.7615,
    price: 25,
    status: 'Full',
    image: '/meskel.png',
    rating: 3.2,
    distance: 1,
    popular: 3
  },
  {
    id: "5",
    name: "Arat Kilo",
    address: "Arat Kilo, Eri Bekentu",
    lat: 9.031626,
    lng: 38.761517,
    price: 20,
    status: 'Available',
    image: '/piassa.png',
    rating: 4,
    distance: 6,
    popular: 4
  },
  {
    id: "6",
    name: "Sedest Kilo",
    address: "Sedest Kilo, Lions Cage",
    lat: 9.041209,
    lng: 38.762180,
    price: 15,
    status: 'Available',
    image: '/bole.png',
    rating: 5,
    distance: 4,
    popular: 5
  }
];
