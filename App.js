import React, { Component } from 'react';
import { StyleSheet, Text, View, PermissionsAndroid, TouchableOpacity } from 'react-native';
import FCM, {
  FCMEvent,
  RemoteNotificationResult,
  WillPresentNotificationResult,
  NotificationType
} from "react-native-fcm";
import SplashScreen from 'react-native-splash-screen'

//import DisplayMap from './src/Components/Maps/DisplayMap'


export default class App extends Component {

  componentDidMount() {
    SplashScreen.hide();
    FCM.requestPermissions();

    FCM.getFCMToken().then(token => {
      // alert(token);
      console.log("TOKEN (getFCMToken)", token);
      this.setState({ token: token });
    });
    FCM.subscribeToTopic('mes-annonces');

    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
      if (notif.opened_from_tray) {
        alert('open from tray')
      }
      else if (notif.local_notification) {
        alert('notify')
      }
      else {
        //to do
      }

      this.showLocalNotification(notif);
    });

    FCM.on(FCMEvent.RefreshToken, token => {
      console.log(token);
    })
  }
  showLocalNotification(notif) {
    FCM.presentLocalNotification({
      title: 'My GPS',
      body: notif.fcm.body,
      priority: "high",
      click_action: 'Detail',
      show_in_foreground: true,
      local: true
    });
  }
  render() {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
             fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/FCM', {
              method: 'PUT',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
              },
              body: JSON.stringify({
                userId: 2,
                token: this.state.token,
                
              }),

            })
              .then((response) => response.json())
              .then((responseJson) => {

                console.log(responseJson)
              })
              .catch((error) => {

                console.log(error);
              })
          }}
        >
          <Text>click</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

