import { AppRegistry } from 'react-native';
import Login from './src/Components/Login/Login';
import React, { Component } from 'react';
//import App from './App'
import MainMenu from './src/MainMenu'
export class Main extends Component{
    constructor(props){
        super(props);
        this.state={ screen: 'Login'};
    }
    render(){
        try {
            const token = await  AsyncStorage.getItem('token');
            if (token !== null) {
                // We have data!!
                this.setState({ screen: 'MainMenu' })
                
            }else this.setState({ screen: 'Login' })
        } catch (error) {
            // Error retrieving data
        }
        let screen= this.state.screen==='Login'?<Login/>:<MainMenu/>
        return screen
    }
}

AppRegistry.registerComponent('LBA_Mobile', () => Main);
