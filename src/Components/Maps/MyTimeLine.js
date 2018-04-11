import React, { Component } from 'react';
import { Animated, StyleSheet, View, PermissionsAndroid, Dimensions, FlatList, TouchableOpacity, Image, AsyncStorage } from 'react-native';
import { StackNavigator } from 'react-navigation';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    List,
    ListItem,
    Text,
    Left,
    Right,
    Body,
    Item,
    Card, CardItem
} from 'native-base';
import MapView from 'react-native-maps'
import DateTimePicker from 'react-native-modal-datetime-picker';
import haversine from 'haversine';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient'
const { height: screenHeight, width: screenWidth } = Dimensions.get('window')

let id = 1;
export default class MyTimeLine extends Component {
    scroll = new Animated.Value(0)
    headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, 56), -1)
    static navigationOptions = {
        tabBarIcon: ({ tintColor }) => {
            return <Image source={require('../../../assets/loc-his.png')} style={{ width: 24, height: 24, tintColor: tintColor }} />
        },
        title: 'My Timeline'

    };

    constructor(props) {
        super(props);
        this.state = {
            listLoctions: [],
            // markers:[{coordinate:{
            //     latitude,
            //     longitude
            // }}]
            markers: [],
            markerInfor: '',
            visible: true,
            memMarker: {
                latitude: 0,
                longitude: 0
            }

        }

        // navigator.geolocation.getCurrentPosition(
        //     (position) => {
        //         this.setState({ latitude: position.coords.latitude, longitude: position.coords.longitude })
        //         console.log(position);
        //         alert('lat: ' + position.coords.latitude + ' long: ' + position.coords.longitude)
        //     },
        //     (error) => console.log(new Date(), error),
        //     { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
        // );
    }
    getLocation(userid, latitude, longitude, LastUpdate) {
        this.setState({ visible: true })
        var d = new Date();
        var tzoffset = (new Date()).getTimezoneOffset() * 60000;
        var n = new Date(d - tzoffset).toISOString().slice(0, 19).replace('T', ' ');
        console.log('fetch', n)
        fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location?id=2&&day=' + n, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {

                //console.log(responseJson)

                this.setState({ markers: responseJson, visible: false })
                if (responseJson !== null) this.onRegionChange(responseJson)
                // markers = responseJson
                // let id = 0
                // responseJson.forEach(element => {

                //     this.setState({
                //         markers: [{

                //                 coordinates: {
                //                     latitude: element.Latitude,
                //                     longitude: element.Longitude
                //                 }

                //         }],
                //         //ladAddedMarker: now
                //     });
                // },
                //console.log(responseJson)
                // );



            })
            .catch((error) => {

                console.log(error);
                this.setState({ visible: false })
            })

    }
    addMarker(region) {
        //let now = (new Date).getTime();
        //if (this.state.ladAddedMarker > now - 5000) { return; }
        this.setState({
            markers: [
                ...this.state.markers, {
                    coordinate: region,
                }
            ],
            //ladAddedMarker: now
        });


    }
    addMemberMarker(item, id) {
        //console.log(lat,"asd", long)
        //let now = (new Date).getTime();
        //if (this.state.ladAddedMarker > now - 5000) { return; }
        this.setState({
            memMarker:
                {
                    latitude: item.Latitude,
                    longitude: item.Longtitude,
                    des: item.Description,
                    bat: item.Battery,
                    LastUpdate: item.LastUpdate,
                    id
                }
            ,
            //ladAddedMarker: now
        });
        this.setState({
            region: {

                latitude: item.Latitude,
                longitude: item.Longtitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,

            }
        })

    }
    async markerClick(latitude, longitude) {

        let latlng = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latitude + "," + longitude + "&sensor=true&key=AIzaSyBAKmIRhHy16oixr-Suxus0p7fkZqs2e7w"
        await fetch(latlng).then((response) => response.json())
            .then((responseJson) => {
                this.setState({ markerInfor: responseJson.results[0].formatted_address })
                console.log(this.state.markerInfor)
            })
            .catch((error) => {
                console.log(error);
            })

    }

    //Date time picker
    _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({ curDate: date })
        this.setState({ markers: [] })
        var month = date.getMonth() + 1;
        var bd = month + "/" + date.getDate() + "/" + date.getFullYear();
        console.log(bd)
        let dayApi = "http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location?id=2&&day=" + bd;
        //this.setState({ textBirthDay: bd })
        //console.log('A date has been picked: ', this.state.textBirthDay);
        this.setState({ visible: true })
        this._hideDateTimePicker();
        fetch(dayApi, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
        }).then((response) => response.json())
            .then((responseJson) => {
                //this.setState({ markerInfor: responseJson.results[0].formatted_address })
                this.setState({ markers: responseJson })
                this.setState({ visible: false })
            })
            .catch((error) => {
                console.log(error);
                this.setState({ visible: false })
            })
    };
    onRegionChange(region) {

        this.setState({
            region: {

                latitude: region[0].Latitude,
                longitude: region[0].Longtitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,

            }
        })
    }
    componentDidMount() {
        this.setState({
            region: {
                latitude: 16.0585026,
                longitude: 108.2199589,
                latitudeDelta: 0.09,
                longitudeDelta: 0.09
            }
        })
        this.getLocation()
        // this.onRegionChange()

    }
    getInitialState() {
        return {
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            },
        };
    }
    render() {
        return (

            // <Container style={StyleSheet.absoluteFill}>
            //     <DateTimePicker
            //         date={this.state.curDate}
            //         isVisible={this.state.isDateTimePickerVisible}
            //         maximumDate={new Date()}
            //         onConfirm={this._handleDatePicked}
            //         onCancel={this._hideDateTimePicker}
            //     />
            //     <Header>
            //         <Left>
            //             <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
            //                 <Icon name="md-menu" />
            //             </Button>
            //         </Left>
            //         <Body><Text style={{ color: 'white' }}>My Timeline</Text></Body>
            //         <Right>
            //             <Button
            //                 transparent
            //                 style={styles.reLoadMap}
            //                 onPress={() => {
            //                     this.setState({ curDate: new Date() })
            //                     this.getLocation()
            //                 }}
            //             >
            //                 <Image source={require('../../../assets/today.png')} style={{ width: 20, height: 20 }} tintColor='white' />

            //             </Button>
            //             <Button
            //                 transparent
            //                 style={styles.reLoadMap}
            //                 onPress={this._showDateTimePicker}
            //             >
            //                 <Icon style={{ width: 20, height: 20 }} name="md-calendar" />
            //                 {/* <Text >Timeline</Text> */}
            //             </Button>
            //         </Right>
            //     </Header>

            //     <Animated.ScrollView scrollEventThrottle={5}
            //         showsVerticalScrollIndicator={false}
            //         style={{ zIndex: 0 }}
            //         onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: this.scroll } } }], { useNativeDriver: true })}>
            //         <Animated.View style={{
            //             height: screenHeight * 0.8,
            //             width: '100%',
            //             transform: [{ translateY: Animated.multiply(this.scroll, 0.5) }]
            //         }}>
            //             <MapView style={StyleSheet.absoluteFill}
            //                 provider="google"
            //                 //showsUserLocation={true}
            //                 showsMyLocationButton={true}
            //                 showsCompass={true}
            //                 followsUserLocation={true}
            //                 region={this.state.region}
            //             // onRegionChange={this.onRegionChange}
            //             >

            //                 <MapView.Marker
            //                     coordinate={{
            //                         latitude: this.state.memMarker.latitude,
            //                         longitude: this.state.memMarker.longitude
            //                     }}
            //                     key={id++}
            //                     pinColor={'violet'}
            //                 // description={marker.description}
            //                 // onCalloutPress={() => {
            //                 //      this.markerClick(marker.Latitude, marker.Longtitude)
            //                 // }
            //                 //}
            //                 />

            //                 {this.state.markers.map(marker => (

            //                     <MapView.Marker
            //                         coordinate={{
            //                             latitude: marker.Latitude,
            //                             longitude: marker.Longtitude
            //                         }}
            //                         key={id++}
            //                     // description={marker.description}
            //                     // onCalloutPress={() => {
            //                     //      this.markerClick(marker.Latitude, marker.Longtitude)
            //                     // }
            //                     //}
            //                     >
            //                         <MapView.Callout
            //                             onPress={() => {
            //                                 this.setState({ miniMarker: marker })
            //                                 console.log(marker)
            //                             }}
            //                         //tooltip
            //                         >
            //                             <View style={{ width: screenWidth * 0.9 }} >
            //                                 <Text >{marker.LastUpdate}</Text>
            //                                 <Text style={{ fontWeight: 'bold', flexWrap: "wrap" }}>{marker.Description}</Text>
            //                             </View>
            //                         </MapView.Callout>
            //                     </MapView.Marker>
            //                 ))}
            //             </MapView>
            //         </Animated.View>
            //         <View style={{ position: 'absolute', height: screenHeight, width: '100%' }}>
            //             <LinearGradient
            //                 colors={['rgba(245,245,245,0.0)', 'rgba(245,245,245,0.35)', 'rgba(245,245,245,1)']}
            //                 locations={[0, 0.7, 1]}
            //                 style={StyleSheet.absoluteFill} />
            //         </View>
            //         <View style={{
            //             height: screenHeight * 0.5,
            //             transform: [{ translateY: -100 }],
            //             width: screenWidth,
            //             //paddingHorizontal: 30,
            //             //paddingVertical: 20,
            //             backgroundColor: 'transparent',

            //         }}>
            //             <View style={{ ...StyleSheet.absoluteFillObject, top: 100, backgroundColor: 'rgb(245,245,245)' }} />

            //             <Card style={{ flex: 1 }}>
            //                 {this.state.markers.length === 0 ? <Text>No data for this day!</Text> :
            //                     <List
            //                         dataArray={this.state.markers}
            //                         //numColumns={1}
            //                         button={true}
            //                         renderRow={(item) =>

            //                             <ListItem avatar
            //                                 button={true}
            //                                 onPress={() => {
            //                                     this.setState({
            //                                         memMarker: {
            //                                             latitude: item.Latitude,
            //                                             longitude: item.Longtitude
            //                                         }
            //                                     })
            //                                     // this.showMemberLocation(item.ID)

            //                                 }}
            //                             >
            //                                 <Left>
            //                                     <Icon name='ios-locate-outline' />
            //                                 </Left>
            //                                 <Body>
            //                                     <Text  >{item.Description}</Text>
            //                                     <Text  >Time: {item.LastUpdate}</Text>
            //                                     <Text>Battery: {item.Battery}%</Text>
            //                                 </Body>

            //                                 {/* </Button> */}
            //                                 {/* <Text>{item.Name}</Text> */}
            //                             </ListItem>
            //                         }
            //                     //keyExtractor={(item, index) => index}
            //                     >
            //                     </List>}
            //             </Card>
            //             {/* <Content>
            //                 <Card>

            //                     <CardItem>
            //                         <Body>
            //                             <Text>
            //                                 adds
            //                             </Text>
            //                         </Body>
            //                     </CardItem>
            //                     <CardItem footer>
            //                         <Text>asd</Text>
            //                     </CardItem>
            //                 </Card>
            //             </Content> */}
            //         </View>
            //     </Animated.ScrollView>
            //     <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />


            // </Container>


            <View style={{ flex: 1 }}>
                <DateTimePicker
                    date={this.state.curDate}
                    isVisible={this.state.isDateTimePickerVisible}
                    maximumDate={new Date()}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />
                <Header>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                            <Icon name="md-menu" />
                        </Button>
                    </Left>
                    <Body><Text style={{ color: 'white' }}>My Timeline</Text></Body>
                    <Right>
                        <Button
                            transparent
                            style={styles.reLoadMap}
                            onPress={() => {
                                this.setState({ curDate: new Date() })
                                this.getLocation()
                            }}
                        >
                            <Image source={require('../../../assets/today.png')} style={{ width: 20, height: 20 }} tintColor='white' />

                        </Button>
                        <Button
                            transparent
                            style={styles.reLoadMap}
                            onPress={this._showDateTimePicker}
                        >
                            <Icon style={{ width: 20, height: 20 }} name="md-calendar" />
                            {/* <Text >Timeline</Text> */}
                        </Button>
                    </Right>
                </Header>
                <View style={{ width: screenWidth, height: screenHeight * 0.5 }} >
                    <MapView style={StyleSheet.absoluteFill}
                        provider="google"
                        //showsUserLocation={true}
                        showsMyLocationButton={true}
                        showsCompass={true}
                        followsUserLocation={true}
                        region={this.state.region}
                    // onRegionChange={this.onRegionChange}
                    >
                        {this.state.markers.map(marker => (
                            <MapView.Marker
                                coordinate={{
                                    latitude: marker.Latitude,
                                    longitude: marker.Longtitude
                                }}
                                key={id++}
                            // description={marker.description}
                            // onCalloutPress={() => {
                            //      this.markerClick(marker.Latitude, marker.Longtitude)
                            // }
                            //}
                            >
                                <MapView.Callout
                                //tooltip
                                >
                                    <View >
                                        <Text >{marker.LastUpdate}</Text>
                                        <Text style={{ fontWeight: 'bold' }}>{marker.Description}</Text>
                                    </View>
                                </MapView.Callout>
                            </MapView.Marker>
                        ))}

                        <MapView.Marker
                            coordinate={{
                                latitude: this.state.memMarker.latitude,
                                longitude: this.state.memMarker.longitude
                            }}
                            key={this.state.memMarker.id}
                            pinColor={'green'}

                        >
                            {/* <MapView.Callout
                            
                            > */}
                            <Card >
                                <CardItem>
                                    <Text style={{ fontWeight: 'bold' }}>{this.state.memMarker.des}</Text>
                                </CardItem>
                                <CardItem>
                                    <Icon style={{width:24, height:24}} name="ios-clock-outline" />
                                    <Text >{this.state.memMarker.LastUpdate}</Text>
                                </CardItem>
                                <CardItem>
                                    <Icon style={{width:24, height:24}} name="md-battery-dead" />
                                    <Text >{this.state.memMarker.bat}%</Text>
                                </CardItem>
                            </Card>
                            {/* </MapView.Callout> */}
                        </MapView.Marker>
                    </MapView>


                    <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
                </View>
                <View style={{ flex: 1, }}>
                    {this.state.markers.length === 0 ? <Text>No data for this day!</Text> :
                        <FlatList
                            data={this.state.markers}
                            //numColumns={1}
                            //button={true}

                            renderItem={({ item, index }) =>

                                <ListItem avatar
                                    button={true}
                                    onPress={() => {
                                        //console.log(item, index)
                                        this.addMemberMarker(item, index)
                                        // this.showMemberLocation(item.ID)

                                    }}
                                >
                                    <Left>
                                        <Icon name='ios-locate-outline' />
                                    </Left>
                                    <Body>
                                        <Text  >{item.Description}</Text>
                                        <Text  >Time: {item.LastUpdate}</Text>
                                        <Text>Battery: {item.Battery}%</Text>
                                    </Body>

                                    {/* </Button> */}
                                    {/* <Text>{item.Name}</Text> */}
                                </ListItem>
                            }
                            keyExtractor={(item, index) => index}

                        >
                        </FlatList>}
                </View>
            </View >
        );
    }
}
const styles = StyleSheet.create({
    map: {
        ...StyleSheet.absoluteFillObject, padding: 1, marginLeft: 1, top: 0, left: 0, right: 0, bottom: -25, flex: 1
        //marginTop:50,
    },
    reLoadMap: {

        top: 0,
        left: 0,
        margin: 5,
        width: 50,

    }
})