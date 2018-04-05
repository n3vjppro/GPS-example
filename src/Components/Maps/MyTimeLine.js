import React, { Component } from 'react';
import { StyleSheet, View, PermissionsAndroid, TouchableOpacity, Image, AsyncStorage } from 'react-native';
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
    Body,
    Item
} from 'native-base';
import MapView from 'react-native-maps'
import DateTimePicker from 'react-native-modal-datetime-picker';
import haversine from 'haversine';
import Spinner from 'react-native-loading-spinner-overlay';
let id = 1;
export default class MyTimeLine extends Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => {
            return <Image source={require('../../../assets/loc-his.png')} style={{ width: 24, height: 24, tintColor: tintColor }} />
        },
        title: 'My Timeline'

    };

    constructor(props) {
        super(props);
        this.state = {
            listLoctions: [],
            // markers:[{coordinate:{
            //     latitude,
            //     longitude
            // }}]
            markers: [],
            markerInfor: '',
            visible: true,
        }

        // navigator.geolocation.getCurrentPosition(
        //     (position) => {
        //         this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        //         console.log(position);
        //         alert('lat: ' + position.coords.latitude + ' long: ' + position.coords.longitude)
        //     },
        //     (error) => console.log(new Date(), error),
        //     { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
        // );
    }
    getLocation(userid, latitude, longitude, LastUpdate) {
        this.setState({ visible: true })
        var d = new Date();
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        var n = new Date(d - tzoffset).toISOString().slice(0, 19).replace('T', ' ');
        console.log('fetch', n)
        fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location?id=2&&day=' + n, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log(responseJson)

                this.setState({ markers: responseJson, visible: false })
                if (responseJson !== null) this.onRegionChange(responseJson)
                // markers = responseJson
                // let id = 0
                // responseJson.forEach(element => {

                //     this.setState({
                //         markers: [{

                //                 coordinates: {
                //                     latitude: element.Latitude,
                //                     longitude: element.Longitude
                //                 }

                //         }],
                //         //ladAddedMarker: now
                //     });
                // },
                console.log(responseJson)
                // );



            })
            .catch((error) => {

                console.log(error);
                this.setState({ visible: false })
            })

    }
    async addMarker(region) {
        //let now = (new Date).getTime();
        //if (this.state.ladAddedMarker > now - 5000) { return; }
        this.setState({
            markers: [
                ...this.state.markers, {
                    coordinate: region,
                }
            ],
            //ladAddedMarker: now
        });


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

    //Date time picker
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({ markers: [] })
        var month = date.getMonth() + 1;
        var bd = month + "/" + date.getDate() + "/" + date.getFullYear();
        console.log(bd)
        let dayApi = "http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location?id=3&&day=" + bd;
        //this.setState({ textBirthDay: bd })
        //console.log('A date has been picked: ', this.state.textBirthDay);
        this.setState({ visible: true })
        this._hideDateTimePicker();
        fetch(dayApi, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                //this.setState({ markerInfor: responseJson.results[0].formatted_address })
                this.setState({ markers: responseJson })
                this.setState({ visible: false })
            })
            .catch((error) => {
                console.log(error);
                this.setState({ visible: false })
            })
    };
    onRegionChange(region) {

        this.setState({
            region: {

                latitude: region[0].Latitude,
                longitude: region[0].Longtitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,

            }
        })
    }
    componentDidMount() {
        this.getLocation()
        // this.onRegionChange()

    }
    getInitialState() {
        return {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
             <DateTimePicker
                        isVisible={this.state.isDateTimePickerVisible}
                        maximumDate={new Date()}
                        onConfirm={this._handleDatePicked}
                        onCancel={this._hideDateTimePicker}
                    />
                <Container style={{ flex: 1 }} >
                    <Header>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                                <Icon name="md-menu" />
                            </Button>
                        </Left>
                        <Body><Text style={{ color: 'white' }}>My Timeline</Text></Body>
                        <Right>
                            {/* <Button
                                bordered dark
                                style={styles.reLoadMap}
                                onPress={() => this.getLocation()}
                            >
                                <Icon name="md-refresh" />
                                
                           /> */}
                            <Button
                                transparent
                                style={styles.reLoadMap}
                                onPress={this._showDateTimePicker}
                            >
                                <Icon name="md-calendar" />
                                {/* <Text >Timeline</Text> */}
                            </Button>
                        </Right>
                    </Header>
                </Container>

                <View style={{ flex: 10 }} >
                    <MapView style={styles.map}
                        provider="google"
                        //showsUserLocation={true}
                        showsMyLocationButton={true}
                        showsCompass={true}
                        followsUserLocation={true}
                        region={this.state.region}
                    // onRegionChange={this.onRegionChange}
                    >
                        {this.state.markers.map(marker => (
                            <MapView.Marker
                                coordinate={{
                                    latitude: marker.Latitude,
                                    longitude: marker.Longtitude
                                }}
                                key={id++}
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
                        ))}
                    </MapView>
                    <View style={{ flex: 1 }}>
                        {/* <TouchableOpacity
                        style={styles.reLoadMap}
                        onPress={this._showDateTimePicker}>
                        <Text>Timeline</Text>
                    </TouchableOpacity> */}

                    </View>
                   
                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
                </View>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject, padding: 1, marginLeft: 1, top: 0, left: 0, right: 0, bottom: -25, flex: 1
        //marginTop:50,
    },
    reLoadMap: {

        top: 0,
        left: 0,
        margin: 5,
        width: 50,

    }
})