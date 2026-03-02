import {useEffect, useRef} from 'react';
import { useForceUpdate } from './hooks';

const DEFAULT_CAMERA_STATE = {
  center: {lat: 0, lng: 0, altitude: 0},
  range: 0,
  heading: 0,
  tilt: 0,
  roll: 0
};

/**
 * Camera property names that correspond to gmp-*change events.
 */
const CAMERA_PROPS = ['center', 'range', 'heading', 'tilt', 'roll'];

/**
 * Updates the camera state ref with values from the map element.
 */
function updateCameraState(
  map3d,
  ref,
  prop
) {
  const value = map3d[prop];

  if (value == null) return;

  if (prop === 'center') {
    // The center property returns a LatLngAltitude object, convert to literal
    const center = value;
    ref.current.center = center.toJSON
      ? center.toJSON()
      : center;
  } else {
    ref.current[prop] = value;
  }
}

/**
 * Creates a mutable ref object to track the last known state of the 3D map camera.
 * This is used in `useMap3DCameraParams` to reduce stuttering by avoiding updates
 * of the map camera with values that have already been processed.
 *
 * @internal
 */
export function useTrackedCameraStateRef3D(
  map3d
) {
  const forceUpdate = useForceUpdate();
  const ref = useRef({...DEFAULT_CAMERA_STATE});

  useEffect(() => {
    if (!map3d) return;

    const listeners = [];

    for (const prop of CAMERA_PROPS) {
      const eventName = `gmp-${prop}change`;

      const handler = () => {
        updateCameraState(map3d, ref, prop);
        forceUpdate();
      };

      map3d.addEventListener(eventName, handler);
      listeners.push(() => map3d.removeEventListener(eventName, handler));
    }

    return () => {
      for (const removeListener of listeners) {
        removeListener();
      }
    };
  }, [map3d, forceUpdate]);

  return ref;
}