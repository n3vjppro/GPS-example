import React, { Component } from 'react';
import { Container, Content, Icon } from 'native-base';
import { StyleSheet, Text, View, PermissionsAndroid, TouchableOpacity } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import FBSDK, { LoginManager } from 'react-native-fbsdk';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login'
//var { FBLogin, FBLoginManager } = require('react-native-facebook-login');
const {
    LoginButton,
    AccessToken
} = FBSDK;

export default class BookTab extends Component {
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => {
            return <Icon name="settings" style={{ color: tintColor }} />
        }
    }
    //ios-home-outline, ios-planet-outline, , ios-cart-outline
    render() {
        return (
            <View>
            <TouchableOpacity
                onPress={()=>{
                    FBLoginManager.logOut();
                    this.props.navigation.navigate('Login')}
                }>
                <Text>LOG OUTddd</Text>
            </TouchableOpacity>
            </View>);
    }
}