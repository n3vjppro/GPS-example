import React, { Component } from 'react';
import {
    StyleSheet, Text, View, PermissionsAndroid,
    TouchableWithoutFeedback, StatusBar,
    TextInput, Keyboard, TouchableOpacity,
    KeyboardAvoidingView, Image, Dimensions, AsyncStorage, Platform
} from 'react-native';
import Modal from 'react-native-modalbox'


export default class ModalJoin extends Component {
    constructor(props) {
        super(props);
    }
    showModal = () => {
        this.refs.myModal.open();
    }
    async joinGroup(userid,passcode) {
        await fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/FollowPeople/JoinGroup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
            body: JSON.stringify({
                UserID: userid,
                
                PassCode: passcode
            }),

        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if(responseJson.success)
                {
                
                alert('Done! You are a member in group '+responseJson.Name)
                
                this.refs.myModal.close()

                }else  alert(responseJson.message)
            })
            .catch((error) => {

                console.log(error);
            })
    }
    render() {
        let PassCode = '';
        return (
            <Modal
                ref={"myModal"}
                style={{
                    justifyContent: 'center',
                    borderRadius: Platform.OS === 'ios' ? 15 : 0,
                    shadowRadius: 10,
                    width: 200,
                    height: 200,
                    alignItems: 'center',
                    backgroundColor: 'rgba(0, 153, 211, 0.7)'
                }}
                position='center'
                backdrop={true}

            >
                <Text>Join a group</Text>
                <TextInput
                    style={{ width: 150, alignItems: 'center', textAlign: 'center' }}
                    placeholder="Input passcode here"
                    placeholderTextColor='rgba(255,255,255,0.8)'
                    returnKeyType='go'
                    keyboardType='numeric'
                    autoCorrect={false}
                    onChangeText={(text) => PassCode = text}
                />
                <TouchableOpacity
                    style={{ marginBottom: 10 }}
                    onPress={
                        () => {
                            //console.log(name+' '+this.props.userId)
                            this.joinGroup(this.props.userId, PassCode)
                        }
                    }
                ><Text>Submit</Text>
                </TouchableOpacity>

            </Modal>
        );
    }
}
