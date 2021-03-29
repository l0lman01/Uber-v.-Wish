import React from 'react'
import { View, StyleSheet } from 'react-native'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { api_google } from "../config"

export default function SearchBar({setDestination}) {
    return (
        <View style={styles.searchBar}>
            <GooglePlacesAutocomplete
                placeholder="Search"
                minLength={2}
                onPress={async (data, details = null) => {
                    // Get info on destination
                    const placeDetailsUrl = `${api_google.URL}place/details/json?reference=${details["place_id"]}&sensor=true&key=${api_google.KEY}`
                    const response = await fetch(placeDetailsUrl)
                    const result = await response.json()
                    const location = result["result"]["geometry"]["location"]
                    setDestination({latitude: location.lat, longitude: location.lng, name: details["description"]})
                }}
                query={{
                    key: api_google.KEY,
                }}
                nearbyPlacesAPI="GooglePlacesSearch"
                GooglePlacesSearchQuery={{
                    rankby: 'distance',
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    searchBar: {
        padding: 40, flex: 1
    }
})
