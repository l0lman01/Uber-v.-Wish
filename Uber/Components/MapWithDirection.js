import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Dimensions, Button, TouchableOpacity, Image } from 'react-native'
import MapViewDirections from 'react-native-maps-directions'
import Map from './Map'
import { Marker } from 'react-native-maps';
import { AntDesign } from '@expo/vector-icons';
import { api_google } from "../config"

const HEIGHT_INFO_COMMAND = 300

export default function MapWithDirection({mapRegion, destination, setDestination, refMap, setRefMap}) {
  const [pathInfo, setPathInfo] = useState({})

  const DisplayDirection = () => {
    if (destination && Object.keys(destination).length !== 0 && destination.constructor === Object) {
      return(
        <>
          {/* Marker Destination */}
          <Marker
            coordinate={{latitude: destination.latitude, longitude: destination.longitude}}
            title="Test"
            description="test" 
          />
          {/* Marker Info on path */}
          <Marker
            coordinate={{latitude: destination.latitude, longitude: destination.longitude}}
            anchor={{x: 0, y:0}}
          >
            <View style={styles.pathInfo}>
              <Text style={styles.pathTime}>{Math.round(pathInfo["duration"])} {'\n'} min</Text>
              <Text style={styles.destinationName}>{destination.name}</Text>
            </View>
          </Marker>
          {/* Path */}
          <MapViewDirections
            origin = {{latitude: mapRegion.latitude, longitude: mapRegion.longitude}}
            destination = {{latitude: destination.latitude, longitude: destination.longitude}}
            apikey={api_google.KEY}
            strokeColor="#000"
            strokeWidth={3}
            precision="high"
            optimizeWaypoints={true}
            onError={err => {
              alert("Chemin introuvable.")
              setDestination({})
            }}
            onReady={result => {
              // Get Info on the destination
              setPathInfo({distance: result["distance"], duration: result["duration"]})

              // Zoom in/out to see all
              setTimeout(() => {
                const coords = [{latitude: mapRegion.latitude, longitude: mapRegion.longitude}, {latitude: destination.latitude, longitude: destination.longitude}]
        
                refMap.fitToCoordinates(coords, {
                  edgePadding: {
                    bottom: HEIGHT_INFO_COMMAND + 600,
                    right: 50,
                    top: 150,
                    left: 50,
                  },
                  animated: true,
                })
              }, 300)
            }}
          />
        </>
      )
    }
  }

  return (
    <>
      <Map displayOnMap={DisplayDirection} mapRegion={mapRegion} setRefMap={setRefMap}/>
      <TouchableOpacity 
        style={styles.quitButton}
        onPress={() => {
          setDestination({})
        }}>
          <AntDesign name="arrowleft" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.quitButton} />
      <View style={styles.infoCommand}>
          <Text style={styles.primaryText}>Uber</Text>
          <Image style={styles.iconCar} source={require('../assets/iconCar.png')} />
          <Text style={styles.secondaryText}>{Math.round(((pathInfo["distance"]*1.05+0.30*pathInfo["duration"]+1.20) + Number.EPSILON) * 100) / 100} €</Text>
          <TouchableOpacity style={styles.blackPanel}>
            <Text style={styles.tertiaryText}>COMMANDER MON UBER</Text>
          </TouchableOpacity>
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  quitButton: {
      height: 60,
      margin: 30
  },
  infoCommand: {
      backgroundColor: "#fff",
      position: "absolute",
      bottom: 0,
      width: Dimensions.get('window').width,
      height: HEIGHT_INFO_COMMAND,
      alignItems: 'center',
      borderTopLeftRadius: 32,
      borderTopRightRadius: 32
  },
  primaryText: {
    fontSize: 30,
    margin: 12
  },
  secondaryText: {
    fontSize: 25,
    margin: 12
  },
  tertiaryText: {
    fontSize: 20,
    color: "#fff",
    marginHorizontal: 40,
    marginVertical: 12
  },
  iconCar: {
    height: 94,
    width: 126,
  },
  blackPanel: {
    backgroundColor: "#333",
  },
  pathInfo: {
    backgroundColor: "#fff",
    flexDirection: 'row',
    marginTop: 32
  },
  pathTime: {
    backgroundColor: "#333",
    paddingVertical: 4,
    paddingHorizontal: 16,
    color: "#fff",
    fontSize: 16,
    textAlign: 'center'
  },
  destinationName: {
    textAlignVertical: "center",
    padding: 8,
    maxWidth: 200,
  }
});
