import React, { Component } from 'react';
import {
    StyleSheet, Text, View, PermissionsAndroid,
    TouchableWithoutFeedback, StatusBar,
    TextInput, SafeAreaView, Keyboard, TouchableOpacity,
    KeyboardAvoidingView, Image,
} from 'react-native';

export default class VirtualLocation extends Component {
    constructor(props){
        super(props);
        this.state={
            distance: 0,
            speed: 0,
            direction: 'NE',
        }
        // setInterval(()=>{
        //     this.setState({
        //         distance: Math.random()*100,
        //         speed: Math.random()*15,
        //         direction: this.state.direction==='N'?'NW':'N',
        //     });
        // }, 1000)
    }
    render() {
        return (
            <View style={{
                //position:'absolute',
                left:0,bottom:0,right:0,
                flexDirection:'row',
                flex:1,
                //marginBottom:50
                backgroundColor:'rgba(255,255,255,0.5)',
                paddingVertical:15,
               
            }}>
                <View style={{flex:1}}>
                    <Text style={styles.titleText}>Distance</Text>
                    <Text style={styles.detailText}>{this.state.distance.toFixed(2)+' m'}</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={styles.titleText}>Speed</Text>
                    <Text style={styles.detailText}>{this.state.speed.toFixed(2)+ ' km/h'}</Text>
                </View>
                <View style={{flex:1}}>
                    <Text style={styles.titleText}>Direct</Text>
                    <Text style={styles.detailText}>{this.state.direction}</Text>
                </View>
            </View>
        );
    }
}

const styles= StyleSheet.create({
    titleText:{
        textAlign:'center',
        fontWeight:'700',
        color:'#666'
    },
    detailText:{
        textAlign:'center',
        fontWeight:'200',
        fontSize:20,
    }
})