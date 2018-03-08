import React, { Component } from 'react';
import {
    StyleSheet, Text, View, PermissionsAndroid,
    TouchableWithoutFeedback, StatusBar,
    TextInput, SafeAreaView, Keyboard, TouchableOpacity,
    KeyboardAvoidingView, Image,
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import FBSDK, { LoginManager } from 'react-native-fbsdk'
import MainMenu from '../../MainMenu'

const {
    LoginButton,
    AccessToken
} = FBSDK;
export class Login extends Component {
    static navigationOptions = {

        header: null
    };
    // fbAuth() {
    //     LoginManager.logInWithReadPermissions(['public_profile']).then(
    //         function (result) {
    //             if (result.isCancelled) {
    //                 alert('Login was cancelled');
    //             } else {
    //                 this.props.navigation.navigate('Map')
    //                 // alert('Login was successful with permissions: '
    //                 //     + result.grantedPermissions.toString());
    //             }
    //         },
    //         function (error) {
    //             alert('Login failed with error: ' + error);
    //         }
    //     );
    // }
    render() {
        return (
             AccessToken.getCurrentAccessToken() === null ?


                <View style={styles.container}>
                    <StatusBar barStyle="light-content" />
                    <KeyboardAvoidingView behavior='padding' style={styles.container}>
                        <TouchableWithoutFeedback style={styles.container}
                            onPress={Keyboard.dismiss}>
                            <View style={styles.logoContainer}>
                                <View style={styles.logoContainer}>
                                    <Text style={styles.logo}>
                                        My-GPS
                                </Text>
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
                                    />
                                    <TextInput style={styles.input}
                                        placeholder="Enter password"
                                        placeholderTextColor='rgba(255,255,255,0.8)'
                                        returnKeyType='go'
                                        secureTextEntry
                                        autoCorrect={false}
                                        ref={"txtPassword"}
                                    />
                                    <TouchableOpacity style={styles.buttonContainer}>
                                        <Text style={styles.buttonText}>LOG IN</Text>
                                    </TouchableOpacity>

                                </View>

                            </View>
                        </TouchableWithoutFeedback>
                    </KeyboardAvoidingView>
                    <View >
                        <LoginButton
                            style={styles.buttonFacebook}
                            publishPermissions={["publish_actions"]}
                            onLoginFinished={
                                (error, result) => {
                                    if (error) {
                                        alert("Login failed with error: " + result.error);
                                    } else if (result.isCancelled) {
                                        alert("Login was cancelled");
                                    } else {
                                        alert("Login was successful with access token: " + result.grantedPermissions + ' ' + AccessToken.getCurrentAccessToken())                                        
                                        this.props.navigation.navigate('MainMenu');
                                    }
                                }
                            }
                            onLogoutFinished={() => alert("User logged out")} />
                    </View>
                </View>
               :<MainMenu/>
        );
    }
}

export default StackNavigator({
    Login: {
        screen: Login,
    },
    MainMenu: {
        screen: MainMenu,
    }
});





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