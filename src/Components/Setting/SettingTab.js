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
    Item,
    Card, CardItem, Footer
} from 'native-base';
import { StyleSheet, View, PermissionsAndroid, Image, AsyncStorage, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';


import IndexManage from '../ManagePeople/IndexManage';
import Main from "../../../index";
import MainNavigator from '../../MainMenu';
import IndexShare from '../ShareLocation/IndexShare';

const drawerCover = require("../../../assets/drawer-cover.jpg");
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
export default class SettingTab extends Component {
    constructor(props) {
        super(props)
    }
    // static navigationOptions = {
    //     tabBarIcon: ({ tintColor }) => {
    //         return <Icon name="settings" style={{ color: tintColor }} />
    //     },
    //     header: null
    // }
    //ios-home-outline, ios-planet-outline, , ios-cart-outline
    render() {


        return (
            <Container style={styles.container}>
               
                    <Image source={require('../../../assets/Location-History.jpg')} style={styles.drawerCover} />
               
                <Content>
                <CardItem style={{paddingBottom:2, paddingTop:2}}>
                    <Button full transparent iconLeft

                        onPress={() => this.props.navigation.navigate('MainNavigator')}
                    >
                        <Image source={require('../../../assets/Track-Order.png')} style={{ width: 24, height: 24 }} />
                        <Text style={{ color: '#394041' }} >Tracking Location</Text>
                    </Button>
                </CardItem>
                <CardItem style={{paddingBottom:2, paddingTop:2}}>
                    <Button full transparent iconLeft

                        onPress={() => this.props.navigation.navigate('IndexManage')}
                    >

                        <Image source={require('../../../assets/137-512.png')} style={{ width: 24, height: 24 }} />
                        <Text style={{ color: '#394041' }}>Manage People</Text>

                    </Button>
                </CardItem>
                <CardItem style={{paddingBottom:2, paddingTop:2}}>
                    <Button full transparent iconLeft

                        onPress={() => this.props.navigation.navigate('IndexShare')}
                    >

                        <Image source={require('../../../assets/bubbles.png')} style={{ width: 24, height: 24 }} />
                        <Text style={{ color: '#394041' }}>Location Sharing</Text>

                    </Button>
                </CardItem>
                <CardItem style={{paddingBottom:2, paddingTop:2}}>
                    <Button full transparent iconLeft

                        onPress={() =>this.props.navigation.navigate('IndexRecommend')}
                    >

                        <Image source={require('../../../assets/nearby.png')} style={{ width: 24, height: 24, borderRadius: 30 }} />
                        <Text style={{ color: '#394041' }}>Location Nearby</Text>
                    </Button>
                </CardItem>
                </Content>
                <Footer style={{backgroundColor:'white',flexDirection: 'column',alignItems:'center'}}>
                    <Text>SENIOR PROJECT</Text>
                    <Text>Nathan & Pedro</Text>
                    
                </Footer>








                {/* // <Button full bordered danger
                //     style={{ paddingLeft: 10, marginBottom: 3, paddingRight: 3 }}
                //     onPress={() => {
                //         AsyncStorage.removeItem('token');
                //     }
                //     }
                // >

                //     <Left><Text>Log Out</Text></Left>
                //     <Right >
                //         <Icon active name="md-log-out" /></Right>
                // </Button>  */}
            </Container>);

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

