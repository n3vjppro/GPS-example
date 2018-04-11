import React, { Component } from 'react';
import { Animated, StyleSheet, View, PermissionsAndroid, TouchableOpacity, StatusBar, NativeModules, AsyncStorage, Promise, Dimensions } from 'react-native';
import { StackNavigator } from 'react-navigation';
import MapView from 'react-native-maps'
import VirtualLocation from './VirtualLocation'
import haversine from 'haversine';
import DeviceBattery from 'react-native-device-battery';
import LinearGradient from 'react-native-linear-gradient'
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

const { height: screenHeight, width: screenWidth } = Dimensions.get('window')
let id = 0; latitude = 0; longitude = 0;

export default class DisplayMap extends Component {
  scroll = new Animated.Value(0)
  headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, 56), -1)

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

  async componentDidMount() {
    const nDay = new Date();
    this.setState({ nowTime: nDay.getHours() + ":" + nDay.getMinutes() });
    navigator.geolocation.getCurrentPosition(
      (position) => {
        latitude= position.coords.latitude,
        longitude= position.coords.longitude
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        })
        try {
           AsyncStorage.setItem('latitude', this.state.latitude);
           
        } catch (error) {
          // Error saving data
        }
        try {
           AsyncStorage.setItem('longitude', this.state.longitude);
           
        } catch (error) {
          // Error saving data
        }
        

        console.log(position);

      },
      (error) => console.log(new Date(), error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    )


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
    AsyncStorage.getItem('latitude').then(latitude => latitude=latitude).catch(reject=>console.log(reject));
    AsyncStorage.getItem('longitude').then(longitude => longitude).catch(reject=>console.log(reject));;
     
    // setInterval(() => {
    //   this.setState({
    //     distance: Math.random() * 100,
    //     speed: Math.random() * 15,
    //     direction: this.state.direction === 'N' ? 'NW' : 'N',
    //   });
    // }, 1000)

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
    console.log('fetch', n, latitude, longitude)
    var des = ''



    let latlng = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=true&key=AIzaSyBAKmIRhHy16oixr-Suxus0p7fkZqs2e7w"
    await fetch(latlng).then((response) => response.json())
      .then((responseJson) => {
        // this.setState({ markerInfor: responseJson.results[0].formatted_address })
        // console.log(this.state.markerInfor)
        this.setState({ des: responseJson.results[0].formatted_address })
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
        Description: this.state.des
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

      <Container style={StyleSheet.absoluteFill}>
        <Header>
          <Left>
            <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
              <Icon name="md-menu" />
            </Button>
          </Left>
          <Body><Text style={{ color: 'white' }}>Tracking Me</Text></Body>
        </Header>
        <Animated.ScrollView scrollEventThrottle={5}
          showsVerticalScrollIndicator={false}
          style={{ zIndex: 0 }}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scroll } } }], { useNativeDriver: true })}>
          <Animated.View style={{
            height: screenHeight * 0.8,
            width: '100%',
            transform: [{ translateY: Animated.multiply(this.scroll, 0.5) }]
          }}>

            <MapView style={[StyleSheet.absoluteFill, { paddingTop: 1 }]}
              provider="google"
              showsUserLocation={true}
              showsCompass={true}
              showsMyLocationButton={true}
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
                  latitude: latitude,
                  longitude: longitude
                }}  
                key={id++}
              />

              <MapView.Polyline
                coordinates={this.state.markers.map((marker) => (marker.coordinate))}
                strokeWidth={4}
                strokeColor='#428bca'
              />
            </MapView>
            {/* <Button transparent dark style={{
              alignSelf: 'flex-end',
              position: 'absolute'
            }}
              onPress={() => this.setState({
                region: {
                  latitude: this.state.latitude,
                  longitude: this.state.longitude,
                  latitudeDelta: 0.09,
                  longitudeDelta: 0.09
                }
              })}
            >
              <Icon name='md-locate' />
            </Button> */}
          </Animated.View>
          <View style={{ position: 'absolute', height: screenHeight * 0.8, width: '100%' }}>
            <LinearGradient
              colors={['rgba(245,245,245,0.0)', 'rgba(245,245,245,0.35)', 'rgba(245,245,245,1)']}
              locations={[0, 0.7, 1]}
              style={StyleSheet.absoluteFill} />
          </View>
          <View style={{
            transform: [{ translateY: -100 }],
            width: screenWidth,
            //paddingHorizontal: 30,
            //paddingVertical: 20,
            backgroundColor: 'transparent'
          }}>
            <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgb(245,245,245)' }} />
            <View style={{
              //position:'absolute',       
              flexDirection: 'row',
              //marginBottom:50
              //backgroundColor: 'rgba(255,255,255,0.5)',
              paddingVertical: 5,

            }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.titleText}>Distance (m)</Text>
                <Text style={styles.detailText}>{this.state.distance > 0 ? parseFloat(this.state.distance).toFixed(2) : '0'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.titleText}>Speed (km/h)</Text>
                <Text style={styles.detailText}>{this.state.speed > 0 ? parseFloat(this.state.speed * 3.6).toFixed(2) : '0'}</Text>
              </View>


              <View style={{ flex: 1 }}>
                <Text style={styles.titleText}>Direct</Text>
                <Text style={styles.detailText}>{this.state.direction === '' ? 'N/A' : this.state.direction}</Text>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.titleText}>Started At</Text>
              <Text style={styles.detailText}>{this.state.nowTime}</Text>
            </View>
            <View>
              <Text style={{ marginLeft: 10, marginRight: 10 }}>{this.state.des}</Text>
            </View>
          </View>
        </Animated.ScrollView>
        {/* <Animated.View style={{
          width: "100%",
          position: "absolute",
          transform: [{
            translateY: this.headerY
          }],
          flex: 1,
          backgroundColor: 'transparent'
        }}>
          <Header androidStatusBarColor={'#81c784'} style={{ backgroundColor: '#98e59b' }} backgroundColor={'#98e59b'}>
            <Body>
              <Title style={{ color: 'white' }}>
                McDonalds
    </Title>
            </Body>
          </Header>
        </Animated.View> */}
      </Container>


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
