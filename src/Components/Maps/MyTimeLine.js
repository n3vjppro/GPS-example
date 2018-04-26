import React, { Component, PureComponent } from 'react';
import { Animated, StyleSheet, View, PermissionsAndroid, Dimensions, DatePickerAndroid, FlatList, TouchableOpacity, Image, AsyncStorage } from 'react-native';
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
    Card, CardItem, Drawer
} from 'native-base';
import MapView from 'react-native-maps'
import DateTimePicker from 'react-native-modal-datetime-picker';
import haversine from 'haversine';
import Spinner from 'react-native-loading-spinner-overlay';
import LinearGradient from 'react-native-linear-gradient'
import { OptimizedFlatList } from 'react-native-optimized-flatlist'
import { mainColor } from '../Common/User'
const { height: screenHeight, width: screenWidth } = Dimensions.get('window')

let id = 1;
let idList = 0;
export default class MyTimeLine extends PureComponent {
    // scroll = new Animated.Value(0)
    // headerY = Animated.multiply(Animated.diffClamp(this.scroll, 0, 56), -1)
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
            },
            selectedRow: -1,
            curDate: new Date()

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
        fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location?id=3&&day=' + n, {
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

                //console.log(error);
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
    addMemberMarker(item) {
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
                    id: item.LocationId
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
                //console.log(this.state.markerInfor)
            })
            .catch((error) => {
                //console.log(error);
            })

    }

    //Date time picker
    // _showDateTimePicker = () => this.setState({ isDateTimePickerVisible: true });

    // _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    async _handleDatePicked(date1) {
        try {
            const { action, year, month, day } = await DatePickerAndroid.open({
                date: date1,
                maxDate: new Date()

            });
            if (action === DatePickerAndroid.dateSetAction) {
                this.setState({ visible: true })
                var bd = (month + 1) + "/" + day + "/" + year;
                this.setState({ curDate: new Date(year, month, day) })
                this.setState({ markers: [] })
                //var month = date.getMonth() + 1;
                //month+=1;

                console.log(bd)
                let dayApi = "http://ec2-52-87-221-34.compute-1.amazonaws.com/api/location?id=3&&day=" + bd;
                //this.setState({ textBirthDay: bd })
                //console.log('A date has been picked: ', this.state.textBirthDay);
                //this.setState({ visible: true })
                //this._hideDateTimePicker();
                fetch(dayApi, {
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
                        //this.setState({ markerInfor: responseJson.results[0].formatted_address })
                        this.setState({ markers: responseJson })
                        this.setState({ visible: false })
                    })
                    .catch((error) => {
                        console.log(error);
                        this.setState({ visible: false })
                    })
            }
        } catch ({ code, mess }) {

        }
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
        closeDrawer = () => {
            this.drawer._root.close()
        };
        openDrawer = () => {
            this.drawer._root.open()
        };
        return (
           
                <View style={{ flex: 1 }}>
                    <Header androidStatusBarColor={mainColor} style={{ backgroundColor: mainColor }}>
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
                                onPress={() => this._handleDatePicked(this.state.curDate)
                                }
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
                                        <View style={{}} >

                                            <View style={{ flexDirection: 'row', }}>
                                                <Text style={{ fontWeight: 'bold', flexWrap: 'wrap' }}>{marker.Description}</Text>
                                            </View>
                                            <Text >{marker.LastUpdate.slice(0, 19).replace('T', ' ')}</Text>
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

                                {/* </MapView.Callout> */}
                            </MapView.Marker>
                        </MapView>


                        <Spinner visible={this.state.visible} textContent={"Loading..."} textStyle={{ color: '#FFF' }} />
                    </View>
                    <View style={{ flex: 1, }}>
                        {this.state.markers.length === 0 ? <Text>No data for this day!</Text> :
                            <OptimizedFlatList
                                data={this.state.markers}
                                //numColumns={1}
                                //button={true}
                                //extraData={this.state}
                                renderItem={({ item, index }) =>

                                    <FlatListItem item={item} selectedRow={this.state.selectedRow} parentList={this} />
                                }
                                keyExtractor={(item) => item.LocationId}

                            >
                            </OptimizedFlatList>}
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

export class FlatListItem extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            selectedRow: this.props.selectedRow,
            prevSelectedRow: -1
        }
    }
    render() {
        const item = this.props.item;
        const index = this.props.index
        return (
            <ListItem avatar
                button={true}
                selected={true}
                onPress={() => {

                    this.setState({
                        selectedRow: item.LocationId
                    })
                    //console.log(this.state.selectedRow)
                    //console.log(item, index)
                    this.props.parentList.addMemberMarker(item)
                    // this.showMemberLocation(item.ID)
                    // this.setState({
                    //     prevSelectedRow: index
                    // })
                }}

            >
                <Left >
                    <Icon name='ios-locate-outline' />
                </Left>
                <Body >
                    <Text style={this.state.selectedRow === item.LocationId ? { fontWeight: 'bold' } : { fontWeight: 'normal' }} >{item.Description}</Text>
                    <Text  >Time: {item.LastUpdate.slice(0, 19).replace('T', ' ')} -+-{item.LocationId}</Text>
                </Body>

                {/* </Button> */}
                {/* <Text>{item.Name}</Text> */}
            </ListItem>
        );
    }
}