import React, { Component } from 'react';
import {
    StyleSheet, View, PermissionsAndroid,
    TouchableWithoutFeedback, StatusBar,
    TextInput, Keyboard, TouchableOpacity,
    KeyboardAvoidingView, Image, Dimensions, AsyncStorage, Platform
} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text } from 'native-base';
import Modal from 'react-native-modalbox';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default class ModalGoogle extends Component {
    constructor(props) {
        super(props);

    }
    showModal = () => {
        this.refs.myModal.open();
    }

    render() {

        return (
            <Modal
                ref={"myModal"}
                style={{
                    justifyContent: 'center',
                    borderRadius: 15,
                    shadowRadius: 10,
                    width: 300,
                    height: 400,
                    alignItems: 'center',
                    //backgroundColor: 'rgba(0, 153, 211, 0.7)'
                }}
                position='center'
                backdrop={true}

            >
                <View style={{ flex: 1 }}>
                    <GooglePlacesAutocomplete
                        style={{flex:1, marginTop: 10 }}
                        placeholder='Input location here...'
                        minLength={2} // minimum length of text to search
                        autoFocus={false}
                        // Can be left out for default return key https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
                        listViewDisplayed='auto'    // true/false/undefined
                        fetchDetails={true}
                        renderDescription={row => row.description} // custom description render
                        onPress={(data, details = null) => { // 'details' is provided when fetchDetails = true

                            this.props.parentList.addMemberMarker(details.geometry.location)
                            //console.log(this.state.memLat)
                        }}
                        textInputProps={{
                            onChangeText: (text) => { this.props.parentList.setState({ locationName: text }) }
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
            </Modal>
        );
    }
}
