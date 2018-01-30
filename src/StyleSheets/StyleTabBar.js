import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../Colors/Colors';
const { width, height } = Dimensions.get('window');
export default StyleSheet.create({
    SizeText: {
        fontSize: 10
    },
    TabBar: {
        backgroundColor: Colors.TabBarColor
    },
    CameraAR: {
        height: width * 0.12, width: width * 0.12, borderRadius: width * 0.06, backgroundColor: Colors.CycleCameraColor, justifyContent: 'center',
        alignItems: 'center',
    },
    IconCamera:{
        fontSize: width * 0.10 
    }
});