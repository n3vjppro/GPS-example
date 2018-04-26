import React, { Component, PureComponent } from 'react';
import { BackHandler, Animated, StyleSheet, View, PermissionsAndroid, Image, TouchableOpacity, StatusBar, NativeModules, AsyncStorage, Promise, Dimensions, Alert } from 'react-native';
import { StackNavigator, NavigationActions } from 'react-navigation';
import MapView from 'react-native-maps'
import VirtualLocation from './VirtualLocation'
import haversine from 'haversine';
import DeviceBattery from 'react-native-device-battery';
import LinearGradient from 'react-native-linear-gradient'
import { userId, mainColor } from '../Common/User'
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
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
  Item, Card, CardItem
} from 'native-base';
import FireBase from '../FireBase'
const { height: screenHeight, width: screenWidth } = Dimensions.get('window')
let id = 0; latitude = 0; longitude = 0;

let state = {
  distance: 0,
  speed: 0.00,
  direction: '',
  startedAt: ''
}
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from "react-native-fcm";


export default class DisplayMap extends PureComponent {
  scroll = new Animated.Value(0)
  headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, 56), -1)

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => {
      return <Icon name="map" style={{ color: tintColor }} />
    },
    title: 'Tracking Me',


  };

  async componentDidMount() {

    FCM.requestPermissions();

    await FCM.getFCMToken().then(token => {

      fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/FCM', {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
        },
        body: JSON.stringify({
          userId: userId,
          token: token,

        }),

      })
        .then((response) => response.json())
        .then((responseJson) => {

          console.log(responseJson)
        })
        .catch((error) => {

          console.log(error);
        })
    });
    FCM.subscribeToTopic('mes-annonces');
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      if (notif.opened_from_tray) {
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({
            routeName: 'ShareDetail',
            params: {
              detail:
                {
                  ID: 11,
                  IsFollow: true,
                  Name: "OldFriends",
                  PassCode: "873714",
                }
            },

          })]
        });
        this.props.navigation.dispatch(resetAction);

        alert('open from tray')
      }
      else if (notif.local_notification) {
        // this.props.navigation.navigate('ShareDetail',
        //   {
        //     detail:
        //       {
        //         ID: 11,
        //         IsFollow: true,
        //         Name: "OldFriends",
        //         PassCode: "873714",
        //       }
        //   })
        const resetAction = NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({
            routeName: 'ShareDetail',
            params: {
              detail:
                {
                  ID: 11,
                  IsFollow: true,
                  Name: "OldFriends",
                  PassCode: "873714",
                }
            },

          })]
        });
        this.props.navigation.dispatch(resetAction);
        alert('notify')

      }
      else {
        //to do
      }

      this.showLocalNotification(notif);
    });

    FCM.on(FCMEvent.RefreshToken, token => {
      console.log(token);
    })


    const nDay = new Date();
    this.setState({ nowTime: nDay.getHours() + ":" + nDay.getMinutes() });
    
    DeviceBattery.getBatteryLevel().then(level => {
      this.setState({ battery: level }) // between 0 and 1
    }).catch(reject => console.log(reject))



  }
  showLocalNotification(notif) {
    FCM.presentLocalNotification({
      title: 'My GPS',
      body: notif.fcm.body,
      priority: "high",
      click_action: 's',
      show_in_foreground: true,
      local: true
    });
  }
  componentWillUnmount() {
    BackgroundGeolocation.events.forEach(event => BackgroundGeolocation.removeAllListeners(event));
  }
  constructor(props) {
    super(props);
    this.state = state;
    BackgroundGeolocation.configure({
      desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
      stationaryRadius: 50,
      distanceFilter: 30,
      notificationTitle: 'My-GPS location',
      notificationText: 'Working',
      debug: true,
      startOnBoot: false,
      stopOnTerminate: false,
      locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
      interval: 60000,
      fastestInterval: 15000,
      activitiesInterval: 30000,
      stopOnStillActivity: false,
      url: 'http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location',
      httpHeaders: {
        'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
      },
      // customize post properties
      postTemplate: {
        latitude:'@latitude',
        longtitude: '@longitude',
      }
    });

    BackgroundGeolocation.on('location', (location) => {
      console.log(location);
      latitude = location.latitude,
        longitude = location.longitude
      this.setState({
        latitude: location.latitude,
        longitude: location.longitude
      })
      this.setState({
        marker1:
          {
            latitude: location.latitude,
            longitude: location.longitude
          }
      })
      if (location !== null) this.onRegionChange(location)
      let distance = 0;
      if (this.state.preCoords) {
        distance = this.state.distance + haversine(this.state.preCoords, location, { unit: 'meter' }),
          this.setState({ distance: distance })
      }

      let x = location.bearing;
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
      //this.postLocation(userId, position.coords.latitude, position.coords.longitude, position.timestamp);

      this.setState({
        markers: [
          ...this.state.markers, {
            coordinate: location,
            key: id++
          }
        ],
        preCoords: location,
        distance

      }, null, { distanceFiler: 5 }
      ),
        this.setState({
          latitude: location.latitude,
          longitude: location.longitude,
          speed: location.speed

        })
      this.postLocation(userId, location.latitude, location.longitude, location.time);
    });
   

    BackgroundGeolocation.start();

    this.state = { markers: [] }

  }

  async getCurLocation() {
    await AsyncStorage.getItem('latitude').then(latitude => latitude = latitude).catch(reject => console.log(reject));
    await AsyncStorage.getItem('longitude').then(longitude => longitude).catch(reject => console.log(reject));;
    this.setState({
      region: {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01
      }
    })
  }
  async postLocation(userid, latitude, longitude, LastUpdate) {
    var d = new Date();
    var tzoffset = (new Date()).getTimezoneOffset() * 60000;
    var n = new Date(d - tzoffset).toISOString().slice(0, 19).replace('T', ' ');
    // console.log('fetch', n, latitude, longitude)
    var des = ''



    let latlng = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=true&key=AIzaSyBAKmIRhHy16oixr-Suxus0p7fkZqs2e7w"
    await fetch(latlng).then((response) => response.json())
      .then((responseJson) => {
        this.setState({ des: responseJson.results[0].formatted_address })

      })
      .catch((error) => {

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
        //console.log(n)
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
  componentWillUnmount() {
    state = this.state;
  }
  render() {

    return (
      <Container style={StyleSheet.absoluteFill}>
        <Header androidStatusBarColor={mainColor} style={{ backgroundColor: mainColor }}>
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
            backgroundColor: 'transparent',
            //height:screenHeight*0.3
          }}>
            <View style={{ ...StyleSheet.absoluteFillObject, backgroundColor: 'rgb(245,245,245)' }} />
            <View style={{
              //position:'absolute',       
              flexDirection: 'column',

              //marginBottom:50
              //backgroundColor: 'rgba(255,255,255,0.5)',
              paddingVertical: 5, marginBottom: 5
            }}>
              <Card>
                <CardItem>
                  <Left>
                    <Image source={require('../../../assets/55212.png')} style={{ width: 24, height: 24, tintColor: 'orange' }} />
                    <Text>Distance</Text></Left>
                  <Body>
                    <Text >{this.state.distance > 0 ? parseFloat(this.state.distance).toFixed(2) : '0'} m</Text>
                  </Body>
                </CardItem>
                <CardItem><Left>
                  <Icon active name="ios-speedometer-outline" style={{ color: 'darkblue' }} />
                  <Text>Speed</Text></Left>
                  <Body>
                    <Text >{this.state.speed > 0 ? parseFloat(this.state.speed * 3.6).toFixed(2) : '0'} km/h</Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Left>
                    <Icon active name="ios-navigate-outline" style={{ color: 'purple' }} />
                    <Text>Direct</Text></Left>
                  <Body>
                    <Text >{this.state.direction === '' ? 'N/A' : this.state.direction} </Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Left>
                    <Icon active name="md-time" style={{ color: 'green' }} />
                    <Text>Started At</Text></Left>
                  <Body>
                    <Text >{this.state.nowTime}h</Text>
                  </Body>
                </CardItem>
                <CardItem>
                  <Text >{this.state.des}</Text>
                </CardItem>
              </Card>
            </View>
          </View>
        </Animated.ScrollView>
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
    color: '#666',
    fontSize: 18,
  },
  detailText: {
    textAlign: 'center',
    fontWeight: '200',
    color: '#666', fontSize: 18,
  }
})
