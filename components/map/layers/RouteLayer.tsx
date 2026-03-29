"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../MapContext";

export default function RouteLayer() {
  const { map, navigation } = useMap();
  const sourceId = "route-line-source";
  const layerId = "route-line-layer";
  const isInitialized = useRef(false);

  useEffect(() => {
    if (!map) return;

    const addLayer = () => {
      if (!map.getSource(sourceId)) {
        console.log("RouteLayer: Initializing source and layer");
        map.addSource(sourceId, {
          type: "geojson",
          data: { type: "FeatureCollection", features: [] },
        });

        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
            "visibility": "none"
          },
          paint: {
            "line-width": 4,
            "line-color": "#10B981",
            "line-opacity": 0.8,
          },
        });
        isInitialized.current = true;
        // Trigger an update immediately after adding
        updateData();
      }
    };

    const updateData = () => {
      const source = map.getSource(sourceId);
      if (!source) return;

      const geojson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: navigation.routeGeometry
          ? [
              {
                type: "Feature",
                geometry: navigation.routeGeometry,
                properties: {},
              },
            ]
          : [],
      };

      (source as any).setData(geojson);
      map.setLayoutProperty(layerId, 'visibility', (navigation.status === "IDLE" || !navigation.routeGeometry) ? 'none' : 'visible');
    };

    if (map.isStyleLoaded()) {
      addLayer();
    } else {
      map.once('style.load', addLayer);
    }

    // Always try to update if initialized
    if (isInitialized.current) {
      updateData();
    }

  }, [map, navigation.routeGeometry, navigation.status]);

  return null;
}
