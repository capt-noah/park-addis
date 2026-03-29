"use client";

import { useEffect } from "react";
import { useMap } from "../MapContext";

export default function RouteLayer() {
  const { map, navigation } = useMap();

  useEffect(() => {
    if (!map || !map.loaded()) return;

    const sourceId = "route";
    const layerId = "route-layer";

    const updateLayer = () => {
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

      if (map.getSource(sourceId)) {
        (map.getSource(sourceId) as any).setData(geojson);
      } else {
        map.addSource(sourceId, {
          type: "geojson",
          data: geojson,
        });

        map.addLayer({
          id: layerId,
          type: "line",
          source: sourceId,
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-width": 5,
            "line-color": "#40c091",
            "line-opacity": 0.8,
          },
        });
      }
    };

    updateLayer();

    // Clean up on unmount or if navigation status becomes IDLE
    if (navigation.status === "IDLE") {
        if (map.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', 'none');
    } else {
        if (map.getLayer(layerId)) map.setLayoutProperty(layerId, 'visibility', 'visible');
    }

  }, [map, navigation.routeGeometry, navigation.status]);

  return null;
}
