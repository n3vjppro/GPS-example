import React, { Component } from 'react';
import {
    StyleSheet, View, PermissionsAndroid,
    TouchableWithoutFeedback, StatusBar,
    TextInput, Keyboard, TouchableOpacity,
    KeyboardAvoidingView, Image, Dimensions, AsyncStorage, Platform, Alert
} from 'react-native';
import { Container, Header, Content, Form, Item, Input, Label, Button, Text, Card, CardItem, Left, Body, Right, Thumbnail, Icon } from 'native-base';
import { mainColor } from '../Common/User'
import MapView from 'react-native-maps'
import Spinner from 'react-native-loading-spinner-overlay';
import MapViewDirections from 'react-native-maps-directions'



const { height: screenHeight, width: screenWidth } = Dimensions.get('window')
let radius, minute;
export default class DetailPlace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            item: {},
            photo: 'https://upload.wikimedia.org/wikipedia/en/d/d3/No-picture.jpg',
            open_now: 'Unknown'
        }
    }
    componentDidMount() {
        this.showModal(this.props.navigation.state.params.item)
    }
    showModal = async (item) => {
        this.setState({ visible: true })
        this.setState({ item })
        if (typeof item.photos !== 'undefined' && typeof item.photos[0].photo_reference !== "undefined") this.setState({ photo: 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + item.photos[0].photo_reference + '&key=AIzaSyC8IbulS0inF5dfJ0KfxgwEuQjk6u5DT4o' })
        if (typeof item.opening_hours !== 'undefined' && typeof item.opening_hours.open_now !== "undefined") {
            if (item.opening_hours.open_now) this.setState({ open_now: 'Open' })
            else this.setState({ open_now: 'Closed' })
        }
        this.setState({
            latitude: item.geometry.location.lat,
            longitude: item.geometry.location.lng
        })
        //console.log(this.state.photo)
        this.setState({ visible: false })
    }

    render() {
        let item = this.state.item
        return (
            <Container>
                <StatusBar
                    backgroundColor={mainColor}
                    barStyle="light-content"
                />
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />

                <Content>
                    <Card transparent style={{ borderColor: 'white' }}>
                        <CardItem>
                            <Left>
                                <Thumbnail source={{ uri: item.icon }} />
                                <Body>
                                    <Text>{item.name}</Text>
                                    <Text note>{item.vicinity}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem cardBody>
                            <Image source={{ uri: this.state.photo }} style={{ height: 200, width: null, flex: 1 }} />
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent>
                                    <Icon active name="ios-star" style={{ color: 'yellow' }} />
                                    <Text style={{ color: 'black' }}>{item.rating}</Text>
                                </Button>
                            </Left>
                            {/* <Body>
                                <Button transparent>
                                    <Icon active name="chatbubbles" />
                                    <Text>4 Comments</Text>
                                </Button>
                            </Body> */}
                            <Right>
                                <Button transparent>
                                    <Icon name='ios-log-in' />
                                    {this.state.open_now === 'Open' ?
                                        <Text style={{ color: 'green' }}>{this.state.open_now}</Text> :
                                        this.state.open_now === 'Close' ?
                                            <Text style={{ color: 'red' }}>{this.state.open_now}</Text> :
                                            <Text style={{ color: 'black' }}>{this.state.open_now}</Text>}
                                </Button>
                            </Right>
                        </CardItem>
                        <CardItem style={{ flex: 1, height: screenHeight * 0.4 }}>

                            <MapView.Animated
                                provider="google"
                                showsUserLocation={true}
                                showsCompass={true}
                                showsMyLocationButton={true}
                                followsUserLocation={true}
                                loadingEnabled={true}
                                toolbarEnabled={true}
                                zoomEnabled={true}
                                rotateEnabled={true}
                                region={{
                                    latitude: this.props.navigation.state.params.lat,
                                    longitude: this.props.navigation.state.params.lng,
                                    latitudeDelta: 0.03,
                                    longitudeDelta: 0.01
                                }}
                                style={StyleSheet.absoluteFill}
                            //onRegionChange={onRegionChange} >
                            >
                                <MapViewDirections
                                    strokeWidth={3}
                                    strokeColor="blue"
                                    origin={{
                                        latitude: this.props.navigation.state.params.lat,
                                        longitude: this.props.navigation.state.params.lng
                                    }}
                                    destination={{
                                        latitude: this.state.latitude,
                                        longitude: this.state.longitude,
                                    }}
                                    apikey='AIzaSyC9vBvydW5J7JJsnQS_do_tKmLlzdCHA4k'
                                />
                                <MapView.Marker
                                    coordinate={{
                                        latitude: this.state.latitude,
                                        longitude: this.state.longitude,
                                    }}
                                    pinColor='violet'
                                >
                                    
                                </MapView.Marker>
                            </MapView.Animated>

                        </CardItem>

                    </Card>
                </Content>
            </Container >


        );
    }
}
