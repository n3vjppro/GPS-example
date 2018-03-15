import React, { Component } from 'react';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    ListItem,
    Text,
    Left,
    Right,
    Body,
    Item
} from 'native-base';
import { StyleSheet, View, PermissionsAndroid, Image,AsyncStorage, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import FBSDK, { LoginManager } from 'react-native-fbsdk';
import { FBLogin, FBLoginManager } from 'react-native-facebook-login';
import IndexManage from '../ManagePeople/IndexManage'
import Main from "../../../index";

//var { FBLogin, FBLoginManager } = require('react-native-facebook-login');
const {
    LoginButton,
    AccessToken
} = FBSDK;

const drawerCover = require("../../../assets/drawer-cover.jpg");
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
export class SettingTab extends Component {
    constructor(props) {
        super(props)
    }
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => {
            return <Icon name="settings" style={{ color: tintColor }} />
        },
        header: null
    }
    //ios-home-outline, ios-planet-outline, , ios-cart-outline
    render() {
        
            if(AsyncStorage.getItem('token')!==null)
            return(
            <Container style={styles.container}>
                <Image source={drawerCover} style={styles.drawerCover} />
                <Button full bordered info
                    style={{ paddingLeft: 10, marginBottom: 3, paddingRight: 3 }}
                    onPress={() => alert("noti")}
                >
                    <Left >
                        <Text>Tracking Location</Text>
                    </Left>
                    <Right><Icon active name="arrow-forward" /></Right>

                </Button>

                <Button full bordered warning
                    style={{ paddingLeft: 10, marginBottom: 3, paddingRight: 3 }}
                    onPress={() => this.props.navigation.navigate('IndexManage')}
                >

                    <Left ><Text>Manage People</Text></Left>
                    <Right  >
                        <Icon active name="arrow-forward" /></Right>

                </Button>

                <Button full bordered success
                    style={{ paddingLeft: 10, marginBottom: 3, paddingRight: 3 }}
                    onPress={() => alert("noti")}
                >

                    <Left><Text>Sharing Location</Text></Left>
                    <Right >
                        <Icon active name="arrow-forward" /></Right>
                </Button>

                <Button full bordered primary
                    style={{ paddingLeft: 10, marginBottom: 3, paddingRight: 3 }}
                    onPress={() => alert("noti")}
                >

                    <Left><Text>Location Nearby</Text></Left>
                    <Right >
                        <Icon active name="arrow-forward" /></Right>
                </Button>

                <Button full bordered danger
                    style={{ paddingLeft: 10, marginBottom: 3, paddingRight: 3 }}
                    onPress={() => {
                        AsyncStorage.setItem('token', null);
                        
                        
                        
                    }
                    }
                >

                    <Left><Text>Log Out</Text></Left>
                    <Right >
                        <Icon active name="md-log-out" /></Right>
                </Button>


            </Container>);
            else return <Main/>
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#FFF"
    },
    text: {
        alignSelf: "center",
        marginBottom: 7
    },
    drawerCover: {
        alignSelf: "stretch",
        height: deviceHeight / 3.5,
        width: null,
        position: "relative",
        marginBottom: 10
    },
    drawerImage: {
        position: "absolute",
        left: Platform.OS === "android" ? deviceWidth / 10 : deviceWidth / 9,
        top: Platform.OS === "android" ? deviceHeight / 13 : deviceHeight / 12,
        width: 210,
        height: 75,
        resizeMode: "cover"
    },
})

export default StackNavigator({
    SettingTab: {
        screen: SettingTab,
    },
    IndexManage: {
        screen: IndexManage,
    }
});