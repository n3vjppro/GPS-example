import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { StackNavigator } from 'react-navigation';
import { Container, Header, Content, List, ListItem, Text, Left, Body, Icon, Button } from 'native-base';
//import Icon from 'react-native-vector-icons/FontAwesome';
import { mainColor } from '../Common/User'
import ListPlaces from './ListPlaces'
import DetailPlace from './DetailPlace'
import RecommendationsMap from './RecommendationsMap'
export class IndexRecommend extends Component {
    constructor(props) {
        super(props);
        this.state = {
            bgColor: [
                'red',
                'blue',
                'yellow',
                'green',
                'violet',
                'purple',
                'pink',
                'orange',
               
            ],
        }
    }
    _getRandomColor() {
        var item = this.state.bgColor[Math.floor(Math.random() * this.state.bgColor.length)];
        return item
    }
    render() {
        return (
            <Container>
                <Header androidStatusBarColor={mainColor} style={{ backgroundColor: mainColor }}>
                    <Left>
                        <Button transparent onPress={() => this.props.navigation.navigate('DrawerOpen')}>
                            <Icon name="md-menu" />
                        </Button>
                    </Left>
                    <Body>
                        <Text style={{ color: 'white' }}>Choose your place</Text>
                    </Body>


                </Header>
                <Content>
                    <List
                        dataArray={ListPlaces}
                        key={(item) => item.key}
                        button={true}
                        renderRow={(item) =>

                            <ListItem icon
                                button={true}
                                onPress={() => this.props.navigation.navigate('RecommendationsMap', { item: item })}
                            >
                                <Left>
                                    <Icon style={{ color: this._getRandomColor() }} name={item.icon} />
                                </Left>
                                <Body>
                                    <Text>{item.name}</Text>
                                </Body>
                            </ListItem>
                        }

                    >
                    </List>
                </Content>
            </Container>
        );
    }
}

export default recommendStack = StackNavigator({
    IndexRecommend: {
        screen: IndexRecommend
    },
    RecommendationsMap: {
        screen: RecommendationsMap
    },
    DetailPlace:{
        screen:DetailPlace
    }
}, {
        headerMode: 'none'
    }
)