import { useEffect, useReducer, useCallback, useState, useContext, useRef } from "react";
import {APILoadingStatus, APIProviderContext} from '../api-provider';

function isDeepEqual(obj1, obj2) {

    if (!obj1 || !obj2) {
      return obj1 === obj2;
    }

    if(obj1 === obj2) // it's just the same object. No need to compare.
        return true;

    if(isPrimitive(obj1) && isPrimitive(obj2)) // compare primitives
        return obj1 === obj2;

    if(Object.keys(obj1).length !== Object.keys(obj2).length)
        return false;

    // compare objects with same number of keys
    for(let key in obj1)
    {
        if(!(key in obj2)) return false; //other object doesn't have this prop
        if(!isDeepEqual(obj1[key], obj2[key])) return false;
    }

    return true;
}

//check if value is primitive
function isPrimitive(obj)
{
    return (obj !== Object(obj));
}

function useMemoized(value, isEqual) {
  const ref = useRef(value);

  if (!isEqual(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useCustomCompareEffect(
  effect,
  dependencies,
  isEqual
) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, [useMemoized(dependencies, isEqual)]);
}

export function useDeepCompareEffect(
  effect,
  dependencies
) {
  useCustomCompareEffect(effect, dependencies, isDeepEqual);
}

export function useForceUpdate() {
  const [, forceUpdate] = useReducer(x => x + 1, 0);

  return forceUpdate;
}

export function useCallbackRef() {
  const [el, setEl] = useState(null);
  const ref = useCallback((value) => setEl(value), [setEl]);

  return [el, ref];
}

export function useApiLoadingStatus() {
  return useContext(APIProviderContext)?.status || APILoadingStatus.NOT_LOADED;
}

export function useApiIsLoaded() {
  const status = useApiLoadingStatus();
  return status === APILoadingStatus.LOADED;
}

export function useMapsLibrary(name) {
  const apiIsLoaded = useApiIsLoaded();
  const ctx = useContext(APIProviderContext);

  useEffect(() => {
    if (!apiIsLoaded || !ctx) return;
    void ctx.importLibrary(name);
  }, [apiIsLoaded, ctx, name]);

  return ctx?.loadedLibraries[name] || null;
}
