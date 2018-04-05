import React, { Component } from 'react';
import { StyleSheet, AppState, View,StatusBar, PermissionsAndroid, Dimensions, Image, TouchableWithoutFeedback, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
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
import ModalRadius from './ModalRadius'
import ModalGoogle from './ModalGoogle'
import call from 'react-native-phone-call'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import geolib from 'geolib'
import BackgroundJob from 'react-native-background-job';


const { height, width } = Dimensions.get('window');
let id = 0;
const latitudeDelta = 0.0922, longitudeDelta = 0.0421;


import PushNotification from 'react-native-push-notification';



export class ManageDetail extends Component {
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
            radius: 0,
            location: '',
            searchVisible: false,
            limitTime: 0,
            status: '',
            jobs: []

        }
        this.handleAppStateChange = this.handleAppStateChange.bind(this);

    }
    onRegionChange(region) {
        this.setState({
            region: {
                latitude: region.Latitude,
                longitude: region.Longtitude,
                latitudeDelta,
                longitudeDelta
            }
        });
       
    }

    getListMember(idGroup) {
        this.setState({ visible: true })
        var d = new Date();
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        var n = new Date(d - tzoffset).toISOString().slice(0, 19).replace('T', ' ');

        fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/GroupTracker/GetALlUserOfGroup/' + idGroup, {
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

    async showMemberLocation(ID) {
        await fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location/GetCurrentLocation/' + ID, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ memLocation: responseJson, visible: false })
               //s console.log(this.state.memLocation)

                this.addMarker(responseJson)
                this.onRegionChange(responseJson)
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
        this.setState({
            defaultLat: latlong.Latitude,
            defaultLng: latlong.Longtitude
        })
        // console.log(latlong)
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
        AppState.addEventListener('change', this.handleAppStateChange);
        this.getListMember(this.props.navigation.state.params.detail.ID);
        this.props.navigation.setParams({
            handleModalRadius: this._addModal.bind(this),
        })

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
    _addModal = () => {
        this.refs.ModalRadius.showModal();
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

        let status;
        //this.showMemberLocation(idUser);
        if (geolib.isPointInCircle(
            { latitude: this.state.memLat, longitude: this.state.memLong },
            { latitude: this.state.defaultLat, longitude: this.state.defaultLng }, this.state.radius
        )) status = 'In side'; else status = 'out side';
        PushNotification.localNotificationSchedule({
            id: idUser,
            message:
                status
            , // (required)
            date: new Date(Date.now() + (minute * 60000)),
            // in 60 secs, // set Date TIme,
            autoCancel: true,

        });


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

    componentWillUnmount() {

        AppState.addEventListener('change', this.handleAppStateChange)
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
                <StatusBar
                    backgroundColor="white"
                    barStyle="dark-content"
                />
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                            <Icon name="md-menu" />
                        </Button>
                    </Left>
                    <Body><Text style={{ color: 'white' }}>{this.props.navigation.state.params.detail.Name}</Text></Body>
                    <Right>
                        <Button transparent
                            onPress={() => {
                                this.props.navigation.navigate("ModalGoogle", { addMemberMarker: this.addMemberMarker.bind(this) })
                            }}>
                            <Icon name="search" />
                        </Button>
                    </Right>
                </Header>
                <Card style={{ flex: 2 }} >
                    <MapView style={styles.map}
                        provider="google"
                        //showsUserLocation={true}
                        showsMyLocationButton={true}
                        showsCompass={true}
                        followsUserLocation={true}
                        region={this.state.region}
                    //onRegionChange={this.onRegionChange}
                    >
                        {/* {this.state.markers.map(marker => (
                            <MapView.Marker
                                coordinate={{
                                    latitude: marker.Latitude,
                                    longitude: marker.Longtitude,
                                }}
                                key={marker.ID}
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
                                        <Text >{marker.LastUpdate}</Text>
                                        <Text style={{ fontWeight: 'bold' }}>{marker.Description}</Text>
                                    </View>
                                </MapView.Callout>
                            </MapView.Marker>
                        ))} */}

                        {this.state.markers.map(marker => (

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
                        ))}

                        {/* <MapView.Maker onPress={() => {this.setState({selectedMarker: markerId})}} /> */}
                    </MapView>
                    {/* <GooglePlacesAutocomplete
                        style={{ flex: 1, marginTop: 10 }}
                        placeholder='Input location here...'
                        minLength={2} // minimum length of text to search
                        autoFocus={false}
                        // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        listViewDisplayed='auto'    // true/false/undefined
                        fetchDetails={true}
                        renderDescription={row => row.description} // custom description render
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true

                            this.addMemberMarker(details.geometry.location)
                            //console.log(this.state.memLat)
                        }}
                        textInputProps={{
                            onChangeText: (text) => { this.setState({ locationName: text }) }
                        }}
                        getDefaultValue={() => ''}

                        query={{
                            // available options: https://developers.google.com/places/web-service/autocomplete
                            key: 'AIzaSyDEqFDbUH-a7q1CPy8pX7QijSOMzwRyySE',
                            language: 'en', // language of the results
                            types: 'geocode' // default: 'geocode'
                        }}

                        styles={{
                            listView: {

                                backgroundColor: 'rgba(0,0,0,0)',

                            },
                            textInputContainer: {
                                backgroundColor: 'rgba(0,0,0,0)',
                                borderTopWidth: 0,
                                borderBottomWidth: 0,
                            },
                            description: {
                                fontWeight: 'bold',
                                color: 'black'
                            },
                            textInput: {
                                marginLeft: 5,
                                marginRight: 5,
                                height: 38,
                                color: '#5d5d5d',
                                fontSize: 16,
                            },
                            predefinedPlacesDescription: {
                                backgroundColor: 'rgba(255,255,255,0.5)',
                                color: '#1faadb'
                            },


                        }}
                        // value={props.location}
                        // onChangeText={props.onLocationChange}

                        nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                        GoogleReverseGeocodingQuery={{
                            // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                        }}
                        GooglePlacesSearchQuery={{
                            // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                            rankby: 'distance',
                            //types: 'food'
                        }}

                        filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                    /> */}
                    {/* </View> */}

                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
                    <ModalRadius ref={'ModalRadius'} parentList={this}  ></ModalRadius>

                </Card>
                <Card style={{ flex: 1 }}>
                    <List
                        dataArray={this.state.listMembers}
                        //numColumns={1}
                        button={true}
                        renderRow={(item) =>

                            <ListItem avatar
                                button={true}
                                onPress={() => {
                                    this.setState({ idMember: item.ID })
                                    this.showMemberLocation(item.ID)
                                    
                                }}
                            >
                                <Left>
                                    <Icon name='ios-person' />
                                </Left>
                                <Body>
                                    <Text  >{item.FullName}</Text>
                                    <Text  >Phone number: {item.PhoneNumber}</Text>
                                </Body>
                                <Right>
                                    <CardItem>
                                        {this.props.navigation.state.params.detail.IsFollow ?
                                            this.state.listMembers.IsParent ? <Text></Text> :
                                                <Button bordered danger
                                                    //style={{ marginRight: 10, alignItems: 'center', justifyContent: 'center' }}
                                                    onPress={() => {
                                                        this.setState({ idGroup: this.props.navigation.state.params.detail.ID })
                                                        this.props.navigation.state.params.handleModalRadius()
                                                    }
                                                    }
                                                >
                                                    <Icon name="md-radio-button-on" />
                                                </Button> : <Text></Text>}


                                        <Button bordered success
                                            style={{ marginLeft: 10 }}
                                            onPress={() => {
                                                const args = {
                                                    number: item.PhoneNumber, // String value with the number to call
                                                    prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
                                                }

                                                call(args).catch(console.error)
                                            }}
                                        >
                                            <Icon name="md-call" />
                                        </Button>
                                    </CardItem>
                                </Right>
                                {/* </Button> */}
                                {/* <Text>{item.Name}</Text> */}
                            </ListItem>
                        }
                    //keyExtractor={(item, index) => index}
                    >
                    </List>
                </Card>
                {/* <View style={{ flex: 4 }}>
                    <FlatList
                        data={this.state.listMembers}
                        numColumns={1}
                        renderItem={({ item, index }) =>
                            <View style={{
                                flex: 1,
                                flexDirection: 'column',
                                backgroundColor: 'mediumseagreen',

                            }}>
                                <TouchableOpacity
                                    onPress={
                                        () => {
                                            this.setState({ idMember: item.ID })
                                            this.showMemberLocation(item.ID)
                                        }
                                    }
                                >
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'row',
                                        justifyContent: 'space-between'
                                    }}>
                                        <Text style={styles.flatListItemTitle}  >{item.FullName}</Text>
                                        <Text style={styles.flatListItemDetail}  >Phone number: {item.PhoneNumber}</Text>
                                        <TouchableOpacity
                                            style={{ marginRight: 10, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => {
                                                this.setState({ idGroup: this.props.navigation.state.params.detail.ID })
                                                this.props.navigation.state.params.handleModalRadius()
                                            }
                                            }
                                        >
                                            <Icon name="md-radio-button-on" />
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={{ marginRight: 10, alignItems: 'center', justifyContent: 'center' }}
                                            onPress={() => {
                                                const args = {
                                                    number: item.PhoneNumber, // String value with the number to call
                                                    prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
                                                }

                                                call(args).catch(console.error)
                                            }}
                                        >
                                            <Icon name="md-call" />
                                        </TouchableOpacity>
                                    </View>
                                    <View style={{
                                        height: 1,
                                        backgroundColor: 'white'
                                    }}>
                                    </View>
                                </TouchableOpacity>


                            </View>



                        }
                        keyExtractor={(item, index) => index}
                    >
                    </FlatList>

                </View> */}

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

export default geoStack = StackNavigator({
    ManageDetail: {
        screen: ManageDetail
    },
    ModalGoogle: {
        screen: ModalGoogle
    }
})