import React, { Component } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, Platform } from 'react-native';
import { TabNavigator, DrawerNavigator, StackNavigator } from 'react-navigation';
import { Icon } from 'native-base';
import DisplayMap from '../src/Components/Maps/DisplayMap'
import SettingTab from '../src/Components/Setting/SettingTab'
import MyTimeLine from '../src/Components/Maps/MyTimeLine'
import IndexManage from '../src/Components/ManagePeople/IndexManage'
import IndexShare from '../src/Components/ShareLocation/IndexShare'
import ShareDetail from '../src/Components/ShareLocation/ShareDetail'
import index from '../index'
import shareStack from './Components/ShareLocation/IndexShare'
import IndexRecommend from './Components/RecommendLocation/IndexRecommend'
import { mainColor } from './Components/Common/User'
import SideBar from './Components/Maps/SideBar'
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
            activeTintColor: mainColor,
            inactiveTintColor: 'gray',
        }
    });

export default drawer = DrawerNavigator({
    MainNavigator: {
        screen: MainNavigator,
    },
    IndexShare: {
        screen: IndexShare,
    },
    IndexManage: {
        screen: IndexManage,
    },
    
    IndexRecommend: {
        screen: IndexRecommend,
    }

}, drawerNavigatorConfig = {
    //initialRouteName: MoviesComponent,

    contentComponent: props => <SettingTab {...props} />,
})

export const stack = StackNavigator({
    Drawer: {
        screen: drawer
    },
    IndexShare: {
        screen: IndexShare
    },
    ShareDetail: {
        screen: ShareDetail
    }

});

