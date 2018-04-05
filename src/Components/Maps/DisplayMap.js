import React, { Component } from 'react';
import { StyleSheet, View, PermissionsAndroid, TouchableOpacity, StatusBar, NativeModules, AsyncStorage, Promise, DeviceEventEmitter } from 'react-native';
import { StackNavigator } from 'react-navigation';
import MapView from 'react-native-maps'
import VirtualLocation from './VirtualLocation'
import haversine from 'haversine';
import DeviceBattery from 'react-native-device-battery';

import {
  Container,
  Header,
  Title,
  Content,
  Button,
  Icon,
  ListItem,
  Text,
  Left,
  Right,
  Body,
  Item
} from 'native-base';

let id = 0;
export default class DisplayMap extends Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="map" style={{ color: tintColor }} />
    },
    title: 'Tracking Me',
    headerTitle: "aaa",
    headerRight: (
      <Button
        onPress={() => alert('This is a button!')}
        title="Info"
        color="#fff"
      />
    ),
  };

  componentDidMount() {
    // await navigator.geolocation.getCurrentPosition(
    //       (position) => {
    //         //this.setState({latitude:position.coords.latitude, longitude:position.coords.longitude})
    //         console.log(position);

    //       },
    //       (error) => console.log(new Date(), error),
    //       { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    //     )

    this.setState({
      region: {
        latitude: 16.0585026,
        longitude: 108.2199589,
        latitudeDelta: 0.09,
        longitudeDelta: 0.09
      }
    })
    DeviceBattery.getBatteryLevel().then(level => {
      this.setState({ battery: level }) // between 0 and 1
    }).catch(reject => console.log(reject))

  };

  constructor(props) {
    super(props);

    // this.getInitialState()
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
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        console.log(position);

      },
      (error) => console.log(new Date(), error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    )

    let watchID = navigator.geolocation.watchPosition((position) => {
      AsyncStorage.setItem('curLocation', position.coords)
      this.setState({
        marker1:
          {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          }
      })
      if (position !== null) this.onRegionChange(position.coords)
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
  // getBatteryLevel = (callback) => {
  //   NativeModules.BatteryStatus.getBatteryStatus(callback);
  // }
  async postLocation(userid, latitude, longitude, LastUpdate) {
    var d = new Date();
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var n = new Date(d - tzoffset).toISOString().slice(0, 19).replace('T', ' ');
    console.log('fetch', n)
    var des = ''



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
        Battery: parseInt(this.state.battery * 100),
        Description: des
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

  async loadToken() {
    try {
      const a = await AsyncStorage.getItem('token');
      if (a !== null) {
        // We have data!!
        console.log(a);
      } else console.log('token null')
    } catch (error) {
      // Error retrieving data
      console.log('Token error.')
    }
  }
  // async componentDidMount() {
  //   
  //   );


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
  onRegionChange(region) {

    this.setState({
      region: {

        latitude: region.latitude,
        longitude: region.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,

      }
    })
  }

  render() {
    return (
      <View style={{ flex: 1 }}>

        <Container style={{ flex: 1 }} >
          <Header>
            <Left>
              <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                <Icon name="md-menu" />
              </Button>
            </Left>
            <Body><Text style={{ color: 'white' }}>Tracking Me</Text></Body>
          </Header>
        </Container>

        <View style={{ flex: 10 }} >

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
            region={this.state.region}
          //onRegionChange={(region)=>this.addMarker(region)}

          >

            <MapView.Marker
              coordinate={{
                latitude: this.state.marker1.latitude,
                longitude: this.state.marker1.longitude
              }}
              key={id++}
            />
            <MapView.Polyline
              coordinates={this.state.markers.map((marker) => (marker.coordinate))}
              strokeWidth={4}
              strokeColor='#428bca'
            />
          </MapView>
        </View>
        <View style={{
          //position:'absolute',
          left: 0, bottom: 0, right: 0,
          flexDirection: 'row',
          flex: 1,
          //marginBottom:50
          backgroundColor: 'rgba(255,255,255,0.5)',
          paddingVertical: 5,

        }}>
          <View style={{ flex: 1 }}>
            <Text style={styles.titleText}>Distance (m)</Text>
            <Text style={styles.detailText}>{this.state.distance > 0 ? parseFloat(this.state.distance).toFixed(2) : '0' + ' m'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.titleText}>Speed (km/h)</Text>
            <Text style={styles.detailText}>{this.state.speed > 0 ? parseFloat(this.state.speed * 3.6).toFixed(2) : '0' + ' km/h'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.titleText}>Direct</Text>
            <Text style={styles.detailText}>{this.state.direction}</Text>

          </View>
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
