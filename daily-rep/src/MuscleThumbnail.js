import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { bodyFront } from '../assets/muscles/bodyFront';
import { bodyBack } from '../assets/muscles/bodyBack';

// Local SVG paths keep thumbnails sharp and available without an internet connection.
export default function MuscleThumbnail({ parts, side = 'front' }) {
  const model = side === 'back' ? bodyBack : bodyFront;
  return <View style={styles.circle} accessible={false}>
    <Svg width={50} height={62} viewBox={side === 'back' ? '724 80 724 1320' : '0 80 724 1320'}>
      {model.flatMap(part => Object.values(part.path).flat().map((path, index) =>
        <Path key={`${part.slug}-${index}`} d={path} fill={parts.includes(part.slug) ? '#ed694d' : '#b7babd'} />
      ))}
    </Svg>
  </View>;
}

const styles = StyleSheet.create({
  circle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
});
