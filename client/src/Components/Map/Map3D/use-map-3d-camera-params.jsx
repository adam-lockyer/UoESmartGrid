/* eslint-disable react-hooks/immutability -- Google Maps API objects are designed to be mutated */
import { useLayoutEffect } from "react";

/**
 * Converts a LatLngAltitude or LatLngAltitudeLiteral to a literal object.
 */
function toLatLngAltitudeLiteral(value) {
    if (!value) return null;

    // Check if it's a LatLngAltitude object with toJSON method
    if ("toJSON" in value && typeof value.toJSON === "function") {
        return value.toJSON();
    }

    return value;
}

/**
 * Hook to update Map3D camera parameters when props change.
 * Compares the current camera state with props and updates only when there are differences.
 *
 * @internal
 */
export function useMap3DCameraParams(map3d, cameraStateRef, props) {
    const centerLiteral = toLatLngAltitudeLiteral(props.center);

    const lat = centerLiteral?.lat ?? null;
    const lng = centerLiteral?.lng ?? null;
    const altitude = centerLiteral?.altitude ?? null;

    const range = props.range ?? null;
    const heading = props.heading ?? null;
    const tilt = props.tilt ?? null;
    const roll = props.roll ?? null;

    // Runs on every render to sync controlled camera props with the map element
    useLayoutEffect(() => {
        if (!map3d) return;

        const currentState = cameraStateRef.current;

        if (
            lat !== null &&
            lng !== null &&
            (currentState.center.lat !== lat ||
                currentState.center.lng !== lng ||
                (altitude !== null && currentState.center.altitude !== altitude))
        ) {
            map3d.center = {
                lat,
                lng,
                altitude: altitude ?? currentState.center.altitude ?? 0,
            };
        }

        if (range !== null && currentState.range !== range) {
            map3d.range = range;
        }

        if (heading !== null && currentState.heading !== heading) {
            map3d.heading = heading;
        }

        if (tilt !== null && currentState.tilt !== tilt) {
            map3d.tilt = tilt;
        }

        if (roll !== null && currentState.roll !== roll) {
            map3d.roll = roll;
        }
    });
}
