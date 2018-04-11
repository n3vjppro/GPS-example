import React, { Component } from 'react';
import {
    StyleSheet, View, PermissionsAndroid,
    TouchableWithoutFeedback, StatusBar,
    TextInput, Keyboard, TouchableOpacity,
    KeyboardAvoidingView, Image, Dimensions, AsyncStorage, Platform, Alert
} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import Modal from 'react-native-modalbox'
import PushNotification from 'react-native-push-notification';
import PushController from '../PushController'
const { height: screenHeight, width: screenWidth } = Dimensions.get('window')
export default class ModalRadius extends Component {
    constructor(props) {
        super(props);

    }
    showModal = () => {
        this.refs.myModal.open();
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
                    width: screenWidth * 0.8,
                    height: screenWidth * 0.8,
                    alignItems: 'center',
                    //backgroundColor: 'rgba(0, 153, 211, 0.7)'
                }}
                position='center'
                backdrop={true}

            >
                <Container>
                    <Content>
                        <Form>
                            <Item disabled stackedLabel>
                                <Label>Location</Label>
                                <Input style={{ width: screenWidth * 0.7, alignItems: 'center', textAlign: 'center', }} disabled placeholder={this.props.parentList.state.locName} />

                            </Item>
                            <Item stackedLabel>
                                <Label>Radius (meter)</Label>
                                <Input
                                    style={{ width: screenWidth * 0.7, alignItems: 'center', textAlign: 'center', }}
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
                                    style={{ width: screenWidth * 0.7, alignItems: 'center', textAlign: 'center', }}
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
                        style={{ width: screenWidth * 0.8, borderBottomLeftRadius: 15, borderBottomRightRadius: 15 }}
                        onPress={
                            () => {
                                //console.log(this.props.parentList.state.idMember, this.props.parentList.state.idGroup, this.props.parentList.state.memLat, this.props.parentList.state.memLong, parseFloat(radiusText), parseFloat(minuteText))
                                //this.addRadius(this.props.parentList.state.idMember, this.props.parentList.state.idGroup, this.props.parentList.state.memLat, this.props.parentList.state.memLong, parseInt(radiusText), parseInt(minuteText))
                                //this.props.parentList.setState({ radius: parseInt(radiusText), limitTime: parseInt(minuteText) })
                                Alert.alert(
                                    'Confirm your Circle',
                                    'You have set a circle at: ' + this.props.parentList.state.locName + ' with Radius: ' + parseInt(radiusText) + ' meter(s) and Limit time: ' + parseInt(minuteText)+' minute(s)',
                                    [
                                        { text: 'Let me see again', onPress: () => {this.refs.myModal.close();this.props.parentList.showActionSheet(parseInt(radiusText), this.props.parentList.state.idMember, parseInt(minuteText))} },
                                        { text: 'Cancel', onPress: () => this.refs.myModal.close(), style: 'cancel' },
                                        {
                                            text: 'OK', onPress: () => {
                                                this.props.parentList.handleNotification(parseInt(radiusText), this.props.parentList.state.idMember, parseInt(minuteText));
                                                //console.log(this.props.parentList.radius,  this.props.parentList.state.addWarning)
                                                this.refs.myModal.close()
                                            }
                                        },
                                    ],
                                    { cancelable: false }
                                )

                            }
                        }
                    ><Text style={{ fontWeight: 'bold', color: 'white' }}>Submit</Text>
                    </Button>
                </Container>
            </Modal>
        );
    }
}
