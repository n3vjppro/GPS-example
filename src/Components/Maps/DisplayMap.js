import React, { Component } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, TouchableOpacity, AsyncStorage } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'native-base'
import MapView from 'react-native-maps'
import VirtualLocation from './VirtualLocation'
import haversine from 'haversine';

let id = 0;
export default class DisplayMap extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="map" style={{ color: tintColor }} />
    },
    header: null
  };
  constructor(props) {
    super(props);
    this.state = {
      distance: 0,
      speed: 0.00,
      direction: '',

    }
    // setInterval(() => {
    //   this.setState({
    //     distance: Math.random() * 100,
    //     speed: Math.random() * 15,
    //     direction: this.state.direction === 'N' ? 'NW' : 'N',
    //   });
    // }, 1000)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        //this.setState({latitude:position.coords.latitude, longitude:position.coords.longitude})
        console.log(position);
        alert('lat: ' + position.coords.latitude + ' long: ' + position.coords.longitude)
      },
      (error) => console.log(new Date(), error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    );

    let watchID = navigator.geolocation.watchPosition((position) => {
      let distance = 0;
      if (this.state.preCoords) {
        distance = this.state.distance + haversine(this.state.preCoords, position.coords, { unit: 'meter' }),
          this.setState({ distance: distance })
      }

      let x = position.coords.heading;
      if ((x > 0 && x <= 23) || (x > 338 && x <= 360))
        this.setState({ direction: 'N' });
      else if ((x > 23 && x <= 65))
        this.setState({ direction: 'NE' });
      else if ((x > 65 && x <= 110))
        this.setState({ direction: 'E' });
      else if ((x > 110 && x <= 155))
        this.setState({ direction: 'SE' });
      else if ((x > 155 && x <= 203))
        this.setState({ direction: 'S' });
      else if ((x > 203 && x <= 248))
        this.setState({ direction: 'SW' });
      else if ((x > 248 && x <= 293))
        this.setState({ direction: 'W' });
      else if ((x > 293 && x <= 338))
        this.setState({ direction: 'NW' });
      this.postLocation('2', position.coords.latitude, position.coords.longitude, position.timestamp);

      this.setState({
        markers: [
          ...this.state.markers, {
            coordinate: position.coords,
            key: id++
          }
        ],
        preCoords: position.coords,
        distance

      }, null, { distanceFiler: 5 }
      ),
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          speed: position.coords.speed

        })

    },
    );
    this.state = { markers: [], watchID }
  }

  async postLocation(userid, latitude, longitude, LastUpdate) {
    var d = new Date();
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var n = new Date(d - tzoffset).toISOString().slice(0, 19).replace('T', ' ');
    console.log('fetch', n)
    var des=''
    let latlng = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=true&key=AIzaSyBAKmIRhHy16oixr-Suxus0p7fkZqs2e7w"
    await fetch(latlng).then((response) => response.json())
      .then((responseJson) => {
        // this.setState({ markerInfor: responseJson.results[0].formatted_address })
        // console.log(this.state.markerInfor)
        des = responseJson.results[0].formatted_address
        console.log(des)
      })
      .catch((error) => {
        console.log(error);
      })


    await fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
      },
      body: JSON.stringify({
        userid: userid,
        latitude: latitude,
        longtitude: longitude,
        LastUpdate: n,
        Description:des
      }),

    })
      .then((response) => response.json())
      .then((responseJson) => {

        console.log(responseJson)
      })
      .catch((error) => {

        console.log(error);
      })

  }

  // async addMarker(region) {
  //   let now = (new Date).getTime();
  //   if (this.state.ladAddedMarker > now - 5000) { return; }
  //   this.setState({
  //     markers: [
  //       ...this.state.markers, {
  //         coordinate: region,
  //         key: id++
  //       }
  //     ],
  //     ladAddedMarker: now
  //   });
  // }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <View style={{
          //position:'absolute',
          left: 0, bottom: 0, right: 0,
          flexDirection: 'row',
          flex: 1,
          //marginBottom:50
          backgroundColor: 'rgba(255,255,255,0.5)',
          paddingVertical: 15,

        }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.titleText}>Distance</Text>
            <Text style={styles.detailText}>{parseFloat(this.state.distance).toFixed(2) + ' m'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.titleText}>Speed</Text>
            <Text style={styles.detailText}>{parseFloat(this.state.speed * 3.6).toFixed(2) + ' km/h'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.titleText}>Direct</Text>
            <Text style={styles.detailText}>{this.state.direction}</Text>

          </View>
        </View>
        <View style={{ flex: 6 }} >

          <MapView style={styles.map}
            provider="google"
            showsUserLocation={true}
            showsMyLocationButton={true}
            showsCompass={true}
            followsUserLocation={true}
            loadingEnabled={true}
            toolbarEnabled={true}
            zoomEnabled={true}
            rotateEnabled={true}
            initialRegion={{
              latitude: 16.0585026,
              longitude: 108.2199589,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          //onRegionChange={(region)=>this.addMarker(region)}

          >
            <MapView.Polyline
              coordinates={this.state.markers.map((marker) => (marker.coordinate))}
              strokeWidth={4}
              strokeColor='#428bca'
            />
          </MapView>
        </View>

      </View>
    );
  }
}
const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject, padding: 1, margin: 1
    //marginTop:50,
  },
  titleText: {
    textAlign: 'center',
    fontWeight: '700',
    color: '#666'
  },
  detailText: {
    textAlign: 'center',
    fontWeight: '200',
    fontSize: 20,
  }
})
