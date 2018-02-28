import React from 'react';
import { Footer, FooterTab, Button, Text, View, Icon } from 'native-base';
import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
import Colors from '../../Colors/Colors';
import Styles from '../../StyleSheets/StyleTabBar';
export default class TabBar extends React.Component {
    choose = false;
    render() {
        return (
            <Footer>
                <FooterTab style={Styles.TabBar}>
                    <Button
                        style={{ backgroundColor: '#ffffff' }}
                        vertical
                        active={this.props.navigationState.index === 0}
                        onPress={() => this.props.navigation.navigate("Home")}>
                        <Icon name={(this.props.navigationState.index == 0) ? "ios-home" : "ios-home-outline"} />
                    </Button>
                    <Button
                        style={{ backgroundColor: '#ffffff' }}
                        vertical
                        active={this.props.navigationState.index === 1}
                        onPress={() => { this.props.navigation.navigate("Notifications") }}>
                        <Icon name={(this.props.navigationState.index == 1) ? "ios-notifications" : "ios-notifications-outline"} />
                    </Button>
                    <Button
                        style={{ backgroundColor: '#ffffff' }}
                        vertical
                        active={this.props.navigationState.index === 2}
                        onPress={() => { this.props.navigation.navigate("CameraArs") }}>
                        <View style={Styles.CameraAR} >
                            <Icon name={(this.props.navigationState.index == 2) ? "ios-camera" : "ios-camera-outline"} style={Styles.IconCamera} />
                        </View>
                    </Button>
                    <Button
                        style={{ backgroundColor: '#ffffff' }}
                        vertical
                        active={this.props.navigationState.index === 3}
                        onPress={() => this.props.navigation.navigate("Favorites")}>
                        <Icon name={(this.props.navigationState.index == 3) ? "ios-star" : "ios-star-outline"} />
                    </Button>
                    <Button
                        style={{ backgroundColor: '#ffffff' }}
                        vertical
                        active={this.props.navigationState.index === 4}
                        onPress={() => this.props.navigation.navigate("Accounts")}>
                        <Icon name={(this.props.navigationState.index == 4) ? "ios-person" : "ios-person-outline"} />
                    </Button>
                </FooterTab>
            </Footer>
        );
    }
}