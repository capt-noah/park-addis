import { createContext, useContext } from "react";
import maplibregl from "maplibre-gl"

interface MapContextType {
    map: maplibregl.Map | null;
    coords: { lng: number; lat: number; accuracy?: number } | null;
    locateUser: () => void;
}

export const MapContext = createContext<MapContextType>({
    map: null,
    coords: null,
    locateUser: () => {}
})

export const useMap = () => useContext(MapContext)