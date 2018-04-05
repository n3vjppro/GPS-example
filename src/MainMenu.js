import React, { Component } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, Platform } from 'react-native';
import { TabNavigator, DrawerNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'native-base';
import DisplayMap from '../src/Components/Maps/DisplayMap'
import SettingTab from '../src/Components/Setting/SettingTab'
import MyTimeLine from '../src/Components/Maps/MyTimeLine'
import IndexManage from '../src/Components/ManagePeople/IndexManage'
import IndexShare from '../src/Components/ShareLocation/IndexShare'
// export  class MainMenu extends Component {
//     static navigationOptions = {
//         headerLeft: <Icon
//             name={Platform.OS === 'ios' ? 'ios-basket' : 'md-basket'}
//             style={{ paddingLeft: 10 }} />,
//         title: "My GPS",
//         headerRight: <Icon
//             name={Platform.OS === 'ios' ?
//                 'ios-compass' : 'md-compass'}
//             style={{ paddingRight: 10 }} />
//     }
//     render() {
//         return <MainNavigator>
//             <Text>My main Screen</Text>
//         </MainNavigator>;
//     }

// }

export const MainNavigator = TabNavigator({
    DisplayMapTab: {
        screen: DisplayMap
    },
    MyTimeLine: {
        screen: MyTimeLine
    },


}, {
        animationEnabled: true,
        swipeEnabled: true,
        tabBarPosition: 'bottom',
        tabBarOptions: {
            showIcon: true,
            showLabel: true,
            style: {
                backgroundColor: 'white',
            },
            activeTintColor: 'blue',
            inactiveTintColor: 'gray',
        }
    });

export default  drawer = DrawerNavigator({
    MainNavigator: {
        screen: MainNavigator
    },
    IndexManage: {
        screen: IndexManage,
    },
    IndexShare:{
        screen: IndexShare
    }

}, drawerNavigatorConfig = {
    //initialRouteName: MoviesComponent,

    contentComponent: props => <SettingTab {...props} />,
})

export const stack = StackNavigator({
    Drawer: {
        screen: drawer
    },
    
});