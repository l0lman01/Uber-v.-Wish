import React from 'react'
import { View, StyleSheet, Dimensions } from 'react-native'
import MapView, { Marker } from 'react-native-maps';

export default function Map({displayOnMap, mapRegion, setRefMap}) {
    return (
        <View>
            <MapView 
                style={styles.map}
                region={mapRegion}
                ref={ref => {
                    setRefMap(ref)
                }}>
                <Marker
                    coordinate={{latitude: mapRegion.latitude, longitude: mapRegion.longitude}}
                    title="Test"
                    description="test" 
                />
                {displayOnMap()}
            </MapView>
        </View>
    )
}

const styles = StyleSheet.create({
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height + 85,
      position: 'absolute'
    }
  });
  