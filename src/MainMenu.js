import React, { Component } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid,Platform } from 'react-native';
import { TabNavigator } from 'react-navigation';
import { Icon } from 'native-base';
import DisplayMap from '../src/Components/Maps/DisplayMap'
import SettingTab from '../src/Components/Setting/SettingTab'
import MyTimeLine from '../src/Components/Maps/MyTimeLine'

export  class MainMenu extends Component {
    static navigationOptions = {
        headerLeft: <Icon
            name={Platform.OS === 'ios' ? 'ios-basket' : 'md-basket'}
            style={{ paddingLeft: 10 }} />,
        title: "My GPS",
        headerRight: <Icon
            name={Platform.OS === 'ios' ?
                'ios-compass' : 'md-compass'}
            style={{ paddingRight: 10 }} />
    }
    render() {
        return <MainNavigator>
            <Text>My main Screen</Text>
        </MainNavigator>;
    }
        
}

export default MainNavigator = TabNavigator({
    DisplayMapTab: {
        screen: DisplayMap
    },
    MyTimeLine:{
        screen: MyTimeLine
    },
    SettingTab: {
        screen: SettingTab
    },
    
}, {
        animationEnabled: true,
        swipeEnabled: true,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            showIcon: true,
            showLabel: false,
            style: {
                backgroundColor: 'white',
            },
            activeTintColor: 'blue',
            inactiveTintColor: 'gray',
        }
    });