import { AppRegistry, AsyncStorage } from 'react-native';
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation'
import App from './App'
import MainMenu from './src/MainMenu'
import SplashScreen from 'react-native-splash-screen'
import userId from './src/Components/Common/User'
import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from "react-native-fcm";
import IndexShare from './src/Components/ShareLocation/IndexShare'
import shareStack from './src/Components/ShareLocation/IndexShare'
//import App from './src/Components/Firebase/App'
// let screen
export class Main extends Component {
    constructor(props) {
        super(props);

        console.disableYellowBox = true;
        // this.state = { screen: 'Login', token: null };
    }
    componentDidMount() {
        SplashScreen.hide();
        
    }
    render() {
        // this.getToken();
        //this.state.token===null? screen= <Login/>:screen=<MainMenu/>
        return <MainMenu />
    }
}


AppRegistry.registerComponent('IamLost', () => Main);
