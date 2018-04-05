import React, { Component } from 'react';
import {
    StyleSheet, View, PermissionsAndroid,
    TouchableWithoutFeedback, StatusBar,
    TextInput, Keyboard, TouchableOpacity,
    KeyboardAvoidingView, Image, Dimensions, AsyncStorage, Platform
} from 'react-native';
import { Container, Header, Content, Form, Item, Left, Body, Icon, Input, Label, Button, Text } from 'native-base';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

export default class ModalGoogle extends Component {
    static navigationOptions = {
        header: null
    };
    constructor(props) {
        super(props);
        this.state = {
            locationName: ''
        }
    }


    render() {

        return (
            <Container>
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                            <Icon name="md-menu" />
                        </Button>
                    </Left>
                    <Body><Text style={{ color: 'white' }}>Select your location</Text></Body>

                </Header>
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

                            this.props.navigation.state.params.addMemberMarker(details.geometry.location)
                            //console.log(this.state.memLat)
                            this.props.navigation.goBack();
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
                    <Button full
                    onPress={()=>this.props.navigation.goBack()}
                    >
                        <Text>Back</Text>
                    </Button>
                </View>
            </Container>
        );
    }
}
