import React from 'react';
import { Button, Text, Header, Item, Input, Icon } from 'native-base';
import { Dimensions } from 'react-native';
import Colors from '../../Colors/Colors';
import Style from '../../StyleSheets/StyleHeaderSearch';
const { width, height } = Dimensions.get('window');
export default class Profile extends React.Component {
    render() {
        return (
            <Header rounded
                style={Style.Header}
            >
                <Item style={Style.ItemSearch} >
                    <Icon name="ios-search" />
                    <Input placeholder="Search"
                    />
                    <Icon name="ios-list" />
                </Item>
                <Button transparent
                    style={Style.ButtonSearch}
                >
                    <Text style={Style.TextCenter} >Search</Text>
                </Button>
            </Header>
        );
    }
}