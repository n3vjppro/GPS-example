import React, { Component } from 'react';
import {
    StyleSheet, View, PermissionsAndroid,
    TouchableWithoutFeedback, StatusBar,
    TextInput, Keyboard, TouchableOpacity,
    KeyboardAvoidingView, Image, Dimensions, AsyncStorage, Platform
} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import Modal from 'react-native-modalbox'
import PushNotification from 'react-native-push-notification';
import PushController from '../PushController'
export default class ModalRadius extends Component {
    constructor(props) {
        super(props);

    }
    showModal = () => {
        this.refs.myModal.open();
    }
    async addRadius(userId, groupId, LatitudeDes, LongtitudeDes, Radius, TimeLimit) {
        await fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/LocationDestination', {
            method: 'PUT',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
            body: JSON.stringify({
                UserId: userId,
                GroupId: groupId,
                LatitudeDes: LatitudeDes,
                LongtitudeDes: LongtitudeDes,
                Radius: Radius,
                TimeLimit: TimeLimit,

            }),

        })
            .then((response) => response.json())
            .then((responseJson) => {
                 //console.log(responseJson, userid,groupId, LatitudeDes)

                if (responseJson.success) {

                   // alert('Done!')

                    this.refs.myModal.close()

                } else alert('Something went wrong!')
            })
            .catch((error) => {

                console.log(error);
            })
    }
    render() {
        let radiusText = '';
        let minuteText = '';
        return (
            <Modal
                ref={"myModal"}
                style={{
                    justifyContent: 'center',
                    borderRadius: 15,
                    shadowRadius: 10,
                    width: 200,
                    height: 200,
                    alignItems: 'center',
                    //backgroundColor: 'rgba(0, 153, 211, 0.7)'
                }}
                position='center'
                backdrop={true}

            >
                <Container>
                    <Content>
                        <Form>
                            <Item stackedLabel>
                                <Label>Radius (meter)</Label>
                                <Input
                                    style={{ width: 180, alignItems: 'center', textAlign: 'center',  }}
                                    //placeholder="meters"
                                    placeholderTextColor='rgba(111,111,111,1)'
                                    returnKeyType='go'
                                    keyboardType='numeric'
                                    autoCorrect={false}
                                    maxLength={6}
                                    onChangeText={(text) => radiusText = text} />
                            </Item>
                            <Item stackedLabel last>
                                <Label>Time Limit (minute)</Label>
                                <Input
                                    style={{ width: 180, alignItems: 'center', textAlign: 'center',  }}
                                    //placeholder="minutes"
                                    placeholderTextColor='rgba(111,111,111,1)'
                                    returnKeyType='go'
                                    keyboardType='numeric'
                                    autoCorrect={false}                                 
                                    onChangeText={(text) => minuteText = text} />
                            </Item>
                        </Form>
                    </Content>
                    <Button full info
                        style={{width:200, borderBottomLeftRadius:15, borderBottomRightRadius:15}}
                        onPress={
                            () => {
                                //console.log(this.props.parentList.state.idMember, this.props.parentList.state.idGroup, this.props.parentList.state.memLat, this.props.parentList.state.memLong, parseFloat(radiusText), parseFloat(minuteText))
                                this.addRadius(this.props.parentList.state.idMember, this.props.parentList.state.idGroup, this.props.parentList.state.memLat, this.props.parentList.state.memLong, parseInt(radiusText), parseInt(minuteText))
                                this.props.parentList.setState({ radius: parseInt(radiusText), limitTime: parseInt(minuteText) })
                                this.props.parentList.handleNotification(parseInt(radiusText),this.props.parentList.state.idMember,parseInt(minuteText) );
                                this.refs.myModal.close()
                            }
                        }
                    ><Text style={{ fontWeight: 'bold', color: 'white' }}>Submit</Text>
                    </Button>
                </Container>
            </Modal>
        );
    }
}
