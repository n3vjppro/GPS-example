import { AppRegistry, AsyncStorage } from 'react-native';
import Login from './src/Components/Login/Login';
import React, { Component } from 'react';
import { StackNavigator } from 'react-navigation'
//import App from './App'
import MainMenu from './src/MainMenu'
import SplashScreen from 'react-native-splash-screen'
// let screen
export class Main extends Component {
    constructor(props) {
        super(props);
        
        // this.state = { screen: 'Login', token: null };
    }
    // async getToken() {
    //     const token = await AsyncStorage.getItem('token');
    //     if(token!==null) return screen=<MainMenu/>;
    //     else if(token===null) return screen =<Login/>
    //     //this.setState({ token })
    //     console.log("token:", this.state.token)
    // }
    componentDidMount() {
        SplashScreen.hide();
    }

    render() {
        // this.getToken();
        //this.state.token===null? screen= <Login/>:screen=<MainMenu/>
        return <MainMenu/>
    }
}



// export default class SplashScreen extends React.Component {
// constructor(props) {
//     super(props);
//     this.state = { isLoggedIn: false };
// }

// componentDidMount() {
//     AsyncStorage.getItem('loggedInStatus',
//         (value) => {
//             this.setState({ loggedInStatus: value });
//         });
// }

// render() {
//     if (this.state.loggedInStatus === 'loggedIn') {
//         return <MainMenu />
//     }
//     else if (this.state.loggedInStatus === 'loggedOut') {
//         return <Login screenProps={{ isLoggedIn: () => this.setState({ loggedInStatus: 'loggedIn' }) }} />
//     }

//     return <SplashScreen />
// }
//   }

AppRegistry.registerComponent('IamLost', () => Main);
