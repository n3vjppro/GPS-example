import React, { Component } from 'react';
import { StyleSheet, AppState, View, PermissionsAndroid, Dimensions, Image, TouchableWithoutFeedback, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
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
        navigator.geolocation.getCurrentPosition(
            (position) => {
                //this.setState({latitude:position.coords.latitude, longitude:position.coords.longitude})
                //console.log(position);
                this.setState({
                    origin: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    }
                })
            },
            (error) => console.log(new Date(), error),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
        );

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
                console.log(this.state.markers)
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

    componentDidMount() {
        this._getRandomColor();
        this.getListMember(this.props.navigation.state.params.detail.ID);
        this.showAllMemberLocation(2)

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
        //this.setState({radius:radius})
        // geolib.isPointInCircle(
        //     { latitude: this.state.memLat, longitude: this.state.memLong },
        //     { latitude: this.state.defaultLat, longitude: this.state.defaultLng }, radius
        // ) ? alert('true') : alert('false')
        // this.handleAppStateChange()


        //this.showMemberLocation(idUser);



        // BackgroundJob.register({
        //     jobKey: "myJob",
        //     job: () => {
        //         let status;
        //         this.showMemberLocation(idUser);
        //         if (geolib.isPointInCircle(
        //             { latitude: this.state.memLat, longitude: this.state.memLong },
        //             { latitude: this.state.defaultLat, longitude: this.state.defaultLng }, this.state.radius
        //         ))
        //         // PushNotification.localNotification({
        //         //     id: idUser,
        //         //     message:
        //         //         'In side'
        //         //     , // (required)
        //         //     // in 60 secs, // set Date TIme,
        //         //     autoCancel: true,

        //         // });
        //         status='in'

        //         else
        //         // PushNotification.localNotification({
        //         //     id: idUser,
        //         //     message:
        //         //         'Out side'
        //         //     , // (required)
        //         //     // in 60 secs, // set Date TIme,
        //         //     autoCancel: true,

        //         // });
        //         status='out'
        //        // console.log(this.state.status)

        //        PushNotification.localNotificationSchedule({
        //             id: idUser,
        //             message:
        //                status
        //             , // (required)
        //             date: new Date(Date.now() + (minute*60000)),
        //             // in 60 secs, // set Date TIme,
        //             autoCancel: true,

        //         });
        //     }
        // });
        // BackgroundJob.schedule({
        //     jobKey: "myJob",
        //     period: 3000,
        //     allowExecutionInForeground: true,
        //     allowWhileIdle :true,

        // });
    }


    handleAppStateChange(radius, idUser, minute, appState) {

        if (appState === 'background') {
            console.log('app background')


            return <PushNotification />
        }
    }


    render() {
        return (
            <Container style={{ flex: 1 }}>
                <Header  >
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                            <Icon name="md-menu" />
                        </Button>
                    </Left>
                    <Body><Text style={{ color: 'white' }}>{this.props.navigation.state.params.detail.Name}</Text></Body>
                   
                </Header>
                <Card style={{ flex: 2 }} >
                    <MapView style={styles.map}
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
                        {this.state.markers.map(marker => (
                            <MapView.Marker
                                coordinate={{
                                    latitude: marker.Latitude,
                                    longitude: marker.Longtitude,
                                }}
                                key={marker.UserId}
                                pinColor={this._getRandomColor()}
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
                                        <Text >{marker.Description}</Text>
                                        <Text >Last update: {marker.LastUpdate}</Text>
                                        <Text >Battery: {marker.Battery}%</Text>

                                    </View>
                                </MapView.Callout>
                            </MapView.Marker>
                        ))}

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
                    </MapView>

                    {/* </View> */}
                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />

                </Card>
                <Card style={{ flex: 1 }}>
                    <List
                        dataArray={this.state.markers}
                        //numColumns={1}
                        button={true}
                        renderRow={(item) =>

                            <ListItem avatar
                            >
                            <Card>
                            <CardItem>
                                <Left>
                                    <Icon name='ios-person' />
                                
                                <Body>
                                    <Text  >{item.FullName}</Text>
                                    <Text  >Description: {item.Description}</Text>
                                </Body>
                               </Left>
                                
                                </CardItem>
                                
                                    <CardItem>
                                        <Left>
                                        {parseInt(item.Battery) > 20 ?
                                            <Button iconLeft success>
                                                <Icon name='ios-battery-full' />
                                                <Text>{item.Battery}%</Text>
                                            </Button> :
                                            <Button iconLeft danger>
                                                <Icon name='ios-battery-dead' />
                                                <Text>{item.Battery}%</Text>
                                            </Button>
                                        }
                                        </Left>
                                        <Body>
                                        <Button transparent
                                           
                                            onPress={() => {
                                                this.setState({
                                                    destination: {
                                                        latitude: item.Latitude,
                                                        longitude: item.Longtitude
                                                    }
                                                })
                                            }}
                                        >
                                            <Image style={{ width: 48, height: 48 }} source={require('../../../assets/direction.png')} />
                                        </Button>
                                        </Body>
                                        <Right>
                                        <Button info iconLeft
                                           
                                            onPress={() => {
                                                this.setState({
                                                    destination: {
                                                        latitude: item.Latitude,
                                                        longitude: item.Longtitude
                                                    }
                                                })
                                            }}
                                        >
                                            <Icon name="ios-share-alt" />
                                            <Text>Share</Text>
                                        </Button>
                                        </Right>
                                    </CardItem>
                                    </Card>
                                {/* </Button> */}
                                {/* <Text>{item.Name}</Text> */}
                            </ListItem>
                        }
                    //keyExtractor={(item, index) => index}
                    >
                    </List>
                </Card>


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

