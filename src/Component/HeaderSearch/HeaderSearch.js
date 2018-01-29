import React from 'react';
import { Button, Text, Header, Item, Input,Icon } from 'native-base';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
export default class Profile extends React.Component {
    render() {
        return (
            <Header rounded
                style={{ backgroundColor: '#ffffff' }}
            >
                <Item style={{ width: width * 0.7, height: height * 0.05, marginTop: 10, borderRadius: 10, backgroundColor: '#f2f2f2' }} >
                    <Icon name="ios-search" />
                    <Input placeholder="Search"
                    />
                    <Icon name="ios-list" />
                </Item>
                <Button transparent
                    style={{backgroundColor: '#f2f2f2', height: height * 0.05,borderRadius:10,width: width * 0.25,marginLeft:7}}
                >
                    <Text style={{ color: '#0066ff', alignItems:'center' }} >Search</Text>
                </Button>
            </Header>
        );
    }
}