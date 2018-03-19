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
import { StyleSheet, View, PermissionsAndroid, Image, Dimensions, Platform } from 'react-native';
import { TabNavigator, StackNavigator } from 'react-navigation';
import ModalAdd from './ModalAdd'
import Modal from 'react-native-modalbox'
export default class IndexManage extends Component {
    constructor(props) {
        super(props)
    }
    static navigationOptions = {

        header: null
    };
    componentDidMount() {
        ;
        this.props.navigation.setParams({
           
            handleModal: this._addModal.bind(this),
          
        })
    }
    _addModal = () => {
        this.refs.ModalAdd.showModal();
    }
    render() {
        return (
            <Container>
            <Header>
                <Left>
                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                        <Icon name="arrow-back" />
                    </Button>
                </Left>
                <Body>
                    <Text>Manage People</Text>
                </Body>
                <Right>
                    <Button transparent
                    onPress={() => this.props.navigation.state.params.handleModal()}
                    >
                        <Icon active name="md-add"></Icon>
                    </Button>
                </Right>
                
            </Header>
            <ModalAdd userId={'2'}  ref={'ModalAdd'} parentList={this}></ModalAdd>
            </Container>
        );
    }
}

