import React from 'react';
import Router from '../Router/Router'
export default class Main extends React.Component {
 
    
      // async componentWillMount() {
      //   await Expo.Font.loadAsync({
      //     Roboto: require("native-base/Fonts/Roboto.ttf"),
      //     Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      //     Ionicons: require("@expo/vector-icons/fonts/Ionicons.ttf")
      //   });
      // }
      render() {
        return (
          <Router/>
        );
    }
}