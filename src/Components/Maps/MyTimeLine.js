import React, { Component } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, TouchableOpacity, AsyncStorage } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Icon } from 'native-base'
import MapView from 'react-native-maps'

import haversine from 'haversine';


export default class MyTimeLine extends Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => {
            return <Icon name="map" style={{ color: tintColor }} />
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

        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude })
                console.log(position);
                alert('lat: ' + position.coords.latitude + ' long: ' + position.coords.longitude)
            },
            (error) => console.log(new Date(), error),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
        );
    }
    getLocation(userid, latitude, longitude, LastUpdate) {
        var d = new Date();
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        var n = new Date(d - tzoffset).toISOString().slice(0, 19).replace('T', ' ');
        console.log('fetch', n)
        fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location/user/2', {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {

                console.log(responseJson)

                this.setState({ markers: responseJson })
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
    markerClick(latitude, longitude){

        let latlng="https://maps.googleapis.com/maps/api/geocode/json?latlng="+latitude+","+longitude+"&key=AIzaSyC9vBvydW5J7JJsnQS_do_tKmLlzdCHA4k"

        fetch(latlng)
            .then((response) => response.json())
            .then((responseJson) => {

                alert(responseJson[0].formatted_address)

                //this.setState({ markers: responseJson })
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
            })

    }

    componentDidMount() {
        this.getLocation()
    }

    render() {
        return (
            <View style={{ flex: 1 }}>

                <MapView style={styles.map}
                    provider="google"
                    showsUserLocation={true}
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
                            
                            onCalloutPress={this.markerClick(marker.Latitude, marker.Longtitude)}>
                            <MapView.Callout >
                                <View >
                                    <Text>{marker.LastUpdate}</Text>
                                </View>
                            </MapView.Callout>
                        </MapView.Marker>
                    ))}

                </MapView>

                <View style={{ alignItems: 'flex-end', }}>
                    <TouchableOpacity
                        style={styles.reLoadMap}
                        onPress={() => this.getLocation()}>
                        <Text>Reload</Text>
                    </TouchableOpacity>
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
    reLoadMap: {
        borderRadius: 4,
        backgroundColor: '#f4511e',
        padding: 20,
        bottom: 0,
        margin: 5,
    }
})