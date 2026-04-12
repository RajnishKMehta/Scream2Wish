import React from 'react';
import { Image, ImageStyle, StyleSheet, View, ViewStyle } from 'react-native';

type ImageSource = number | { uri: string };

type Props = {
  source: ImageSource;
  fullScreen?: boolean;
  style?: ViewStyle;
  imageStyle?: ImageStyle;
};

export function ImageOverlay({
  source,
  fullScreen = false,
  style,
  imageStyle,
}: Props) {
  return (
    <View
      style={[styles.overlay, fullScreen && styles.fullScreen, style]}
      pointerEvents="none"
    >
      <Image
        source={source}
        style={[styles.image, imageStyle]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  } as ViewStyle,
  fullScreen: {
    bottom: 0,
  } as ViewStyle,
  image: {
    width: '100%',
    height: '100%',
  } as ImageStyle,
});
