import React from 'react';
import { requireNativeComponent, Platform, StyleSheet } from 'react-native';
import { IosSwiper } from './ios-swiper';

/**
 * Composes `View`.
 *
 * - src: string
 * - borderRadius: number
 * - resizeMode: 'cover' | 'contain' | 'stretch'
 */

const SwiperComp =
  Platform === 'android' ? requireNativeComponent('RCTSwiper') : IosSwiper;

export const RnImageSwiper = props => {
  // TODO: я не уверен что сильно хорошая идея позволять устанавливать любые реактовские стили, поэтому пока не буду давать такой возможности
  const { onChange, style, ...restProps } = props;

  const proxyClearEventVal = e => {
    if (props.onChange) {
      props.onChange(e.nativeEvent.slideId);
    }
  };

  return (
    <SwiperComp
      {...restProps}
      onChange={proxyClearEventVal}
      style={styles.slider}
    />
  );
};

const styles = StyleSheet.create({
  slider: {
    minWidth: '100%',
    height: '100%',
  },
});
