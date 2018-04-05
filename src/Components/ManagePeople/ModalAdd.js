import React, { Component } from 'react';
import {
    StyleSheet,  View, PermissionsAndroid,
    TouchableWithoutFeedback, StatusBar,
    TextInput, Keyboard, TouchableOpacity,
    KeyboardAvoidingView, Image, Dimensions, AsyncStorage, Platform
} from 'react-native';
import Modal from 'react-native-modalbox'
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';


export default class ModalAdd extends Component {
    constructor(props) {
        super(props);
    }
    showModal = () => {
        this.refs.myModal.open();
    }
    async createGroup(name, userid) {
        await fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/FollowPeople/creategroup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
            body: JSON.stringify({
                UserID: userid,
                IsParent: true,
                Name: name,
                
            }),

        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson)
                if (responseJson.success) {

                    alert('Done! Here is your passcode: ' + responseJson.PassCode)
                    this.props.parentList.loadData(userid)
                    this.refs.myModal.close()

                } else alert('Something is wrong. Try again!')
            })
            .catch((error) => {

                console.log(error);
            })
    }
    render() {
        let name = '';
        return (
            <Modal
                ref={"myModal"}
                style={{
                    justifyContent: 'center',
                    borderRadius: 15 ,
                    shadowRadius: 10,
                    width: 200,
                    height: 200,
                    alignItems: 'center',
                   // backgroundColor: 'rgba(0, 153, 211, 0.7)'
                }}
                position='center'
                backdrop={true}

            >
                {/* <Text>Create your group</Text>
                <TextInput
                    style={{ width: 150, alignItems: 'center', textAlign: 'center' }}
                    placeholder="Your group name"
                    placeholderTextColor='rgba(255,255,255,0.8)'
                    returnKeyType='go'

                    autoCorrect={false}
                    onChangeText={(text) => name = text}
                />
                <TouchableOpacity
                    style={{ marginBottom: 10 }}
                    onPress={
                        () => {
                            console.log(name + ' ' + this.props.userId)
                            this.createGroup(name, this.props.userId)
                        }
                    }
                ><Text>Submit</Text>
                </TouchableOpacity> */}


                <Container>
                    <Content>
                        <Form>
                            <Item stackedLabel style={{marginTop:40}}>
                                <Label >Create your group</Label>
                                <Input
                                    style={{ width: 180,  alignItems: 'center', textAlign: 'center' }}
                                    placeholder=""
                                    placeholderTextColor='rgba(111,111,111,1)'
                                    returnKeyType='go'
                                    autoCorrect={false}
                                    onChangeText={(text) => name = text} />
                            </Item>

                        </Form>
                    </Content>
                    <Button full info
                        style={{ width: 200, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}
                        onPress={
                            () => {
                                console.log(name + ' ' + this.props.userId)
                                this.createGroup(name, this.props.userId)
                            }
                        }
                    ><Text style={{ fontWeight: 'bold', color: 'white' }}>Submit</Text>
                    </Button>
                </Container>

            </Modal>
        );
    }
}
