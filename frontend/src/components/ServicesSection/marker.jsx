import { useEffect, useRef } from "react";

const AdvancedMarker = ({ map, position }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (!map || !position) return;

    // If the marker doesn't exist, create it
    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        position,
        map,
        icon: {
          url: "/src/assets/custom-marker.png",
          scaledSize: new google.maps.Size(40, 40),
        },
      });
    } else {
      markerRef.current.setPosition(position);
      markerRef.current.setMap(map);
    }

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [map, position]);

  return null;
};

export default AdvancedMarker;