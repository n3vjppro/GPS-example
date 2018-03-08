import React, { Component } from 'react';
import { StyleSheet, Text, View,PermissionsAndroid } from 'react-native';

//import FBSDK, {LoginManager} from 'react-native-fbsdk'
import DisplayMap from './src/Components/Maps/DisplayMap'
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;
export default class App extends Component {
  
  render() {
    return (
      <View>
      <LoginButton
        publishPermissions={["publish_actions"]}
        onLoginFinished={
          (error, result) => {
            if (error) {
              alert("login has error: " + result.error);
            } else if (result.isCancelled) {
              alert("login is cancelled.");
            } else {
              <DisplayMap/>
              AccessToken.getCurrentAccessToken().then(
                (data) => {
                  alert(data.accessToken.toString())
                }
                
              )
            }
          }
        }
        onLogoutFinished={() => alert("logout.")}/>
        {/* <Text>dd</Text> */}
    </View>
    );
  }
}

