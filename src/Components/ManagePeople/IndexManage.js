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

export default class IndexManage extends Component {
    constructor(props) {
        super(props)
    }
    static navigationOptions = {

        header: null
    };
    render() {
        return (
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
                    <Button transparent>
                        <Icon active name="md-add"></Icon>
                    </Button>
                </Right>
            </Header>
        );
    }
}