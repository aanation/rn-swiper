import React from 'react';
import {requireNativeComponent} from 'react-native';

/**
 * Composes `View`.
 *
 * - src: string
 * - borderRadius: number
 * - resizeMode: 'cover' | 'contain' | 'stretch'
 */

const RCTAndroidSwiper = requireNativeComponent('RCTSwiper');

export const AndroidSwiper = props => {
  const {onChange, ...restProps} = props;

  const proxyClearEventVal = e => {
    if (props.onChange) {
      props.onChange(e.nativeEvent.slideId);
    }
  };

  return <RCTAndroidSwiper {...restProps} onChange={proxyClearEventVal} />;
};
