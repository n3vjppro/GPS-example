import PropTypes from 'prop-types';
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
            style={{ fontSize: 40, }}
            raised
            reverse
            name={props.icon || 'map'}
            type="font-awesome"
            color={buttonColor}
          /></View>
      </TouchableOpacity>
    </View>
  );
};

FloatingButton.propTypes = {
  icon: PropTypes.string,
  onPress: PropTypes.func,
};

export default FloatingButton;