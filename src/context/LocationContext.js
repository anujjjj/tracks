import createDataContext from './createDataContext';
import { getDistance } from 'geolib';

const locationReducer = (state, action) => {
  switch (action.type) {
    case 'updateDistanceTravelled':
      let dist = state.currentLocation ?
        parseFloat(getDistance(
          { latitude: state.previousLocation.coords.latitude, longitude: state.previousLocation.coords.longitude },
          { latitude: action.payload.coords.latitude, longitude: action.payload.coords.longitude }
          // accuracy = 50
        ))
        : 0.00;
      return { ...state, distanceTravelled: state.distanceTravelled + dist }
    case 'add_current_location':
      return {
        ...state,
        previousLocation: state.currentLocation,
        currentLocation: action.payload
      };
    case 'start_recording':
      return { ...state, recording: true };
    case 'stop_recording':
      return { ...state, recording: false };
    case 'add_location':
      return {
        ...state, locations: [...state.locations, action.payload]
      };
    case 'change_name':
      return { ...state, name: action.payload };
    case 'reset':
      return { ...state, name: '', locations: [], distanceTravelled: 0 };
    default:
      return state;
  }
};

const changeName = dispatch => name => {
  dispatch({ type: 'change_name', payload: name });
};
const startRecording = dispatch => () => {
  dispatch({ type: 'start_recording' });
};
const stopRecording = dispatch => () => {
  dispatch({ type: 'stop_recording' });
};
const addLocation = dispatch => (location, recording) => {
  dispatch({ type: 'add_current_location', payload: location });
  if (recording) {
    dispatch({ type: 'add_location', payload: location });
    dispatch({ type: 'updateDistanceTravelled', payload: location });
  }

};
const reset = dispatch => () => {
  dispatch({ type: 'reset' });
};

export const { Context, Provider } = createDataContext(
  locationReducer,
  { startRecording, stopRecording, addLocation, changeName, reset },
  { name: '', recording: false, locations: [], currentLocation: null, previousLocation: null, distanceTravelled: 0.00 }
);
