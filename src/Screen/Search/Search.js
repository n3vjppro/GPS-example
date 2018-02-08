import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Keyboard } from 'react-native';

export default class Search extends React.Component {
    render() {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity
                    onPress={() => { this.props.navigation.navigate("LocationDetail") }}
                >
                    <Text>{this.props.textSearch}</Text>
                </TouchableOpacity>

            </View>
        );
    }
}