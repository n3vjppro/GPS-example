import React, { Component } from 'react';
import {
    Container,
    Header,
    Title,
    Content,
    Button,
    Icon,
    ListItem,
    Text,
    Left,
    Right,
    Body,
    Item
} from 'native-base';
import { StyleSheet, View, PermissionsAndroid, Image, Dimensions, Platform, FlatList, TouchableOpacity } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import ModalAdd from './ModalAdd'
import ModalJoin from './ModalJoin'

import Modal from 'react-native-modalbox'
export default class IndexManage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            groupList: []
        }
    }
    static navigationOptions = {

        header: null,
        tabBarIcon: ({ tintColor }) => {
            return <Icon name="md-people" style={{ color: tintColor }} />
        },
    };
    componentDidMount() {

        this.props.navigation.setParams({
            handleModalAdd: this._addModal.bind(this),
            handleModalJoin:this._joinModal.bind(this)


        })
        this.loadData(2)
    }

    async loadData(idUser) {

        await fetch('http://ec2-52-87-221-34.compute-1.amazonaws.com/api/GroupTracker/GetALlGroupOfUser/' + idUser, {
            method: 'GET',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'token': 'vjJZjABwEjPfT9KGmxelkp3CYEgsTJjVrPnRbWRWHTe4Ddy_4O26dqIfqgbQuiO6a4ZeW4EBRsPBl__UfgzeSnSahh1'
            },
        })
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({ groupList: [...this.state.groupList, ...responseJson.gr] })

                console.log(this.state)
            })
            .catch((error) => {

                console.log(error);
            })

    }

    _addModal = () => {
        this.refs.ModalAdd.showModal();
    }
    _joinModal=()=>{
        this.refs.ModalJoin.showModal();
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
                    <Body>
                        <Text>Manage People</Text>
                    </Body>
                    <Right>
                        <Button transparent
                            onPress={() => {
                                this.setState({groupList:[]})
                                this.loadData(2)}}
                        >
                            <Icon active name="refresh"></Icon>
                        </Button>

                        <Button transparent
                            onPress={() => this.props.navigation.state.params.handleModalAdd()}
                        >
                            <Icon active name="md-add"></Icon>
                        </Button>

                        <Button transparent
                            onPress={() => this.props.navigation.state.params.handleModalJoin()}
                        >
                            <Icon active name="md-person-add"></Icon>
                        </Button>

                    </Right>

                </Header>
                <ModalAdd userId={'2'} ref={'ModalAdd'} parentList={this}></ModalAdd>
                <ModalJoin userId={'2'}  ref={'ModalJoin'} parentList={this}></ModalJoin>
                

                <FlatList
                    data={this.state.groupList}
                    numColumns={1}
                    renderItem={({ item, index }) =>
                        // <View>
                        // <Text>{item.title}</Text>
                        // </View>
                        // }

                        //console.log(`item = ${JSON.stringify(item)}, index = ${index}`);
                        <FlatListItem item={item} index={index} />

                    }
                    keyExtractor={(item, index) => index}

                >

                </FlatList>

            </Container>
        );
    }
}

export class FlatListItem extends Component {
    render() {
        var { height, width } = Dimensions.get('window');
        //console.log("aaaa", this.props.grid)

        return (


            <View style={{
                flex: 1,
                flexDirection: 'column',
                backgroundColor: this.props.index % 2 == 0 ? 'mediumseagreen' : 'tomato',

            }}>
                <TouchableOpacity
                    onPress={
                        () => //alert('group', this.props.item.Name)
                            this.props.navigation.navigate('DetailMovie', { detail: this.props.item })

                    }

                >
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        justifyContent: 'space-between'
                    }}>
                        <Text style={styles.flatListItemTitle}  >{this.props.item.Name}</Text>
                        <Text style={styles.flatListItemDetail}  >Passcode: {this.props.item.PassCode}</Text>
                        <Text style={styles.flatListItemDetail}  >{this.props.item.IsFollow?"Manager":"Tracked"}</Text>

                    </View>

                    <View style={{
                        height: 1,
                        backgroundColor: 'white'
                    }}>

                    </View>
                </TouchableOpacity>
            </View>

        );
    }
}
const styles = StyleSheet.create({
    flatListItemTitle: {
        height: 35,
        color: 'black',
        padding: 3,
        fontSize: 20,
        fontWeight: 'bold',
        marginLeft: 5,

    },
    flatListItemSub: {
        color: 'white',
        padding: 3,
        fontSize: 14,
        fontWeight: 'bold',
    },
    flatListItemDetail: {
        color: 'white',
        padding: 3,
        fontSize: 14,

    }
});