import { StyleSheet } from 'react-native';
import Colors from '../Colors/Colors';
export default StyleSheet.create({
    container: {
        backgroundColor: Colors.FloatingButtonColor,
        height: 50,
        width: 50,
        borderRadius: 25,
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    IconCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    SizeIcon: {
        fontSize: 40
    }
});