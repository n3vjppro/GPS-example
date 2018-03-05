import React, { Component } from 'react';
import Main from './src/Screen/Main';
import { StyleSheet, Text, View,PermissionsAndroid } from 'react-native';

import MapView from 'react-native-maps'

let id=0;
export default class App extends Component {
  constructor(props){
    super(props);
    this.state={markers:[]};
    navigator.geolocation.getCurrentPosition(
      (position) => {
          console.log(position);
      },
      (error) => console.log(new Date(), error),
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 3000}
  );  

    navigator.geolocation.watchPosition((position)=>{
      this.setState({
        markers:[
          ...this.state.markers,{
            coordinate: position.coords,
            key:id++
          }
        ]
      }, null, {distanceFiler:2}
    )
    })
  }
    addMarker(region){
      let now = (new Date).getTime();
      if(this.state.ladAddedMarker>now-5000){return;}
      this.setState({
        markers:[
          ...this.state.markers,{
            coordinate: region,
            key:id++
          }
        ],
        ladAddedMarker:now
      })
    
  }
  async  requestCameraPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Cool Photo App Camera Permission',
          'message': 'Cool Photo App needs access to your camera ' +
                     'so you can take awesome pictures.'
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the location")
      } else {
        console.log("Location permission denied")
      }
    } catch (err) {
      console.warn(err)
    }
  }
  render() {
    return (
      <View style={{flex:1}}>
        <MapView style={styles.map}
        showsUserLocation
        followsUserLocation
        initialRegion={{
          latitude: 16.0585026,
          longitude: 108.2199589,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        onRegionChange={(region)=>this.addMarker(region)}

        >
        {this.state.markers.map((marker)=>(
          <MapView.Marker coordinate={marker.coordinate} key={marker.key}/>
        ))}
        </MapView>
        <Text>asd</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  map:{
    ...StyleSheet.absoluteFillObject
  }
})
