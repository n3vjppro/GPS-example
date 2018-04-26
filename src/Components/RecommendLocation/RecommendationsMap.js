import MapView from 'react-native-maps'
import { BackHandler, Animated, StyleSheet, View, PermissionsAndroid, Image, TouchableOpacity, StatusBar, NativeModules, AsyncStorage, Promise, Dimensions, Alert } from 'react-native';
import React, { Component, PureComponent } from 'react';
import { Container, Header, Content, List, ListItem, Text, Left, Body, Button, Icon } from 'native-base';

import { mainColor } from '../Common/User'
import StarRatingBar from 'react-native-star-rating-view/StarRatingBar'
import Modal from 'react-native-modalbox';
import Spinner from 'react-native-loading-spinner-overlay';
import DetailPlace from './DetailPlace'
const { height: screenHeight, width: screenWidth } = Dimensions.get('window')
export default class RecommendationsMap extends Component {
    constructor(props) {
        super(props)
        this.state = {
            listLocations: [],
            // visible: true
            region: {
                latitude: 16.0635885,
                longitude: 108.2148742,
                latitudeDelta: 0.05,
                longitudeDelta: 0.04
            },
            image:''
        }
        let watchLoc = navigator.geolocation.getCurrentPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
                this.setState({
                    region: {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta: 0.04,
                        longitudeDelta: 0.04
                    }
                })
                console.log(position);
                this.getLocationsNearBy(position.coords.latitude, position.coords.longitude)

            },
            (error) => console.log(error),
            { enableHighAccuracy: true, timeout: 2000 }
        )
    }
    componentWillUnmount() {
        //navigator.geolocation.clearWatch(watchLoc)
    }
    componentDidMount() {

    }
    async getLocationsNearBy(lat, lng) {
        this.setState({ visible: true })
        await fetch('https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' + lat + ',' + lng + '&radius=1500&type=' + this.props.navigation.state.params.item.value + '&key=AIzaSyC8IbulS0inF5dfJ0KfxgwEuQjk6u5DT4o')
            .then((response) => response.json())
            .then((responseJson) => {

                this.setState({ listLocations: responseJson.results })
                //console.log(this.state.listLocations)
                if (responseJson.results.length === 0) alert('There is no ' + this.props.navigation.state.params.item.name + ' around you!')
               // this.setState({imageMarker:require('../../../assets/listMarkers/'+this.props.navigation.state.params.item.icon)})
                this.setState({ visible: false })

            })
            .catch((error) => {
                console.log(error);
                this.setState({ visible: false })
            })
    }

    render() {
        return (
            <Container>
                <Header androidStatusBarColor={mainColor} style={{ backgroundColor: mainColor }}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                            <Icon name="md-menu" />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{ color: 'white' }}>{this.props.navigation.state.params.item.name}s Nearby You</Text>
                    </Body>
                </Header>
                <View style={{ flex: 1 }}>
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
                        region={this.state.region}

                        style={StyleSheet.absoluteFill}
                    // onRegionChange={onRegionChange} >
                    >
                        {this.state.listLocations.map(marker => (
                            <MapView.Marker
                                coordinate={{
                                    latitude: marker.geometry.location.lat,
                                    longitude: marker.geometry.location.lng
                                }}
                                key={marker.id}
                            
                            >
                                <MapView.Callout
                                    //tooltip
                                    onPress={() => this.props.navigation.navigate('DetailPlace', { item: marker, lat:this.state.latitude, lng:this.state.longitude })}
                                >
                                    <View >
                                        <View style={{ flexDirection: 'row', }}>
                                            <Text style={{ fontWeight: 'bold', flexWrap: 'wrap' }}>{marker.name}</Text>
                                        </View>
                                        <Text >Address: {marker.vicinity}</Text>
                                        {/* {typeof marker.opening_hours !== "undefined" && typeof marker.opening_hours.open_now !== "undefined" ? <Text></Text> : <Text >Status: {marker.opening_hours.open_now ? 'open' : 'close'}</Text>} */}
                                        <StarRatingBar
                                            score={parseInt(marker.rating)}
                                            allowsHalfStars={true}
                                            accurateHalfStars={false}
                                        />
                                        <Text style={{ color: 'gray', fontStyle: 'italic' }}>Click to see more...</Text>
                                    </View>
                                </MapView.Callout>
                            </MapView.Marker>
                        ))}
                        {/* <Title styleName="h-center multiline" style={styles.mapHeader}>
                    {lookingFor ? `${lookingFor} in` : ''} {headerLocation}
                </Title>

                <MapView.Circle center={mapRegion}
                    radius={gpsAccuracy * 1.5}
                    strokeWidth={0.5}
                    strokeColor="rgba(66, 180, 230, 1)"
                    fillColor="rgba(66, 180, 230, 0.2)"
                />

                <MapView.Circle center={mapRegion}
                    radius={5}
                    strokeWidth={0.5}
                    strokeColor="rgba(66, 180, 230, 1)"
                    fillColor="rgba(66, 180, 230, 1)" 
                /> */}
                    </MapView.Animated>
                </View>
                <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />

            </Container >
        )
    }
}