import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { exerciseCatalog } from './exerciseCatalog';
import MuscleThumbnail from './MuscleThumbnail';

export default function ExercisePicker({ onSelect }) {
  const [query, setQuery] = useState('');
  const [equipment, setEquipment] = useState('All equipment');
  const [muscle, setMuscle] = useState('All muscles');
  const [filter, setFilter] = useState(null);
  const equipmentOptions = ['All equipment', ...[...new Set(exerciseCatalog.map(e => e.equipment))].sort()];
  const muscleOptions = ['All muscles', ...[...new Set(exerciseCatalog.map(e => e.muscle))].sort()];
  const visible = exerciseCatalog.filter(exercise =>
    `${exercise.name} ${exercise.muscle} ${exercise.equipment}`.toLowerCase().includes(query.trim().toLowerCase()) &&
    (equipment === 'All equipment' || equipment === exercise.equipment) &&
    (muscle === 'All muscles' || muscle === exercise.muscle)
  ).sort((a, b) => a.name.localeCompare(b.name));

  return <View style={styles.container}>
    <View style={styles.search}>
      <Ionicons name="search-outline" color="#929295" size={22} />
      <TextInput accessibilityLabel="Search exercises" placeholder="Search exercise" placeholderTextColor="#929295" value={query} onChangeText={setQuery} style={styles.input} />
    </View>
    <View style={styles.filters}>
      {['equipment', 'muscle'].map(kind => <Pressable key={kind} accessibilityRole="button" accessibilityState={{ expanded: filter === kind }} onPress={() => setFilter(filter === kind ? null : kind)} style={styles.filter}>
        <Text style={styles.filterText}>{kind === 'equipment' ? equipment : muscle}</Text>
        <Ionicons name={filter === kind ? 'chevron-up' : 'chevron-down'} size={16} color="#929295" />
      </Pressable>)}
    </View>
    {filter && <ScrollView style={styles.options} keyboardShouldPersistTaps="handled">
      {(filter === 'equipment' ? equipmentOptions : muscleOptions).map(option => <Pressable key={option} accessibilityRole="button" onPress={() => { filter === 'equipment' ? setEquipment(option) : setMuscle(option); setFilter(null); }} style={styles.option}>
        <Text style={styles.name}>{option}</Text>
        {(filter === 'equipment' ? equipment : muscle) === option && <Ionicons name="checkmark" color="#f07842" size={20} />}
      </Pressable>)}
    </ScrollView>}
    <Text style={styles.section}>{visible.length} exercises</Text>
    <FlatList data={visible} keyExtractor={item => item.name} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.list}
      ListEmptyComponent={<Text style={styles.empty}>No matching exercises. Try another search or filter.</Text>}
      renderItem={({ item }) => <Pressable accessibilityRole="button" accessibilityLabel={`Add ${item.name}, ${item.muscle}, ${item.equipment}`} onPress={() => onSelect(item.name)} style={({ pressed }) => [styles.exercise, pressed && { opacity: 0.5 }]}>
        <MuscleThumbnail parts={item.parts} side={item.side} />
        <View style={styles.description}><Text style={styles.name}>{item.name}</Text><Text style={styles.muscle}>{item.muscle}</Text><Text style={styles.equipment}>{item.equipment}</Text></View>
        <Ionicons name="add-circle-outline" size={23} color="#f07842" />
      </Pressable>} />
  </View>;
}

const styles = StyleSheet.create({
  container: { flex: 1, width: '100%', maxWidth: 640, alignSelf: 'center' },
  search: { flexDirection: 'row', alignItems: 'center', gap: 10, marginHorizontal: 20, paddingHorizontal: 14, backgroundColor: '#1c1c1e', borderRadius: 10 },
  input: { flex: 1, minWidth: 0, minHeight: 50, color: '#fff', fontSize: 17 },
  filters: { flexDirection: 'row', gap: 12, margin: 20 },
  filter: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 12, minHeight: 48, borderRadius: 10, backgroundColor: '#1c1c1e' },
  filterText: { color: '#fff', fontSize: 14, flexShrink: 1 },
  options: { maxHeight: 210, marginHorizontal: 20, backgroundColor: '#1c1c1e', borderRadius: 10 },
  option: { padding: 14, flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  section: { color: '#929295', marginHorizontal: 20, marginVertical: 10, fontSize: 15 },
  list: { paddingBottom: 30 },
  exercise: { flexDirection: 'row', alignItems: 'center', gap: 16, marginHorizontal: 20, paddingVertical: 18, borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#303032' },
  description: { flex: 1, gap: 4 },
  name: { color: '#fff', fontSize: 17 },
  muscle: { color: '#aaa', fontSize: 15 },
  equipment: { color: '#929295', fontSize: 12 },
  empty: { color: '#929295', padding: 20, lineHeight: 22 },
});
