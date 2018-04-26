import React, { Component } from 'react';
import { BackHandler, StyleSheet, AppState, View, PermissionsAndroid, Dimensions, Image, Alert, TouchableWithoutFeedback, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import { StackNavigator } from 'react-navigation';
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
    Body, Picker, Form,
    Item, List, Card, CardItem
} from 'native-base';
import MapView, { Marker } from 'react-native-maps'
import DateTimePicker from 'react-native-modal-datetime-picker';
import haversine from 'haversine';
import Spinner from 'react-native-loading-spinner-overlay';
import Modal from 'react-native-modalbox'
import MapViewDirections from 'react-native-maps-directions'
import call from 'react-native-phone-call'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import geolib from 'geolib'
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from "react-native-fcm";
import { userId, mainColor } from '../Common/User'



const { height, width } = Dimensions.get('window');
let id = 0;
const latitudeDelta = 0.0922, longitudeDelta = 0.0421;


import PushNotification from 'react-native-push-notification';



export default class ShareDetail extends Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => {
            return <Icon name="ios-locate" style={{ color: tintColor }} />
        },
        header: null
    };

    constructor(props) {
        super(props);

        this.state = {
            listMembers: [],
            markerInfor: '',
            visible: true,
            memLocation: [],
            markers: [],
            memberMarker: [],
            region: {
                latitude: 16.0585026,
                longitude: 108.2199589,
                latitudeDelta,
                longitudeDelta
            },
            location: '',
            bgColor: [
                'red',
                'blue',
                'yellow',
                'green',
                'violet',
                'purple',
                'pink',
                'orange',
                'monochrome',
                'Aqua',
            ],

        }
        let watchLoc = navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    origin: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                })
                console.log(this.state.origin)
            },
            (error) => console.log(error),
            { enableHighAccuracy: true, timeout: 2000 }
        )

    }
    onRegionChange(region) {
        this.setState({
            region: {
                latitude: region[0].Latitude,
                longitude: region[0].Longtitude,
                latitudeDelta,
                longitudeDelta
            }
        });
        //console.log(region)
    }

    _getRandomColor() {
        var item = this.state.bgColor[Math.floor(Math.random() * this.state.bgColor.length)];
        return item
    }

    getListMember(idGroup) {
        this.setState({ visible: true })
        var d = new Date();
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        var n = new Date(d - tzoffset).toISOString().slice(0, 19).replace('T', ' ');

        fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location/GetCurrentLocationGroup/' + idGroup, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ listMembers: responseJson.gr, visible: false })
                //console.log(this.state.listMembers)

            })
            .catch((error) => {
                //console.log(error);
                this.setState({ visible: false })
            })
    }

    showAllMemberLocation(idGroup) {
        fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location/GetCurrentLocationGroup/' + idGroup, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ markers: responseJson, visible: false })
                //console.log(responseJson)
                this.onRegionChange(responseJson)
                //this.addMarker(responseJson)
            })
            .catch((error) => {
                console.log(error);
                this.setState({ visible: false })
            })



    }
    addMemberMarker(coor) {
        this.setState({
            memberMarker: [
                //...this.state.markers,
                //     coordinate: region,
                //     key: id++
                // }

                coor
            ],
            //ladAddedMarker: now
        });
        //console.log(coor)
        this.setState({ memLat: coor.lat, memLong: coor.lng })

    }
    addMarker(latlong) {
        //let now = (new Date).getTime();
        //if (this.state.ladAddedMarker > now - 5000) { return; }
        this.setState({
            markers: [
                //...this.state.markers,
                //     coordinate: region,
                //     key: id++
                // }

                latlong
            ],
            //ladAddedMarker: now

        });

        console.log(this.state.markers)
    }
    async markerClick(latitude, longitude) {

        let latlng = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=true&key=AIzaSyBAKmIRhHy16oixr-Suxus0p7fkZqs2e7w"
        await fetch(latlng).then((response) => response.json())
            .then((responseJson) => {
                this.setState({ markerInfor: responseJson.results[0].formatted_address })
                console.log(this.state.markerInfor)
            })
            .catch((error) => {
                console.log(error);
            })
    }
    showLocalNotification(notif) {
        FCM.presentLocalNotification({
            title: 'My GPS',
            body: notif.fcm.body,
            priority: "high",
            click_action: 'Detail',
            show_in_foreground: true,
            local: true
        });
    }
    async componentDidMount() {

        this._getRandomColor();
        //console.log(this.props.navigation.state.params.detail.ID)
        this.getListMember(this.props.navigation.state.params.detail.ID);
        this.showAllMemberLocation(this.props.navigation.state.params.detail.ID)

        PushNotification.configure({
            // (required) Called when a remote or local notification is opened or received
            onNotification: function (notification) {
                console.log('NOTIFICATION:', notification);

            },
            // Should the initial notification be popped automatically
            // default: true
            popInitialNotification: true,

            /**
              * (optional) default: true
              * - Specified if permissions (ios) and token (android and ios) will requested or not,
              * - if not, you must call PushNotificationsHandler.requestPermissions() later
              */
            requestPermissions: true,
        });


    }

    handleNotification(radius, idUser, minute) {
        console.log(this.state.defaultLat, radius, minute)
        this.setState({ radius: radius })

    }


    handleAppStateChange(radius, idUser, minute, appState) {

        if (appState === 'background') {
            console.log('app background')


            return <PushNotification />
        }
    }


    render() {
        BackHandler.addEventListener('hardwareBackPress', function () {
            // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
            // Typically you would use the navigator here to go to the last state.
            if (!this) {
                this.props.navigation.navigate('IndexShare')
                return true;
            }
            return false;
        }
        );
        return (
            <Container style={{ flex: 1 }}>
                <Header androidStatusBarColor={mainColor} style={{ backgroundColor: mainColor }} >
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                            <Icon name="md-menu" />
                        </Button>
                    </Left>
                    <Body><Text style={{ color: 'white' }}>{this.props.navigation.state.params.detail.Name}</Text></Body>
                    <Right>
                        <Button transparent
                            onPress={() => {
                                Alert.alert(
                                    'Location Sharing ',
                                    'Are you sure to share your location to this group?',
                                    [
                                        { text: 'Cancel', onPress: () => { }, style: 'cancel' },
                                        {
                                            text: 'OK', onPress: () => {

                                                fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/notification', {
                                                    method: 'POST',
                                                    headers: {
                                                        Accept: 'application/json',
                                                        'Content-Type': 'application/json',
                                                        'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
                                                    },
                                                    body: JSON.stringify({
                                                        userId: userId,
                                                        message: "I am here",
                                                        groupId: this.props.navigation.state.params.detail.ID

                                                    }),

                                                })
                                                    .then((response) => response.json())
                                                    .then((responseJson) => {
                                                        alert("Share success!")
                                                        //console.log(responseJson)
                                                    })
                                                    .catch((error) => {

                                                        console.log(error);
                                                    })
                                            }
                                        },
                                    ],
                                    { cancelable: true }
                                )

                            }}
                        >
                            <Icon style={{ width: 30, height: 30 }} name='md-share-alt' />
                        </Button>
                    </Right>
                </Header>
                <Container style={{ flex: 1 }} >
                    <MapView.Animated style={StyleSheet.absoluteFill}
                        provider="google"
                        showsUserLocation={true}
                        showsMyLocationButton={true}
                        showsCompass={true}
                        followsUserLocation={true}
                        region={this.state.region}
                    //onRegionChange={this.onRegionChange}
                    >
                        <MapViewDirections
                            strokeWidth={3}
                            strokeColor="blue"
                            origin={this.state.origin}
                            destination={this.state.destination}
                            apikey='AIzaSyC9vBvydW5J7JJsnQS_do_tKmLlzdCHA4k'
                        />
                        {this.state.markers.map !== undefined ? this.state.markers.map(marker => (
                            <MapView.Marker
                                coordinate={{
                                    latitude: marker.Latitude,
                                    longitude: marker.Longtitude,
                                }}
                                key={marker.UserId}
                                pinColor={'red'}
                            // description={marker.description}
                            // onCalloutPress={() => {
                            //      this.markerClick(marker.Latitude, marker.Longtitude)
                            // }
                            //}
                            >
                                <MapView.Callout
                                //tooltip
                                >
                                    <View >
                                        <Text style={{ fontWeight: 'bold' }} >{marker.FullName}</Text>
                                        <View style={{ flexDirection: 'row' }}><Text style={{ flexWrap: 'wrap' }} >{marker.Description}</Text></View>
                                        <Text >Last update: {marker.LastUpdate.slice(0, 19).replace('T', ' ')}</Text>

                                    </View>
                                </MapView.Callout>
                            </MapView.Marker>
                        )) : <Text></Text>}

                        {/* {this.state.markers.map(marker => (

                            <Marker
                                coordinate={{ latitude: marker.Latitude, longitude: marker.Longtitude }}
                                key={id++}
                                description={marker.description}
                            />
                        ))}

                        {this.state.memberMarker.map(marker => (

                            <Marker
                                coordinate={{ latitude: marker.lat, longitude: marker.lng }}
                                key={id += 2}
                            //description={marker.description}
                            />
                        ))}

                        {this.state.memberMarker.map(marker => (

                            <MapView.Circle
                                center={{ latitude: marker.lat, longitude: marker.lng }}
                                radius={this.state.radius}
                                strokeColor='purple'
                                fillColor="rgba(13,100,45,0.3)"
                                key={id++}
                            />
                        ))} */}

                        {/* <MapView.Maker onPress={() => {this.setState({selectedMarker: markerId})}} /> */}
                    </MapView.Animated>

                    {/* </View> */}
                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />

                </Container>

                <List
                    dataArray={this.state.markers}
                    //numColumns={1}
                    key={id++}
                    button={true}

                    renderRow={(item) =>

                        <TouchableOpacity
                            onPress={() => this.setState({
                                region: {
                                    latitude: item.Latitude,
                                    longitude: item.Longtitude,
                                    latitudeDelta,
                                    longitudeDelta
                                }
                            })}>
                            <Card>
                                <CardItem>
                                    <Left>
                                        <Image style={{ width: 36, height: 36 }} source={require('../../../assets/icon-user.png')} />

                                        <Body>
                                            <Text  >{item.FullName}</Text>
                                            <Text  >Description: {item.Description}</Text>
                                        </Body>
                                    </Left>

                                </CardItem>

                                <CardItem>

                                    {parseInt(item.Battery) > 20 ?
                                        <Left>
                                            <Icon name='ios-battery-full' style={{ color: 'green' }} />
                                            <Text>{item.Battery}%</Text></Left>
                                        :
                                        <Left>
                                            <Icon name='ios-battery-dead' style={{ color: 'red' }} />
                                            <Text>{item.Battery}%</Text></Left>

                                    }
                                    <Right>
                                        {item.UserId !== userId ? <Button iconLeft bordered
                                            style={{ borderColor: mainColor }}
                                            onPress={() => {
                                                this.setState({
                                                    destination: {
                                                        latitude: item.Latitude,
                                                        longitude: item.Longtitude
                                                    }
                                                })
                                                console.log(this.state.destination)
                                            }}
                                        >
                                            <Image style={{ width: 24, height: 24, tintColor: mainColor, marginLeft: 5 }} source={require('../../../assets/direction.png')} />
                                            <Text style={{ color: mainColor }}>Direction</Text>
                                        </Button> : <Text style={{ fontWeight: 'bold', marginLeft: 30 }}>It's you.</Text>}
                                    </Right>
                                </CardItem>
                            </Card>
                        </TouchableOpacity>
                    }
                //keyExtractor={(item, index) => index}
                >
                </List>



            </Container >
        );
    }
}
const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject, padding: 1, marginLeft: 1, top: 0, left: 0, right: 0, bottom: -25,
        //marginTop:50,

    },
    reLoadMap: {

        top: 0,
        left: 0,
        margin: 5,
        width: 50,

    },
    flatListItemTitle: {
        height: 35,
        color: 'white',
        padding: 3,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 5,
        width: width / 3
    },

    flatListItemDetail: {
        color: 'white',
        padding: 3,
        fontSize: 14,
        width: width / 3
    }
})

