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
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import {mainColor} from '../Common/User'

const { height: screenHeight, width: screenWidth } = Dimensions.get('window')
let radius, minute;
export default class ModalRadius extends Component {
    constructor(props) {
        super(props);

        this.getRaMi();

    }

    async getRaMi() {
        try {
            await AsyncStorage.getItem('radius').then(radius => radius = radius)
            await AsyncStorage.getItem('minute').then(minute => minute = minute)
            console.log(radius, minute)
        } catch (error) {
            console.log(error)
        }
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
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    shadowRadius: 10,
                    width: screenWidth,
                    height: screenHeight * 0.7,
                    alignItems: 'flex-end',
                    //backgroundColor: 'rgba(0, 153, 211, 0.7)'
                }}
                position='bottom'
                backdrop={true}
                backButtonClose={true}

            >
                <Container>
                    <Content>
                        <Form>
                            <View style={{ flex: 1 }}>
                                <GooglePlacesAutocomplete
                                    style={{ flex: 1, marginTop: 10 }}
                                    placeholder='Input location here...'
                                    minLength={2} // minimum length of text to search
                                    autoFocus={false}
                                    // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                                    listViewDisplayed='auto'    // true/false/undefined
                                    fetchDetails={true}
                                    renderDescription={row => row.description} // custom description render
                                    onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true
                                        this.props.parentList.addMemberMarker(details.geometry.location, details.formatted_address)

                                    }}
                                    textInputProps={{
                                        onChangeText: (text) => { this.setState({ locationName: text }) }
                                    }}
                                    getDefaultValue={() => ''}

                                    query={{
                                        // available options: https://developers.google.com/places/web-service/autocomplete
                                        key: 'AIzaSyDEqFDbUH-a7q1CPy8pX7QijSOMzwRyySE',
                                        language: 'en', // language of the results
                                        types: 'geocode' // default: 'geocode'
                                    }}

                                    styles={{
                                        listView: {

                                            backgroundColor: 'rgba(0,0,0,0)',

                                        },
                                        textInputContainer: {
                                            backgroundColor: 'rgba(0,0,0,0)',
                                            borderTopWidth: 0,
                                            borderBottomWidth: 0,
                                        },
                                        description: {
                                            fontWeight: 'bold',
                                            color: 'black'
                                        },
                                        textInput: {
                                            marginLeft: 5,
                                            marginRight: 5,
                                            height: 38,
                                            color: '#5d5d5d',
                                            fontSize: 16,
                                        },
                                        predefinedPlacesDescription: {
                                            backgroundColor: 'rgba(255,255,255,0.5)',
                                            color: '#1faadb'
                                        },


                                    }}
                                    // value={props.location}
                                    // onChangeText={props.onLocationChange}

                                    nearbyPlacesAPI='GooglePlacesSearch' // Which API to use: GoogleReverseGeocoding or GooglePlacesSearch
                                    GoogleReverseGeocodingQuery={{
                                        // available options for GoogleReverseGeocoding API : https://developers.google.com/maps/documentation/geocoding/intro
                                    }}
                                    GooglePlacesSearchQuery={{
                                        // available options for GooglePlacesSearch API : https://developers.google.com/places/web-service/search
                                        rankby: 'distance',
                                        //types: 'food'
                                    }}

                                    filterReverseGeocodingByTypes={['locality', 'administrative_area_level_3']} // filter the reverse geocoding results by types - ['locality', 'administrative_area_level_3'] if you want to display only cities
                                    debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
                                />

                            </View>

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
                                    value={radius}
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
                                    value={minute}
                                    onChangeText={(text) => minuteText = text} />
                            </Item>
                        </Form>
                    </Content>
                    <Button full 
                        style={{ width: screenWidth, backgroundColor:mainColor }}
                        onPress={
                            () => {
                                //console.log(this.props.parentList.state.idMember, this.props.parentList.state.idGroup, this.props.parentList.state.memLat, this.props.parentList.state.memLong, parseFloat(radiusText), parseFloat(minuteText))
                                //this.addRadius(this.props.parentList.state.idMember, this.props.parentList.state.idGroup, this.props.parentList.state.memLat, this.props.parentList.state.memLong, parseInt(radiusText), parseInt(minuteText))
                                //this.props.parentList.setState({ radius: parseInt(radiusText), limitTime: parseInt(minuteText) })
                                Alert.alert(
                                    'Confirm your Circle',
                                    'You have set a circle at: ' + this.state.locationName + ' with Radius: ' + parseInt(radiusText) + ' meter(s) and Limit time: ' + parseInt(minuteText) + ' minute(s)',
                                    [
                                        { text: 'Let me see again', onPress: () => { this.refs.myModal.close(); this.props.parentList.showActionSheet(parseInt(radiusText), this.props.parentList.state.idMember, parseInt(minuteText)) } },
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
