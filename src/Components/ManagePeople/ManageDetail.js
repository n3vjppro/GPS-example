import React, { Component } from 'react';
import { Animated, StyleSheet, AppState, View, TouchableHighlight, StatusBar, PermissionsAndroid, Dimensions, Image, TouchableWithoutFeedback, TouchableOpacity, AsyncStorage, FlatList } from 'react-native';
import { StackNavigator } from 'react-navigation';
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
    Body, Picker, Form,
    Item, List, Card, CardItem, ActionSheet, Root, Fab
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
import { userId, mainColor } from '../Common/User'
var BUTTONS = ["Yes", "No"];
var CANCEL_INDEX = 1;
var DESTRUCTIVE_INDEX = 1;
const { height, width } = Dimensions.get('window');
let id = 0;
const latitudeDelta = 0.09, longitudeDelta = 0.04;
let addWarning;

import PushNotification from 'react-native-push-notification';



export class ManageDetail extends Component {
    scroll = new Animated.Value(0)
    headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, 56), -1)
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => {
            return <Icon name="ios-locate" style={{ color: tintColor }} />
        },
        header: null
    };

    constructor(props) {
        super(props);
        this.state = {
            addWarning: false,
            listMembers: [],
            markerInfor: '',
            visible: true,
            memLocation: [],
            markers: {
                latitude: 0,
                longitude: 0,
                fullName: '',
                des: '',
                LastUpdate: ''
            },
            memberMarker: [],
            region: {
                latitude: 16.0585026,
                longitude: 108.2199589,
                latitudeDelta,
                longitudeDelta
            },
            radius: 0,
            minute: 0,
            location: '',
            searchVisible: false,
            limitTime: 0,
            status: '',
            jobs: [],
            idGroup: this.props.navigation.state.params.detail.ID,
            verify: false,
            hlButton: 'normal',
            activeFab: false,
            selectedRow: -1
        }
        this.handleAppStateChange = this.handleAppStateChange.bind(this);

    }
    onRegionChange(region) {
        this.setState({
            region: {
                latitude: region.Latitude,
                longitude: region.Longtitude,
                latitudeDelta: 0.002,
                longitudeDelta: 0.002
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
            })
            .catch((error) => {
                //console.log(error);
                this.setState({ visible: false })
            })
    }

    async showMemberLocation(ID, fullName) {
        this.setState({ visible: true })
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

                this.addMarker(responseJson, fullName)
                this.onRegionChange(responseJson)

            })
            .catch((error) => {
                console.log(error);

                this.setState({ visible: false })
            })



    }
    addMemberMarker(coor, locName) {
        console.log(coor, locName)
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
        this.setState({ memLat: coor.lat, memLong: coor.lng, locName: locName })
        const region = {
            Latitude: coor.lat,
            Longtitude: coor.lng
        }
        this.onRegionChange(region)

    }
    addMarker(latlong, fullName) {
        //let now = (new Date).getTime();
        //if (this.state.ladAddedMarker > now - 5000) { return; }
        this.setState({
            markers: {
                //...this.state.markers,
                //     coordinate: region,
                //     key: id++
                // }

                latitude: latlong.Latitude,
                longitude: latlong.Longtitude,
                fullName
            },
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

    async addRadius(userId, groupId, LatitudeDes, LongtitudeDes, Radius, TimeLimit) {
        await fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/LocationDestination', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
            body: JSON.stringify({
                UserId: userId,
                GroupId: groupId,
                LatitudeDes: LatitudeDes,
                LongtitudeDes: LongtitudeDes,
                Radius: Radius,
                TimeLimit: TimeLimit,

            }),

        })
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson, userid,groupId, LatitudeDes)

                if (responseJson.success) {

                    // alert('Done!')

                    //this.refs.myModal.close()
                    // this.handleNotification(Radius, userId, TimeLimit)

                } else alert('Something went wrong!')
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

        console.log(this.state.defaultLat, radius, minute, idUser)

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
        alert('Your circle was set!')


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
    handleAddCircle(ID) {
        this.setState({ idMember: ID })
        this.showMemberLocation(ID)
        //this.props.navigation.navigate("ModalGoogle", { addMemberMarker: this.addMemberMarker.bind(this), openModal: this.props.navigation.state.params.handleModalRadius.bind(this) })
        this._addModal()
    }
    async showActionSheet(radius, idUser, minute) {
        this.setState({ radius: radius, minute: minute })
        try {
            await AsyncStorage.setItem('radius', radius);

            // Error saving data
        } catch (error) {
            // Error saving data
        }
        try {

            await AsyncStorage.setItem('minute', minute);
        } catch (error) {
            // Error saving data
        }

        ActionSheet.show(
            {
                options: BUTTONS,
                cancelButtonIndex: CANCEL_INDEX,
                destructiveButtonIndex: DESTRUCTIVE_INDEX,
                title: "Confirm your Circle"
            },
            buttonIndex => {
                if (buttonIndex === 0) this.handleNotification(radius, idUser, minute)
                if (buttonIndex === 1) this.setState({ radius: 0 })
            }
        )
    }
    render() {

        return (
            <Root>
                <Container style={StyleSheet.absoluteFill}>
                    <Header androidStatusBarColor={mainColor} style={{ backgroundColor: mainColor }}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                                <Icon name="md-menu" />
                            </Button>
                        </Left>
                        <Body><Text style={{ color: 'white' }}>{this.props.navigation.state.params.detail.Name}</Text></Body>
                    </Header>
                    <ModalRadius ref={'ModalRadius'} parentList={this}  ></ModalRadius>



                    <Animated.ScrollView
                        scrollEventThrottle={5}
                        showsVerticalScrollIndicator={false}
                        style={{ zIndex: 0 }}
                        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scroll } } }], { useNativeDriver: true })}>
                        <Animated.View style={{
                            height: height * 0.8,
                            width: '100%',
                            transform: [{ translateY: Animated.multiply(this.scroll, 0.5) }]
                        }}>
                            <MapView style={styles.map}
                                provider="google"
                                //showsUserLocation={true}
                                showsMyLocationButton={true}
                                showsCompass={true}
                                followsUserLocation={true}
                                region={this.state.region}
                            //onRegionChange={this.onRegionChange}
                            >


                                <Marker
                                    coordinate={{ latitude: this.state.markers.latitude, longitude: this.state.markers.longitude }}
                                    key={id++}
                                    pinColor={'blue'}
                                //description={marker.description}
                                >
                                    {/* <MapView.Callout
                                    //tooltip
                                    >
                                        

                                            <View style={{ flexDirection: 'row', }}>
                                                <Text style={{ fontWeight: 'bold', flexWrap: 'wrap' }}>{this.state.markers.des}</Text>
                                            </View>
                                           
                                        
                                    </MapView.Callout> */}
                                </Marker>


                                {this.state.memberMarker.map(marker => (

                                    <Marker
                                        coordinate={{ latitude: marker.lat, longitude: marker.lng }}
                                        key={id += 2}
                                        pinColor={'green'}
                                    //description={marker.description}
                                    >

                                    </Marker>
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

                        </Animated.View>

                        <View style={{ position: 'absolute', height: height * 0.8, width: '100%' }}>
                            <LinearGradient
                                colors={['rgba(245,245,245,0.0)', 'rgba(245,245,245,0.35)', 'rgba(245,245,245,1)']}
                                locations={[0, 0.7, 1]}
                                style={StyleSheet.absoluteFill} />
                        </View>
                        <View style={{
                            transform: [{ translateY: -100 }],
                            width: width,
                            //paddingHorizontal: 30,
                            //paddingVertical: 20,
                            backgroundColor: 'transparent'
                        }}>
                            <View style={{ ...StyleSheet.absoluteFillObject, top: 100, backgroundColor: 'rgb(245,245,245)' }} />

                            <List
                                dataArray={this.state.listMembers}
                                selected={true}
                                button={true}
                                key={id++}
                                renderRow={(item, index) =>

                                    <TouchableOpacity
                                        style={{ width: width }}
                                        onPress={() => {
                                            this.setState({ activeFab: false })
                                            this.setState({ idMember: item.ID, selectedRow: index })
                                            this.showMemberLocation(item.ID, item.FullName, item.LastUpdate)

                                        }}
                                    >
                                        <Card style={{ width: width }}>
                                            <CardItem>
                                                <Left>
                                                    <Image style={{ width: 36, height: 36 }} source={require('../../../assets/icon-user.png')} />
                                                    <Body>
                                                        <Text style={[{ fontWeight: 'bold' }, this.state.selectedRow === index ? { color: 'blue' } : '']} >{item.FullName}</Text>
                                                    </Body>
                                                </Left>
                                                <Right>
                                                    <Button success
                                                        //style={{ marginRight: 30 }}
                                                        onPress={() => {
                                                            const args = {
                                                                number: item.PhoneNumber, // String value with the number to call
                                                                prompt: false // Optional boolean property. Determines if the user should be prompt prior to the call 
                                                            }
                                                            call(args).catch()
                                                        }}
                                                    >
                                                        <Icon name="md-call" />

                                                    </Button>
                                                </Right>
                                            </CardItem>
                                            {/* <CardItem cardBody>
                                                <Body>
                                                    <Text style={{ fontWeight: 'normal', marginLeft: 50 }}  >Phone number: {item.PhoneNumber}</Text>
                                                </Body>
                                                <Right>

                                                </Right>
                                            </CardItem> */}
                                            <CardItem >
                                                {item.ID !== userId ?
                                                    <Body>
                                                        {this.props.navigation.state.params.detail.IsFollow ?
                                                            this.state.listMembers.IsParent ? <Text> </Text> :
                                                                <Button full bordered danger

                                                                    onPress={() => {
                                                                        this.setState({ activeFab: false })
                                                                        this.handleAddCircle(item.ID)
                                                                    }
                                                                    }
                                                                >
                                                                    <Icon name="md-radio-button-on" />
                                                                    <Text>Set your Circle</Text>
                                                                </Button>
                                                            : <Text> </Text>}
                                                    </Body>
                                                    :
                                                    <Left>
                                                        <Icon name='md-person' />
                                                    </Left>}
                                            </CardItem>
                                        </Card>

                                        {/* </Button> */}
                                        {/* <Text>{item.Name}</Text> */}
                                    </TouchableOpacity>

                                }
                            //keyExtractor={(item, index) => index}
                            >
                            </List>

                        </View>
                        {/* <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} /> */}
                    </Animated.ScrollView>
                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />

                </Container>
                <View style={{ flex: 1, marginTop: 50 }}>
                    <Fab
                        active={this.state.activeFab}
                        direction="down"
                        containerStyle={{}}
                        style={{ backgroundColor: '#ffbb33', }}
                        position="topRight"
                        onPress={() => this.setState({ activeFab: !this.state.activeFab })}>
                        <Icon name="md-alert" />

                        <Button style={{ backgroundColor: '#ff8800' }}
                            onPress={() => alert('Are you sure that you need help?')}
                        >
                            <Icon name="md-hand" />
                        </Button>
                        <Button style={{ backgroundColor: 'red' }}
                            onPress={() => alert('Are you sure that you are in danger?')}
                        >
                            <Icon name="ios-warning-outline" />
                        </Button>

                    </Fab></View>
            </Root>
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
        //marginLeft: 5,
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