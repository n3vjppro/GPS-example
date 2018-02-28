import React from 'react';
import {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ScrollView,
    Animated,
    Image,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { Icon } from 'native-base';
import MapView from "react-native-maps";
import FloatingButton from '../../Component/FloatingButton/index';
import MapMarker from '../../Redux/Containers/MapMarkerContainer';

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;

export default class HomeMap extends React.Component {
    constructor() {
        super()
        this.mapRef = null;
    }
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
                    ref={(ref) => { this.mapRef = ref }}
                    style={{
                        ...StyleSheet.absoluteFillObject
                    }}
                    showsUserLocation
                    onLayout={()=> this.mapRef.fitToElements(true)}
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
