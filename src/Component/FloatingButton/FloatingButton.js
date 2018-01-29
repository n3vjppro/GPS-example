import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import styles, { buttonColor } from './styles';

const FloatingButton = (props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={props.onPress}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5
          }}
        >
          <Icon
            style={{ fontSize: 40 }}
            name={props.icon}
            color={buttonColor}
          /></View>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingButton;