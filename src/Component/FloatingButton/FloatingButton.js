import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';
import Styles from '../../StyleSheets/StyleFloatingButton';

const FloatingButton = (props) => {
  return (
    <View style={Styles.container}>
      <TouchableOpacity
        onPress={props.onPress}>
        <View
          style={Styles.IconCenter}
        >
          <Icon
            style={Styles.SizeIcon}
            name={props.icon}
          /></View>
      </TouchableOpacity>
    </View>
  );
};

export default FloatingButton;