import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { emberLetters, emberMark } from '../assets/brand/geometry';

export function EmberWordmark({ width = 116 }) {
  return <Svg width={width} height={width * 64 / 276} viewBox="0 0 276 64" accessible accessibilityLabel="EMBER">
    {emberLetters.map(letter => <G key={letter.x} transform={`translate(${letter.x},0)`}>
      <Path d={letter.path} fill="#f5f3ef" fillRule="evenodd" />
    </G>)}
  </Svg>;
}

export default function EmberLaunch() {
  return <View style={styles.launch} accessibilityLabel="EMBER is starting">
    <Svg width={104} height={120} viewBox="0 0 104 120" accessible={false}>
      <Path d={emberMark} fill="#f07842" fillRule="evenodd" />
    </Svg>
    <EmberWordmark width={208} />
  </View>;
}

const styles = StyleSheet.create({
  launch: { flex: 1, backgroundColor: '#000000', alignItems: 'center', justifyContent: 'center', gap: 30 },
});
