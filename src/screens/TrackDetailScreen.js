import React, { useContext } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Context as TrackContext } from '../context/TrackContext';
import MapView, { Polyline } from 'react-native-maps';
import moment from 'moment';

const TrackDetailScreen = ({ navigation }) => {
  const { state } = useContext(TrackContext);
  const _id = navigation.getParam('_id');

  const track = state.find(t => t._id === _id);
  const initialCoords = track.locations[0].coords;

  const endDuration = moment(track.locations[track.locations.length - 1].timestamp);
  const startDuration = moment(track.locations[0].timestamp);
  // console.log();
  const duration = moment.duration(endDuration.diff(startDuration));
  // console.log(duration.as('minutes'));

  return (
    <>
      <Text style={{ fontSize: 48 }}>{track.name}</Text>
      <MapView
        initialRegion={{
          longitudeDelta: 0.01,
          latitudeDelta: 0.01,
          ...initialCoords
        }}
        style={styles.map}
      >
        <Polyline coordinates={track.locations.map(loc => loc.coords)} />
      </MapView>
      <Text >Distance Travelled : {track.distanceTravelled ? track.distanceTravelled : "not calculated"}</Text>
      <Text >Duration : {parseFloat(duration.as('minutes')).toFixed(2)} minutes</Text>
    </>
  );
};

const styles = StyleSheet.create({
  map: {
    height: 300
  }
});

export default TrackDetailScreen;
