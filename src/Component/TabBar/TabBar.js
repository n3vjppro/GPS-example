import React from 'react';
import { Footer, FooterTab, Button, Text, View, Icon } from 'native-base';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import Colors from '../../Colors/Colors';
import Styles from '../../StyleSheets/StyleTabBar';
export default class TabBar extends React.Component {
    render() {
        return (
            <Footer>
                <FooterTab style={Styles.TabBar}>
                    <Button
                        vertical
                        active={this.props.navigationState.index === 0}
                        onPress={() => this.props.navigation.navigate("Home")}>
                        <Icon name="home" />
                        <Text style={Styles.SizeText} >Home</Text>
                    </Button>
                    <Button
                        vertical
                        active={this.props.navigationState.index === 1}
                        onPress={() => this.props.navigation.navigate("Searchs")}>
                        <Icon name="search" />
                        <Text style={Styles.SizeText}>Search</Text>
                    </Button>
                    <Button
                        vertical
                        active={this.props.navigationState.index === 2}
                        onPress={() => this.props.navigation.navigate("CameraArs")}>
                        <View style={Styles.CameraAR} >
                            <Icon name="ios-camera" style={Styles.IconCamera} />
                        </View>
                    </Button>
                    <Button
                        vertical
                        active={this.props.navigationState.index === 3}
                        onPress={() => this.props.navigation.navigate("Favorites")}>
                        <Icon name="star" />
                        <Text style={Styles.SizeText}>Favorite</Text>
                    </Button>
                    <Button
                        vertical
                        active={this.props.navigationState.index === 4}
                        onPress={() => this.props.navigation.navigate("Account")}>
                        <Icon active name="person" />
                        <Text style={Styles.SizeText}>Account</Text>
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}