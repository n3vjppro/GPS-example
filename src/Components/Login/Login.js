import React, { Component } from 'react';
import {
    StyleSheet, Text, View, PermissionsAndroid,
    TouchableWithoutFeedback, StatusBar,
    TextInput, SafeAreaView, Keyboard, TouchableOpacity,
    KeyboardAvoidingView, Image, Dimensions, AsyncStorage
} from 'react-native';
import { StackNavigator,NavigationActions  } from 'react-navigation';
import MainMenu from '../../MainMenu'
const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;
import SettingTab from '../Setting/SettingTab'
export default  class Login extends Component {
    constructor(props) {
        super(props);
        this.state={screen:'Login'}
        
    }

    async checkToken(){   
        try {
            const token = await  AsyncStorage.getItem('token');
            console.log('Login Token: ', token)
            if (token !== null) {
                // We have data!!
                this.setState = { screen: 'MainMenu' }
            }else this.setState = { screen: 'Login' }
        } catch (error) {
            // Error retrieving data
            console.log(error)
        }
    }
    static navigationOptions = {

        header: null
    };
    


    async checkAuth(email, password) {
        await fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Email: email,
                PassWord: password
            }),

        })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson.success)
                    try {
                        AsyncStorage.setItem('token', responseJson.token);
                        console.log('success');
                        //this.setState({ screen: 'MainMenu' })
                        // return <MainMenu />                        
                    }catch (error) {
                        // Error saving data
                    }
                else alert('Email or Password invalid')
                console.log(responseJson)
            })
            .catch((error) => {
                AsyncStorage.setItem('token', null);

                console.log(error);
            })
    }

     componentDidMount() {
       // this.checkToken()
     }
    render() {
        let username = ''
        let password = ''
        this.checkToken();
        return (
            //  AccessToken.getCurrentAccessToken() === null ?
         this.state.screen==='Login'?
            <View style={styles.container}>
                <StatusBar barStyle="light-content" />
                <KeyboardAvoidingView behavior='padding' style={styles.container}>
                    <TouchableWithoutFeedback style={styles.container}
                        onPress={Keyboard.dismiss}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoContainer}>
                                <Image style={{ width: deviceWidth / 2, height: deviceWidth / 2, marginBottom: 30 }} source={require('../../../assets/coev.png')}></Image>
                                {/* <Text style={styles.title}>Account Information</Text> */}
                            </View>
                            <View style={styles.infoContainer}>
                                <TextInput style={styles.input}
                                    placeholder="Enter username/email"
                                    placeholderTextColor='rgba(255,255,255,0.8)'
                                    keyboardType='email-address'
                                    returnKeyType='next'
                                    autoCorrect={false}
                                    onSubmitEditing={() => this.refs.txtPassword.focus()}

                                    onChangeText={(text) => username = text}
                                />
                                <TextInput style={styles.input}
                                    placeholder="Enter password"
                                    placeholderTextColor='rgba(255,255,255,0.8)'
                                    returnKeyType='go'
                                    secureTextEntry
                                    autoCorrect={false}
                                    ref={"txtPassword"}

                                    onChangeText={(text) => password = text}
                                />
                                <TouchableOpacity style={styles.buttonContainer}
                                    onPress={() => {
                                        //console.log(username, password)
                                        this.checkAuth(username, password)
                                    }
                                    }
                                >
                                    <Text style={styles.buttonText}>LOG IN</Text>
                                </TouchableOpacity>

                            </View>

                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
                
            </View>
             :<MainMenu/>


        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(32, 53, 70)',
        flexDirection: 'column',
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    logo: {
        width: 128,
        height: 56,
    },
    title: {
        color: '#f7c744',
        fontSize: 18,
        textAlign: 'center',
        marginTop: 5,
        opacity: 0.9
    },
    infoContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        height: 200,
        padding: 20,
        // backgroundColor: 'red'
    },
    input: {
        height: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        color: '#FFF',
        marginBottom: 20,
        paddingHorizontal: 10
    },
    buttonContainer: {
        backgroundColor: '#f7c744',
        paddingVertical: 15,
        marginBottom: 15,

    },
    buttonText: {
        textAlign: 'center',
        color: 'rgb(32, 53, 70)',
        fontWeight: 'bold',
        fontSize: 18
    },
    buttonFacebook: {

        backgroundColor: '#3B5998',
        //paddingVertical: 15,
        marginBottom: 15,
        padding: 20,
        margin: 20,
        height: 50,
        paddingTop: 10


    },

})