import React from 'react';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import MapView from "react-native-maps";
import FloatingButton from '../../Component/FloatingButton/index';


export default class HomeMap extends React.Component {
    render() {
        return (
            <View style={{ flex: 1 }} >
                <MapView
                    style={{
                        ...StyleSheet.absoluteFillObject
                    }}
                    region={{
                        longitude:108.2086976,
                        latitude:16.0598937,
                        longitudeDelta:0.018,
                        latitudeDelta: 0.018
                    }}
                >
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
