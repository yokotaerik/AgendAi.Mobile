import React, { useEffect } from 'react';
import { StyleSheet, View, Animated, Easing } from 'react-native';
import { theme } from '../../styles/theme';

export const SplashScreen = () => {
  const scale = new Animated.Value(0.3);
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(scale, {
        toValue: 1,
        duration: 1000,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../../assets/logo.png')}
        style={[
          styles.logo,
          {
            transform: [{ scale }],
            opacity
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  }
});