import React, { Component, PureComponent } from 'react';
import { Animated, StyleSheet, View, PermissionsAndroid, Image, TouchableOpacity, StatusBar, NativeModules, AsyncStorage, Promise, Dimensions } from 'react-native';
import { StackNavigator } from 'react-navigation';
import MapView from 'react-native-maps'
import LinearGradient from 'react-native-linear-gradient'
import { userId, mainColor } from '../Common/User'
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


export default class IndexRecommend extends Component {
    constructor(props) {
        super(props);

        // this.getInitialState()
        // this.state = {
        //   distance: 0,
        //   speed: 0.00,
        //   direction: '',
        // }

    }


    async componentWillMount() {
        watchID = await navigator.geolocation.watchPosition((position) => {
            let region = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                latitudeDelta: 0.00922 * 1.5,
                longitudeDelta: 0.00421 * 1.5
            }

            this.onRegionChange(region, position.coords.accuracy);
        });
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchID);
    }

    onRegionChange(region, gpsAccuracy) {
        //this.fetchVenues(region);

        this.setState({
            mapRegion: region,
            gpsAccuracy: gpsAccuracy || this.state.gpsAccuracy
        });
    }
    render() {
        //const { mapRegion, lookingFor } = this.state;


        return (
            <View style={{ flex: 1 }}>
            {/* //     <MapView.Animated
            //         provider="google"
            //         style={StyleSheet.absoluteFill}
            //         showsUserLocation={true}
            //         showsCompass={true}
            //         showsMyLocationButton={true}
            //         followsUserLocation={true}
            //         region={{
            //             latitude: 16.0585026,
            //             longitude: 108.2199589,
            //             latitudeDelta: 0.09,
            //             longitudeDelta: 0.09
            //         }}
            //         //style={styles.fullscreen}
            //         onRegionChange={this.onRegionChange}>
            //     </MapView.Animated> */}
            <Text>CHUA LAM</Text>
            </View >
        );


    }
}
const styles = StyleSheet.create({
    fullscreen: {
        flex: 1,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    mapHeader: {
        backgroundColor: "rgba(255, 255, 255, .7)",
        paddingTop: 20
    }
});
