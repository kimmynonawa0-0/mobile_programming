import React from 'react';
import Svg, { Circle, G, Path } from 'react-native-svg';

// Original line drawings, kept as vectors to stay sharp on different phones.
export default function RoutineIcon({ type, size = 52 }) {
  return <Svg width={size} height={size} viewBox="0 0 64 64" accessible={false}>
    <G fill="none" stroke="#f5f3ef" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
      {type === 'bench-press' && <>
        <Circle cx={12} cy={38} r={5} />
        <Path d="M20 41 H39 L49 45 L53 56 H59 M24 40 L27 31 V17 M35 40 L40 31 V17 M7 47 H43 M13 47 V57 M39 47 V57" />
        <Path d="M18 14 H49 M21 8 V20 M46 8 V20 M17 10 V18 M50 10 V18" stroke="#f07842" />
      </>}
      {type === 'pull-up' && <>
        <Path d="M8 9 H56 M8 9 V17 M56 9 V17" stroke="#f07842" />
        <Circle cx={32} cy={21} r={5} />
        <Path d="M16 10 L14 22 L23 31 L25 43 H39 L41 31 L50 22 L48 10 M23 31 L27 28 H37 L41 31 M25 43 L24 53 L29 59 M39 43 L40 53 L35 59" />
      </>}
      {type === 'arm' && <>
        <Path d="M10 44 L17 25 L20 13 Q21 9 25 10 L33 12 L34 19 L26 21 L25 32 Q34 26 42 32 Q48 29 53 35 L56 46 Q47 55 31 54 Q17 54 10 44 Z" />
        <Path d="M25 32 L22 38 M30 38 Q36 30 43 38 M42 45 Q48 44 50 40" stroke="#f07842" />
      </>}
      {type === 'thighs' && <>
        <Path d="M19 7 L16 23 Q14 35 20 54 L28 54 L32 29 L36 54 L44 54 Q50 35 48 23 L45 7 M18 17 Q32 23 46 17 M27 23 L32 29 L37 23" />
        <Path d="M21 27 Q18 38 23 47 M27 29 L25 46 M43 27 Q46 38 41 47 M37 29 L39 46" stroke="#f07842" />
      </>}
    </G>
  </Svg>;
}
