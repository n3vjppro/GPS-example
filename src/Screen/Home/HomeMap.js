import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import MapView from "react-native-maps";
import FloatingButton from '../../Component/FloatingButton/index';
import MapMarker from '../../Redux/Containers/MapMarkerContainer';
const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;


export default class HomeMap extends React.Component {
    componentDidMount() {
        this.watchId = navigator.geolocation.watchPosition(
            position => {
                this.props.autoLoad(
                    latitude = position.coords.latitude,
                    longitude = position.coords.longitude
                );
            },
            error => alert(error.message),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 10
            }
        );
    }
    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchId);
    }

    render() {
        return (
            <View style={{ flex: 1 }} >
                <MapView
                    style={{
                        ...StyleSheet.absoluteFillObject
                    }}
                    region={{
                        longitude: this.props.longitude,
                        latitude: this.props.latitude,
                        longitudeDelta: 0.012,
                        latitudeDelta: 0.012 * ASPECT_RATIO
                    }}
                    showsUserLocation
                >
                    <MapMarker />
                    <MapView.Polyline
                        coordinates={this.props.directions.coords}
                        strokeWidth={4}
                        strokeColor="#1E90FF"
                    />
                </MapView>
                <FloatingButton
                    icon="list"
                    onPress={() => {
                        this.props.navigation.navigate("HomeList");
                    }}
                />
            </View>
        );
    }
}
