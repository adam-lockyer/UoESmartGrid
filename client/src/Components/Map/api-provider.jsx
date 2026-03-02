import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState
} from 'react';
import {importLibrary, setOptions} from '@googlemaps/js-api-loader';

export const APILoadingStatus = {
  NOT_LOADED: 'NOT_LOADED',
  LOADING: 'LOADING',
  LOADED: 'LOADED',
  FAILED: 'FAILED',
  AUTH_FAILURE: 'AUTH_FAILURE'
}

const VERSION = 'alpha';

const DEFAULT_SOLUTION_CHANNEL = 'GMP_visgl_rgmlibrary_v1_default';
const DEFAULT_INTERNAL_USAGE_ATTRIBUTION_IDS = [
  `gmp_visgl_reactgooglemaps_v${VERSION}`
];

export const APIProviderContext =
  React.createContext(null);

// loading the Maps JavaScript API can only happen once in the runtime, so these
// variables are kept at the module level.
let loadingStatus = APILoadingStatus.NOT_LOADED;
let serializedApiParams;

const listeners = new Set();

/**
 * Called to update the local status and notify the listeners for any mounted
 * components.
 * @internal
 */
function updateLoadingStatus(status) {
  if (status === loadingStatus) {
    return;
  }
  loadingStatus = status;
  listeners.forEach(listener => listener(loadingStatus));
}

/**
 * Local hook to set up the map-instance management context.
 * @internal
 */
function useMapInstances() {
  const [mapInstances, setMapInstances] = useState({});

  const addMapInstance = (mapInstance, id = 'default') => {
    setMapInstances(instances => ({...instances, [id]: mapInstance}));
  };

  const removeMapInstance = (id = 'default') => {
    setMapInstances(({[id]: _, ...remaining}) => remaining);
  };

  const clearMapInstances = () => {
    setMapInstances({});
  };

  return {mapInstances, addMapInstance, removeMapInstance, clearMapInstances};
}

/**
 * local hook to set up the 3D map-instance management context.
 */
function useMap3DInstances() {
  const [map3dInstances, setMap3DInstances] = useState({});

  const addMap3DInstance = (
    map3dInstance,
    id = 'default'
  ) => {
    setMap3DInstances(instances => ({...instances, [id]: map3dInstance}));
  };

  const removeMap3DInstance = (id = 'default') => {
    setMap3DInstances(({[id]: _, ...remaining}) => remaining);
  };

  const clearMap3DInstances = () => {
    setMap3DInstances({});
  };

  return {
    map3dInstances,
    addMap3DInstance,
    removeMap3DInstance,
    clearMap3DInstances
  };
}

/**
 * Local hook to handle the loading of the maps API.
 * @internal
 */
function useGoogleMapsApiLoader(props) {
  const {
    onLoad,
    onError,
    apiKey,
    version,
    libraries = [],
    region,
    language,
    authReferrerPolicy,
    channel,
    solutionChannel,
    fetchAppCheckToken
  } = props;

  const [status, setStatus] = useState(loadingStatus);
  const [loadedLibraries, addLoadedLibrary] = useReducer(
    (
      loadedLibraries,
      action
    ) => {
      return loadedLibraries[action.name]
        ? loadedLibraries
        : {...loadedLibraries, [action.name]: action.value};
    },
    {}
  );

  const currentSerializedParams = useMemo(() => {
    const params = {
      apiKey,
      version,
      libraries: libraries.join(','),
      region,
      language,
      authReferrerPolicy,
      channel,
      solutionChannel
    };
    return JSON.stringify(params);
  }, [
    apiKey,
    version,
    libraries,
    region,
    language,
    authReferrerPolicy,
    channel,
    solutionChannel
  ]);

  const importLibraryCallback = useCallback(
    async (name) => {
      if (loadedLibraries[name]) {
        return loadedLibraries[name];
      }

      const res = await importLibrary(name);
      addLoadedLibrary({name, value: res});

      return res;
    },
    [loadedLibraries]
  );

  // effect: we want to get notified of global loading-status changes
  useEffect(() => {
    listeners.add(setStatus);

    // sync component state on mount (shouldn't be different from the initial state)
    setStatus(loadingStatus);

    return () => {
      listeners.delete(setStatus);
    };
  }, []);

  // effect: set and store options
  useEffect(
    () => {
      (async () => {
        try {
          // This indicates that the API has been loaded with a different set of parameters.
          // While this is not blocking, it's not recommended and we should warn the user.
          if (
            serializedApiParams &&
            serializedApiParams !== currentSerializedParams
          ) {
            console.warn(
              `The Google Maps JavaScript API has already been loaded with different parameters. ` +
                `The new parameters will be ignored. If you need to use different parameters, ` +
                `please refresh the page.`
            );
          }

          const librariesToLoad = ['core', 'maps', ...libraries];

          // If the google.maps namespace is already available, the API has been loaded externally.
          if (window.google?.maps?.importLibrary) {
            if (!serializedApiParams) {
              updateLoadingStatus(APILoadingStatus.LOADED);
            }
            await Promise.all(
              librariesToLoad.map(name => importLibraryCallback(name))
            );
            if (onLoad) onLoad();
            return;
          }

          // Abort if the API is already loading or has been loaded.
          if (
            loadingStatus === APILoadingStatus.LOADING ||
            loadingStatus === APILoadingStatus.LOADED
          ) {
            if (loadingStatus === APILoadingStatus.LOADED && onLoad) onLoad();
            return;
          }

          serializedApiParams = currentSerializedParams;
          updateLoadingStatus(APILoadingStatus.LOADING);

          const options = Object.fromEntries(
            Object.entries({
              key: apiKey,
              v: version,
              libraries,
              region,
              language,
              authReferrerPolicy
            }).filter(([, value]) => value !== undefined)
          );

          if (channel !== undefined && channel >= 0 && channel <= 999) {
            options.channel = String(channel);
          }

          // solution-channel: when undefined, use the default; otherwise use
          // an explicit value.
          if (solutionChannel === undefined) {
            options.solutionChannel = DEFAULT_SOLUTION_CHANNEL;
          } else if (solutionChannel !== '') {
            options.solutionChannel = solutionChannel;
          }

          // this will actually trigger loading the maps API
          setOptions(options);

          // wait for all requested libraries (inluding 'core' and 'maps') to
          // finish loading
          await Promise.all(
            librariesToLoad.map(name => importLibraryCallback(name))
          );
          updateLoadingStatus(APILoadingStatus.LOADED);

          if (onLoad) {
            onLoad();
          }
        } catch (error) {
          updateLoadingStatus(APILoadingStatus.FAILED);
          if (onError) {
            onError(error);
          } else {
            console.error(
              'The Google Maps JavaScript API failed to load.',
              error
            );
          }
        }
      })();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentSerializedParams, onLoad, onError, importLibraryCallback, libraries]
  );

  // set the fetchAppCheckToken if provided
  useEffect(() => {
    if (status !== APILoadingStatus.LOADED) return;

    const settings = google.maps.Settings.getInstance();
    if (fetchAppCheckToken) {
      settings.fetchAppCheckToken = fetchAppCheckToken;
    } else if (settings.fetchAppCheckToken) {
      settings.fetchAppCheckToken = null;
    }
  }, [status, fetchAppCheckToken]);

  return {
    status,
    loadedLibraries,
    importLibrary: importLibraryCallback
  };
}

function useInternalUsageAttributionIds(props) {
  return useMemo(
    () =>
      props.disableUsageAttribution
        ? null
        : DEFAULT_INTERNAL_USAGE_ATTRIBUTION_IDS,
    [props.disableUsageAttribution]
  );
}

/**
 * Component to wrap the components from this library and load the Google Maps JavaScript API
 */
export const APIProvider = props => {
  const {children, ...loaderProps} = props;
  const {mapInstances, addMapInstance, removeMapInstance, clearMapInstances} =
    useMapInstances();
  const {
    map3dInstances,
    addMap3DInstance,
    removeMap3DInstance,
    clearMap3DInstances
  } = useMap3DInstances();

  const {status, loadedLibraries, importLibrary} =
    useGoogleMapsApiLoader(loaderProps);

  const internalUsageAttributionIds =
    useInternalUsageAttributionIds(loaderProps);

  const contextValue = useMemo(
    () => ({
      mapInstances,
      addMapInstance,
      removeMapInstance,
      clearMapInstances,
      map3dInstances,
      addMap3DInstance,
      removeMap3DInstance,
      clearMap3DInstances,
      status,
      loadedLibraries,
      importLibrary,
      internalUsageAttributionIds
    }),
    [
      mapInstances,
      addMapInstance,
      removeMapInstance,
      clearMapInstances,
      map3dInstances,
      addMap3DInstance,
      removeMap3DInstance,
      clearMap3DInstances,
      status,
      loadedLibraries,
      importLibrary,
      internalUsageAttributionIds
    ]
  );

  return (
    <APIProviderContext.Provider value={contextValue}>
      {children}
    </APIProviderContext.Provider>
  );
};

/**
 * @internal
 * Resets module-level state for testing purposes only.
 * This should never be used in production code.
 */
export function __resetModuleState() {
  loadingStatus = APILoadingStatus.NOT_LOADED;
  serializedApiParams = undefined;
  listeners.clear();
}