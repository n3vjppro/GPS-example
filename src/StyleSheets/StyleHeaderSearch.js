import { StyleSheet, Dimensions } from 'react-native';
const { width, height } = Dimensions.get('window');
import Colors from '../Colors/Colors';

export default StyleSheet.create({
    Header: {
        backgroundColor: Colors.HeaderColor,
    },
    ItemSearch: {
        width: width * 0.7, height: height * 0.05, marginTop: 10, borderRadius: 10, backgroundColor: Colors.BackgroundInputColor
    },
    ButtonSearch: {
        backgroundColor: Colors.BackgroundInputColor, height: height * 0.05, borderRadius: 10, width: width * 0.25, marginLeft: 7
    },
    TextCenter: {
        color: Colors.TextHandle, alignItems: 'center'
    }
});