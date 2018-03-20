import React, { Component } from 'react';
import { StyleSheet,  View, PermissionsAndroid, TouchableOpacity, AsyncStorage } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Icon, Button,Text } from 'native-base'
import MapView from 'react-native-maps'
import DateTimePicker from 'react-native-modal-datetime-picker';
import haversine from 'haversine';
import Spinner from 'react-native-loading-spinner-overlay';

export default class MyTimeLine extends Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => {
            return <Icon name="ios-locate" style={{ color: tintColor }} />
        },
        header: null
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
            visible: true
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
                console.log(this.state.markers)
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
        let dayApi = "http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location?id=2&&day=" + bd;
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

    componentDidMount() {
        this.getLocation()
    }
    render() {
        return (
            <View style={{ flex: 1 }}>

                <MapView style={styles.map}
                    provider="google"
                    //showsUserLocation={true}
                    showsMyLocationButton={true}
                    showsCompass={true}
                    followsUserLocation={true}
                    initialRegion={{
                        latitude: 16.0585026,
                        longitude: 108.2199589,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >
                    {this.state.markers.map(marker => (
                        <MapView.Marker
                            coordinate={{
                                latitude: marker.Latitude,
                                longitude: marker.Longtitude
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
                    ))}
                </MapView>

                <View style={{ alignItems: 'flex-end', }}>
                    {/* <TouchableOpacity
                        style={styles.reLoadMap}
                        onPress={() => this.getLocation()}>
                        <Text>Reload</Text>
                    </TouchableOpacity> */}
                    <Button rounded  danger
                        style={styles.reLoadMap}
                        onPress={() => this.getLocation()}
                    >
                        <Text>Reload</Text>
                    </Button>
                </View>
                <View style={{ alignItems: 'flex-end', }}>
                    {/* <TouchableOpacity
                        style={styles.reLoadMap}
                        onPress={this._showDateTimePicker}>
                        <Text>Timeline</Text>
                    </TouchableOpacity> */}
                    <Button rounded danger
                        style={styles.reLoadMap}
                        onPress={this._showDateTimePicker}
                    >
                        <Text >Timeline</Text>
                    </Button>
                </View>
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    maximumDate={Date.now()}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
            </View >
        );
    }
}
const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject, padding: 1, marginLeft:1
        //marginTop:50,
    },
    reLoadMap: {
        justifyContent:'center',
        alignItems:'center',
        padding: 20,
        bottom: 0,
        margin: 5,
        width: 140
    }
})