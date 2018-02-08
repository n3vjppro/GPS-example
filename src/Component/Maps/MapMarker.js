import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import Polyline from "@mapbox/polyline";

export default class MapMarker extends React.Component {

    // Get Distance, duration, and overview_polyline (using Draw Two Point)
    async getDirections(startLoc, destinationLoc) {
        try {
            let resp = await fetch(
                `https://maps.googleapis.com/maps/api/directions/json?origin=${
                startLoc
                }&destination=${destinationLoc}`
            );
            let respJson = await resp.json();
            let points = await Polyline.decode(respJson.routes[0].overview_polyline.points);

            let distanceLocation = await respJson.routes[0].legs[0].distance.text;
            let timeGotoStore = await respJson.routes[0].legs[0].duration.text;
            let coords = await points.map((point, index) => {
                return {
                    latitude: point[0],
                    longitude: point[1]
                };
            });
            await this.props.onFetchDirections({ distanceLocation, timeGotoStore, coords });
        } catch (error) {
            alert(error);
        }
    }

    render() {
        // alert(this.props.latitude);
        imageLocation = require("../../Images/LocationNomal.png");
        return (
            <MapView.Marker
                // key={item.ID_promotion}
                coordinate={{
                    latitude: 16.0538858,
                    longitude: 108.2178565,
                }}
                image={imageLocation}
                onPress={() => {
                    this.getDirections(this.props.latitude + ","
                        + this.props.longitude, "16.0538858,108.2178565");


                }}
            >
                {/* {this.renderViewMapCallout(item)} */}
            </MapView.Marker>
        );
    }
}

