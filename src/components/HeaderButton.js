import React from 'react';
import {TouchableOpacity, Image} from 'react-native';
import {AppIcon} from '../AppStyles';

export default class HeaderButton extends React.Component {
  render() {
    return (
      <TouchableOpacity style={AppIcon.container} onPress={this.props.onPress}>
        <Image style={AppIcon.style} source={this.props.icon} />
      </TouchableOpacity>
    );
  }
}
