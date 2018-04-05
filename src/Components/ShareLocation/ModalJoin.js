import React, { Component } from 'react';
import {
    StyleSheet, View, PermissionsAndroid,
    TouchableWithoutFeedback, StatusBar,
    TextInput, Keyboard, TouchableOpacity,
    KeyboardAvoidingView, Image, Dimensions, AsyncStorage, Platform
} from 'react-native';
import Modal from 'react-native-modalbox'
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';


export default class ModalJoin extends Component {
    constructor(props) {
        super(props);
    }
    showModal = () => {
        this.refs.myModal.open();
    }
    async joinGroup(userid, passcode) {
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
                if (responseJson.success) {

                    alert('Done! You are a member in group ' + responseJson.Name)

                    this.refs.myModal.close()

                } else alert(responseJson.message)
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
                    borderRadius:  15 ,
                    shadowRadius: 10,
                    width: 200,
                    height: 200,
                    alignItems: 'center',
                    //backgroundColor: 'rgba(0, 153, 211, 0.7)'
                }}
                position='center'
                backdrop={true}

            >
                {/* <Text>Join a group</Text>
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
                </TouchableOpacity> */}


                <Container>
                    <Content>
                        <Form>
                            <Item stackedLabel style={{marginTop:40}}>
                                <Label>Join a group</Label>
                                <Input
                                    style={{ width: 180, alignItems: 'center', textAlign: 'center' }}
                                    
                                    placeholderTextColor='rgba(111,111,111,1)'
                                    returnKeyType='go'
                                    keyboardType='numeric'
                                    autoCorrect={false}
                                    onChangeText={(text) => PassCode = text} />
                            </Item>
                           
                        </Form>
                    </Content>
                    <Button full info
                        style={{ width: 200, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}

                        onPress={
                            () => {
                                //console.log(name+' '+this.props.userId)
                                this.joinGroup(this.props.userId, PassCode)
                            }
                        }

                    ><Text style={{ fontWeight: 'bold', color: 'white' }}>Submit</Text>
                    </Button>
                </Container>

            </Modal>
        );
    }
}
