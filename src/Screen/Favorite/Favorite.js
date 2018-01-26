import React from 'react';
import { StyleSheet, Text, View ,TouchableOpacity} from 'react-native';

export default class Favorite extends React.Component {
    render() {
        return (
            <View style={{ flex: 1 }} >
            <TouchableOpacity
                    onPress={()=>{this.props.navigation.navigate("LocationDetail")}}
                >
                    <Text>Favorite.js </Text>
                </TouchableOpacity>
                
            </View>
        );
    }
}