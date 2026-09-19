import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { newExercise, summarize, finishSession } from './src/workouts';

import ExercisePicker from './src/ExercisePicker';
import EmberLaunch, { EmberWordmark } from './src/EmberBrand';

const KEY = 'daily-rep-v1';
const Context = createContext(null);
const Tabs = createBottomTabNavigator();
const colors = { bg: '#000000', card: '#1c1c1e', blue: '#f07842', muted: '#929295', text: '#ffffff' };
function Icon({ name, size = 22, color = colors.text }) { return <Ionicons name={name} size={size} color={color} />; }
function Button({ title, onPress, secondary, disabled, icon }) {
  return <Pressable accessibilityRole="button" accessibilityLabel={title} disabled={disabled} onPress={onPress} style={({ pressed }) => [s.button, secondary && s.secondary, (pressed || disabled) && { opacity: 0.5 }]}>
    {icon && <Icon name={icon} />}<Text style={s.buttonText}>{title}</Text>
  </Pressable>;
}
function Input(props) { return <TextInput placeholderTextColor={colors.muted} selectionColor={colors.blue} {...props} style={[s.input, props.style]} />; }
function Header({ eyebrow, title, subtitle }) { return <View style={s.header}><EmberWordmark /><Text style={s.title}>{title}</Text>{eyebrow && <Text style={s.muted}>{eyebrow}</Text>}{subtitle && <Text style={s.muted}>{subtitle}</Text>}</View>; }
function Stats({ items }) { return <View style={s.row}>{items.map(([value, label]) => <View key={label} style={s.stat}><Text style={s.statValue}>{value}</Text><Text style={s.muted}>{label}</Text></View>)}</View>; }
function Empty({ icon, title, text }) { return <View style={s.empty}><Icon name={icon} size={44} color={colors.muted} /><Text style={s.muted}>{title}</Text>{text && <Text style={[s.muted, { textAlign: 'center' }]}>{text}</Text>}</View>; }
function Sheet({ visible, title, onClose, children }) {
  return <Modal visible={visible} animationType="slide" onRequestClose={onClose}><SafeAreaView style={s.screen}><KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><View style={[s.row, s.sheetHeader]}><Text style={[s.heading, s.flex]}>{title}</Text><Button title="Close" secondary onPress={onClose} /></View>{children}</KeyboardAvoidingView></SafeAreaView></Modal>;
}

function Workout({ navigation }) {
  const { data, commit, busy, setNotice } = useContext(Context);
  const [draft, setDraft] = useState(null);
  const [picker, setPicker] = useState(false);
  const [discard, setDiscard] = useState(false);
  const [error, setError] = useState('');
  const updateExercise = (id, fn) => setDraft(current => ({ ...current, exercises: current.exercises.map(e => e.id === id ? fn(e) : e) }));
  const start = (routine = []) => { setError(''); setNotice(''); setDraft({ id: String(Date.now()), startedAt: new Date().toISOString(), name: '', exercises: routine.map(newExercise) }); };
  async function save() {
    try {
      const session = finishSession(draft);
      if (await commit({ ...data, sessions: [session, ...data.sessions] })) { setDraft(null); setNotice('Workout saved.'); navigation.navigate('History'); }
    } catch (e) { setError(e.message); }
  }
  return <SafeAreaView edges={['top']} style={s.screen}><KeyboardAvoidingView style={s.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}><ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
    <Header title={draft ? 'Current workout' : 'Workout'} />
    {!draft ? <>
      <Pressable accessibilityRole="button" onPress={() => start()} style={s.startButton}><Icon name="add" size={28} /><Text style={s.actionText}>Start Empty Workout</Text></Pressable>
      <Text style={s.sectionTitle}>Routines</Text>
      <View style={s.routines}>
        <Pressable accessibilityRole="button" accessibilityLabel="Start Bodyweight routine" onPress={() => start(['Push-ups', 'Squats', 'Lunges'])} style={s.routine}><Icon name="body-outline" size={30} /><Text style={s.routineTitle}>Bodyweight</Text><Text style={s.muted}>3 exercises</Text></Pressable>
        <Pressable accessibilityRole="button" accessibilityLabel="Start With equipment routine" onPress={() => start(['Bench press', 'Dumbbell row', 'Bicep curls'])} style={s.routine}><Icon name="barbell-outline" size={30} /><Text style={s.routineTitle}>With equipment</Text><Text style={s.muted}>3 exercises</Text></Pressable>
      </View>
    </> : <>
      <Input accessibilityLabel="Workout name" placeholder="Workout name (optional)" value={draft.name} maxLength={60} onChangeText={name => setDraft({ ...draft, name })} />
      <Text style={s.muted}>Enter reps and optional weight, then check off each completed set. Only checked sets are saved.</Text>
      {draft.exercises.map(exercise => <View key={exercise.id} style={s.card}>
        <View style={s.row}><Text style={[s.heading, s.flex]}>{exercise.name}</Text><Pressable accessibilityRole="button" accessibilityLabel={`Remove ${exercise.name}`} style={s.iconButton} onPress={() => setDraft({ ...draft, exercises: draft.exercises.filter(e => e.id !== exercise.id) })}><Icon name="trash-outline" color={colors.muted} /></Pressable></View>
        <View style={s.row}><Text style={[s.muted, { width: 32 }]}>Set</Text><Text style={[s.muted, s.flex]}>Reps</Text><Text style={[s.muted, s.flex]}>Kg</Text><Text style={s.muted}>Done</Text></View>
        {exercise.sets.map((set, index) => <View key={set.id} style={s.row}><Text style={[s.body, { width: 32 }]}>{index + 1}</Text>
          <Input style={s.flex} accessibilityLabel={`${exercise.name} set ${index + 1} reps`} keyboardType="number-pad" value={set.reps} maxLength={4} onChangeText={reps => updateExercise(exercise.id, e => ({ ...e, sets: e.sets.map(x => x.id === set.id ? { ...x, reps } : x) }))} />
          <Input style={s.flex} accessibilityLabel={`${exercise.name} set ${index + 1} weight in kilograms`} keyboardType="decimal-pad" placeholder="0" value={set.weight} maxLength={6} onChangeText={weight => updateExercise(exercise.id, e => ({ ...e, sets: e.sets.map(x => x.id === set.id ? { ...x, weight } : x) }))} />
          <Pressable accessibilityRole="checkbox" accessibilityLabel={`${exercise.name} set ${index + 1} completed`} accessibilityState={{ checked: set.done }} style={[s.check, set.done && { backgroundColor: colors.blue }]} onPress={() => updateExercise(exercise.id, e => ({ ...e, sets: e.sets.map(x => x.id === set.id ? { ...x, done: !x.done } : x) }))}><Icon name={set.done ? 'checkmark' : 'ellipse-outline'} size={20} /></Pressable>
        </View>)}
        <Button title="Add set" secondary onPress={() => updateExercise(exercise.id, e => ({ ...e, sets: [...e.sets, { id: `${Date.now()}-${e.sets.length}`, reps: '10', weight: '', done: false }] }))} />
      </View>)}
      <Button title="Add exercise" secondary icon="add" onPress={() => setPicker(true)} />
      {!!error && <Text accessibilityRole="alert" style={s.error}>{error}</Text>}
      <Button title={busy ? 'Saving…' : 'Finish & save workout'} disabled={busy} icon="checkmark-circle-outline" onPress={save} />
      <Button title="Discard workout" secondary disabled={busy} onPress={() => setDiscard(true)} />
    </>}
  </ScrollView></KeyboardAvoidingView>
    <Sheet visible={picker} title="Add Exercise" onClose={() => setPicker(false)}>
      {picker && <ExercisePicker onSelect={name => {
        setDraft(current => ({ ...current, exercises: [...current.exercises, newExercise(name)] }));
        setPicker(false);
      }} />}
    </Sheet>
    <Sheet visible={discard} title="Discard this workout?" onClose={() => setDiscard(false)}><View style={s.content}><Text style={s.muted}>This unfinished session will be removed.</Text><Button title="Keep working out" onPress={() => setDiscard(false)} /><Button title="Discard session" secondary onPress={() => { setDraft(null); setDiscard(false); }} /></View></Sheet>
  </SafeAreaView>;
}

function History({ navigation }) {
  const { data } = useContext(Context);
  const [selected, setSelected] = useState(null);
  const [query, setQuery] = useState('');
  const totals = summarize(data.sessions);
  return <SafeAreaView edges={['top']} style={s.screen}><FlatList contentContainerStyle={s.content} data={data.sessions.filter(x => `${x.name} ${x.exercises.map(e => e.name).join(' ')}`.toLowerCase().includes(query.toLowerCase()))} keyExtractor={x => x.id}
    ListHeaderComponent={<View style={s.stack}><Header title="History" /><Stats items={[[data.sessions.length, 'Sessions'], [totals.sets, 'Sets'], [totals.reps, 'Reps']]} /><Input accessibilityLabel="Search workout history" placeholder="Search workouts or exercises…" value={query} onChangeText={setQuery} /></View>}
    ListEmptyComponent={<><Empty icon="time-outline" title={query ? 'No matching sessions' : 'No workouts yet'} text={query ? 'Try a different workout or exercise name.' : 'Your saved sessions will appear here.'} />{!query && <Button title="Start a workout" onPress={() => navigation.navigate('Workout')} />}</>}
    renderItem={({ item }) => { const total = summarize([item]); return <Pressable accessibilityRole="button" accessibilityLabel={`View ${item.name}`} style={s.card} onPress={() => setSelected(item)}><Text style={s.eyebrow}>{new Date(item.finishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</Text><View style={s.row}><Text style={[s.heading, s.flex]}>{item.name}</Text><Icon name="chevron-forward" color={colors.blue} /></View><Text style={s.muted}>{item.exercises.length} exercises · {total.sets} sets · {total.reps} reps</Text><Text style={s.muted}>{item.durationMinutes} min · {item.exercises.map(e => e.name).join(', ')}</Text></Pressable>; }} />
    <Sheet visible={!!selected} title="Session details" onClose={() => setSelected(null)}>{selected && <ScrollView contentContainerStyle={s.content}><Header eyebrow={new Date(selected.finishedAt).toLocaleString()} title={selected.name} subtitle={`${selected.durationMinutes} minute session`} />{selected.exercises.map(e => <View key={e.id} style={s.card}><Text style={s.heading}>{e.name}</Text>{e.sets.map((set, i) => <Text key={set.id} style={s.body}>Set {i + 1}    {set.reps} reps    ·    {set.weight ? `${set.weight} kg` : 'Bodyweight'}</Text>)}</View>)}</ScrollView>}</Sheet>
  </SafeAreaView>;
}
function Profile() {
  const { data, commit, busy, setNotice } = useContext(Context);
  const [name, setName] = useState(data.name);
  const totals = summarize(data.sessions);
  return <SafeAreaView edges={['top']} style={s.screen}>
    <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={s.content}>
      <Header title="Profile" />
      <View style={s.profileRow}>
        <View style={s.avatar}><Text style={s.avatarText}>{(data.name.trim()[0] || 'Y').toUpperCase()}</Text></View>
        <View style={s.flex}><Text style={s.heading}>{data.name || 'Your name'}</Text><Text style={s.muted}>{data.sessions.length} workouts</Text></View>
      </View>
      <Text style={s.sectionLabel}>Overview</Text>
      <Stats items={[[data.sessions.length, 'Workouts'], [totals.reps, 'Reps'], [totals.minutes, 'Minutes']]} />
      {!data.sessions.length && <Empty icon="bar-chart-outline" title="No data yet" />}
      <Text style={s.sectionLabel}>Edit profile</Text>
      <View style={s.card}>
        <Text style={s.body}>Display name</Text>
        <Input accessibilityLabel="Display name" value={name} onChangeText={setName} placeholder="Your name" maxLength={40} />
        <Button title="Save name" secondary disabled={busy || !name.trim()} onPress={async () => { if (await commit({ ...data, name: name.trim() })) setNotice('Name saved.'); }} />
      </View>
      <Text style={s.footnote}>Workouts are saved on this device.</Text>
    </ScrollView>
  </SafeAreaView>;
}

function AppNavigation() {
  const insets = useSafeAreaInsets();
  return <NavigationContainer theme={{ ...DarkTheme, colors: { ...DarkTheme.colors, background: colors.bg, card: colors.card, primary: colors.blue } }}><Tabs.Navigator screenOptions={({ route }) => ({ headerShown: false, tabBarActiveTintColor: colors.blue, tabBarInactiveTintColor: colors.muted, tabBarStyle: { backgroundColor: colors.card, borderTopWidth: 0, height: 60 + insets.bottom, paddingBottom: insets.bottom + 10, paddingTop: 4 }, tabBarLabelStyle: { fontSize: 12, marginBottom: 4 }, tabBarItemStyle: { paddingTop: 0 }, tabBarIcon: ({ color, size }) => <Icon name={{ Workout: 'barbell-outline', History: 'time-outline', Profile: 'person-outline' }[route.name]} color={color} size={size} /> })}><Tabs.Screen name="Workout" component={Workout} /><Tabs.Screen name="History" component={History} /><Tabs.Screen name="Profile" component={Profile} /></Tabs.Navigator></NavigationContainer>;
}

export default function App() {
  const [data, setData] = useState({ name: '', sessions: [] });
  const [ready, setReady] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  // Give the brand reveal a brief moment; storage loads at the same time.
  useEffect(() => {
    const timer = setTimeout(() => setIntroDone(true), 1100);
    return () => clearTimeout(timer);
  }, []);
  const [loadError, setLoadError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const saving = useRef(false);
  async function load() {
    setLoadError(false);
    try { const raw = await AsyncStorage.getItem(KEY); if (raw) { const parsed = JSON.parse(raw); if (typeof parsed.name !== 'string' || !Array.isArray(parsed.sessions)) throw new Error('Invalid saved data'); setData(parsed); } setReady(true); }
    catch { setLoadError(true); }
  }
  useEffect(() => { load(); }, []);
  async function commit(next) {
    if (saving.current) return false;
    saving.current = true; setBusy(true);
    try { await AsyncStorage.setItem(KEY, JSON.stringify(next)); setData(next); return true; }
    catch { setNotice('Could not save on this device. Please try again.'); return false; }
    finally { saving.current = false; setBusy(false); }
  }
  return <SafeAreaProvider><StatusBar style="light" /><Context.Provider value={{ data, commit, busy, setNotice }}><View style={s.app}>
    {(!introDone || (!ready && !loadError)) ? <EmberLaunch /> : !ready ? <View style={s.empty}>{loadError ? <><Text style={s.body}>Could not load your saved workouts.</Text><Button title="Retry" onPress={load} /></> : <ActivityIndicator color={colors.blue} />}</View> : <>
      {!!notice && <SafeAreaView edges={['top']} style={s.notice}><Text accessibilityLiveRegion="polite" style={[s.body, s.flex]}>{notice}</Text><Pressable accessibilityRole="button" accessibilityLabel="Dismiss message" style={s.iconButton} onPress={() => setNotice('')}><Icon name="close" /></Pressable></SafeAreaView>}
      <AppNavigation />
    </>}
  </View></Context.Provider></SafeAreaProvider>;
}
const s = StyleSheet.create({
  flex: { flex: 1 },
  app: { flex: 1, backgroundColor: colors.bg },
  screen: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 18, width: '100%', maxWidth: 640, alignSelf: 'center', paddingBottom: 36 },
  header: { gap: 18, marginTop: 4, marginBottom: 6 },
  brand: { color: colors.text, fontSize: 22, fontWeight: '600' },
  title: { color: colors.text, fontSize: 28, fontWeight: '600' },
  eyebrow: { color: colors.muted, fontSize: 13 },
  heading: { color: colors.text, fontSize: 18, fontWeight: '500' },
  body: { color: colors.text, fontSize: 15, lineHeight: 23 },
  muted: { color: colors.muted, fontSize: 14, lineHeight: 22 },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: '500', marginTop: 8 },
  sectionLabel: { color: colors.muted, fontSize: 16, marginTop: 8 },
  startButton: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 18, borderRadius: 12, backgroundColor: colors.card, minHeight: 60 },
  actionText: { color: colors.text, fontSize: 18, flexShrink: 1 },
  routines: { flexDirection: 'row', flexWrap: 'wrap', gap: 14 },
  routine: { flex: 1, minWidth: 130, minHeight: 146, backgroundColor: colors.card, borderRadius: 12, padding: 18, alignItems: 'center', justifyContent: 'center', gap: 10 },
  routineTitle: { color: colors.text, fontSize: 17, textAlign: 'center' },
  card: { backgroundColor: colors.card, padding: 18, borderRadius: 12, gap: 14, marginBottom: 2 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  button: { minHeight: 48, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 10, backgroundColor: '#a9401c', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  buttonText: { color: '#fff', fontWeight: '500', fontSize: 16 },
  secondary: { backgroundColor: '#2b2b2d' },
  input: { backgroundColor: '#111111', borderWidth: 1, borderColor: '#38383a', borderRadius: 8, padding: 12, color: colors.text, minHeight: 48, fontSize: 16, minWidth: 0 },
  stat: { flex: 1, paddingVertical: 12, alignItems: 'center', gap: 6 },
  statValue: { color: colors.text, fontWeight: '400', fontSize: 26 },
  empty: { backgroundColor: colors.card, borderRadius: 12, minHeight: 180, padding: 30, gap: 18, alignItems: 'center', justifyContent: 'center' },
  check: { width: 44, height: 48, borderRadius: 8, backgroundColor: '#333335', alignItems: 'center', justifyContent: 'center' },
  iconButton: { padding: 12 },
  sheetHeader: { padding: 20 },
  error: { color: '#ffa5a5', lineHeight: 22 },
  stack: { gap: 18, marginBottom: 20 },
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 20, paddingVertical: 12 },
  avatar: { backgroundColor: '#a9401c', width: 76, height: 76, borderRadius: 38, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontSize: 36, fontWeight: '400' },
  footnote: { color: colors.muted, fontSize: 13, lineHeight: 20 },
  notice: { backgroundColor: '#38251e', paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', gap: 8 },
});
