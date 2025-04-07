import React, { useEffect } from 'react';
import { Animated } from 'react-native';

interface FadeInViewProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: any;
}

export const FadeInView: React.FC<FadeInViewProps> = ({
  children,
  duration = 500,
  delay = 0,
  style
}) => {
  const opacity = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true
    }).start();
  }, []);

  return (
    <Animated.View style={[style, { opacity }]}>
      {children}
    </Animated.View>
  );
};