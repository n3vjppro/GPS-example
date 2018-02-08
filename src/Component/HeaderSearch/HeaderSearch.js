import React from 'react';
import { Button, Text, Header, Item, Input, Icon } from 'native-base';
import { Dimensions, Keyboard } from 'react-native';
import Colors from '../../Colors/Colors';
import Style from '../../StyleSheets/StyleHeaderSearch';
const { width, height } = Dimensions.get('window');
export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          textsearch:'',
        };
      }
    render() {
        return (
            <Header rounded
                style={Style.Header}
            >
                <Item style={Style.ItemSearch} >
                    <Icon name="ios-search" />
                    <Input placeholder="Search"
                    onEndEditing={()=>{this.props.search(this.state.textsearch)}}
                    onChangeText={text => this.setState({textsearch:text})}
                    />
                    <Icon name="ios-list" />
                </Item>
                <Button transparent
                    style={Style.ButtonSearch}
                    onPress={() => {
                        this.props.search(this.state.textsearch);
                        Keyboard.dismiss();
                        }}
                >
                    <Text style={Style.TextCenter} >Search</Text>
                </Button>
            </Header>
        );
    }
}