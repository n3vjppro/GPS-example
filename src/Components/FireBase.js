import React, { Component, PureComponent } from 'react';

import FCM, {
    FCMEvent,
    RemoteNotificationResult,
    WillPresentNotificationResult,
    NotificationType
} from "react-native-fcm";

export default class FireBase extends Component {
    async componentDidMount() {
        FCM.requestPermissions();

        await FCM.getFCMToken().then(token => {
            // alert(token);
            //console.log("TOKEN (getFCMToken)", token);
            //this.setState({ token: token });
            fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/FCM', {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
                },
                body: JSON.stringify({
                    userId: userId,
                    token: token,

                }),

            })
                .then((response) => response.json())
                .then((responseJson) => {

                    console.log(responseJson)
                })
                .catch((error) => {

                    console.log(error);
                })
        });
        FCM.subscribeToTopic('mes-annonces');

        this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
            if (notif.opened_from_tray) {
                alert('open from tray')
            }
            else if (notif.local_notification) {
                this.props.navigation.navigate('ShareDetail',
                    {
                        detail:
                            {
                                ID: 11,
                                IsFollow: true,
                                Name: "OldFriends",
                                PassCode: "873714",
                            }
                    })
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
            click_action: 's',
            show_in_foreground: true,
            local: true
        });
    }

    render() {
        return (
            null
        );
    }
}