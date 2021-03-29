import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location'
import * as firebase from 'firebase'
import { firebase_config } from './config'

import SearchBar from './Components/SearchBar'
import MapWithDirection from './Components/MapWithDirection'
import Map from './Components/Map'

import {Notif} from './Components/Notif'

if (!firebase.apps.length) {
  firebase.initializeApp(firebase_config)
}else {
  firebase.app()
}

Notif()

export default function App() {
  const [errorMessage, setErrorMessage] = useState(null)
  const [mapRegion, setMapRegion] = useState(null)
  const [destination, setDestination] = useState({})
  const [refMap, setRefMap] = useState(null)

  useEffect(() => {
    load()
  }, [])

  const load = async() => {
    setMapRegion(null)
    setErrorMessage(null)
    try {
      // Get Permission
      let { status } = await Location.getPermissionsAsync()

      if (status != 'granted') {
        let { status } = await Location.requestPermissionsAsync()
        if (status != 'granted') {
          setErrorMessage('Acces to location is needed to run the app')
          return
        }
      }

      // Get Location
      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.BestForNavigation})
      setMapRegion({latitude: location.coords.latitude, longitude: location.coords.longitude, latitudeDelta: 0.0922, longitudeDelta: 0.0421})
    } catch (error) {
      setErrorMessage(errorMessage)
    }
  }

  if (mapRegion != null) {
    if (destination && Object.keys(destination).length === 0 && destination.constructor === Object) { // Map with search
      return (
        <View style={styles.container}>
          <Map displayOnMap={() => {}} mapRegion={mapRegion} setRefMap={setRefMap}/>
          <SearchBar setDestination = {setDestination}/>
        </View>
      );
    } else { // Map with Direction
      return (
        <MapWithDirection 
          mapRegion={mapRegion} 
          destination={destination} 
          setDestination={setDestination}
          refMap={refMap}
          setRefMap={setRefMap}
        />
      )
    }
  } else if (errorMessage != null) { // Error Message
    return(
      <View style={styles.container}>
        <Text>{errorMessage}</Text>
      </View>
    )
  } else { // Loading
    return(
      <View style={styles.container}>
        <ActivityIndicator />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});
