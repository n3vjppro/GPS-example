import React from 'react';
import { Footer, FooterTab, Button, Text, View, Header, Item, Input,Icon } from 'native-base';
import { Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
export default class Profile extends React.Component {
    render() {
        return (
            <Footer>
                    <FooterTab style={{backgroundColor: '#ffffff'}}>
                        <Button
                            vertical
                            active={this.props.navigationState.index === 0}
                            onPress={() => this.props.navigation.navigate("Home")}>
                            <Icon name="home" />
                            <Text style={{fontSize: 10}} >Home</Text>
                        </Button>
                        <Button
                            vertical
                            active={this.props.navigationState.index === 1}
                            onPress={() => this.props.navigation.navigate("Searchs")}>
                            <Icon name="search" />
                            <Text style={{fontSize: 10}}>Search</Text>
                        </Button>
                        <Button
                            vertical
                            active={this.props.navigationState.index === 2}
                            onPress={() => this.props.navigation.navigate("CameraArs")}>
                            <Icon name="ios-camera" />
                            <Text style={{fontSize: 10}}>AR</Text>
                        </Button>
                        <Button
                            vertical
                            active={this.props.navigationState.index === 3}
                            onPress={() => this.props.navigation.navigate("Favorites")}>
                            <Icon name="star" />
                            <Text style={{fontSize: 10}}>Favorite</Text>
                        </Button>
                        <Button
                            vertical
                            active={this.props.navigationState.index === 4}
                            onPress={() => this.props.navigation.navigate("Account")}>
                            <Icon active name="person" />
                            <Text style={{fontSize: 10}}>Account</Text>
                        </Button>
                    </FooterTab>
                </Footer>
        );
    }
}